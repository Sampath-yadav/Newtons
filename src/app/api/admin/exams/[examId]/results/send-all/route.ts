import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "~/lib/prisma";
import { buildResultMessage, deliverMessage, resolveSendTarget } from "~/lib/notifications";
import { checkResultMapping } from "~/lib/result-mapping";

// Sends the result link to parents in ONE bounded batch and reports how many
// remain — the admin page calls this repeatedly until `remaining === 0`. This
// keeps each request short (no Vercel timeout at 600 students), is idempotent
// (already-sent parents are skipped), resumable across reloads, and crash-safe
// via per-recipient claim rows.
export const maxDuration = 60;

const BATCH_SIZE = 25;
// A "pending" claim older than this is treated as abandoned (crashed batch) and
// may be re-claimed, so a failed function never permanently strands a student.
const STALE_CLAIM_MS = 5 * 60 * 1000;

interface BatchBody {
  mode?: "pending" | "all"; // "pending" (default) = skip already-sent; "all" = force resend everyone
  studentId?: number;       // force a single student's resend
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ examId: string }> }
) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const { examId } = await params;
  const id = Number(examId);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid exam ID." }, { status: 400 });

  let body: BatchBody = {};
  try { body = (await request.json()) as BatchBody; } catch { /* empty body is fine */ }
  const forceStudentId = body.studentId;
  const mode = body.mode ?? "pending";

  const exam = await prisma.exam.findUnique({ where: { id } });
  if (!exam) return NextResponse.json({ error: "Exam not found." }, { status: 404 });
  if (exam.status !== "published") {
    return NextResponse.json({ error: "Exam is not published." }, { status: 409 });
  }

  const base = process.env.NEXT_PUBLIC_BASE_URL ?? request.nextUrl.origin;

  // ── Phase 1: claim a batch under an advisory lock (fast, NO network here) ───
  // Two concurrent runners can't grab the same students: the lock serialises
  // selection, and each claimed student gets a "pending" Notification row that
  // excludes them from the next selection.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const claim = await prisma.$transaction(async (tx: any) => {
    await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${`send:exam:${id}`}))`;

    const recent = new Date(Date.now() - STALE_CLAIM_MS);
    const blocking = await tx.notification.findMany({
      where: {
        examId: id,
        OR: [
          { status: { in: ["sent", "delivered"] } },        // already delivered
          { status: "pending", createdAt: { gt: recent } },  // in-flight claim
        ],
      },
      select: { studentId: true, status: true },
    });
    const succeeded = new Set<number>();
    const inflight = new Set<number>();
    for (const n of blocking) {
      if (n.status === "pending") inflight.add(n.studentId);
      else succeeded.add(n.studentId);
    }

    const tokens = await tx.resultToken.findMany({
      where: { examId: id },
      include: { student: { select: { id: true, name: true, parentPhone: true } } },
      orderBy: { studentId: "asc" },
    });

    // Never re-pick an in-flight student. Then narrow by mode.
    type TokenRow = { token: string; studentId: number; student: { id: number; name: string; parentPhone: string | null } };
    let candidates = (tokens as TokenRow[]).filter((t) => !inflight.has(t.studentId));
    if (forceStudentId != null) {
      candidates = candidates.filter((t) => t.studentId === forceStudentId); // forced single resend
    } else if (mode !== "all") {
      candidates = candidates.filter((t) => !succeeded.has(t.studentId));     // pending only (default)
    }

    const take = forceStudentId != null ? candidates : candidates.slice(0, BATCH_SIZE);
    const remaining = forceStudentId != null ? 0 : candidates.length - take.length;

    const claims: Array<{ claimId: number; token: string; student: TokenRow["student"] }> = [];
    for (const t of take) {
      const row = await tx.notification.create({
        data: { studentId: t.studentId, examId: id, type: "result", channel: "sms", status: "pending" },
      });
      claims.push({ claimId: row.id, token: t.token, student: t.student });
    }
    return { claims, remaining };
  });

  // ── Phase 2: deliver each claimed recipient (outside the lock/transaction) ──
  const results: Array<{ studentId: number; ok: boolean; channel: string | null; status: string; error?: string }> = [];
  let sent = 0, failed = 0, skipped = 0;

  for (const c of claim.claims) {
    const studentId = c.student.id;

    // Validate the student ↔ token ↔ exam mapping before sending (anti cross-map),
    // then resolve + gate the destination (test mode + Twilio trial allowlist).
    const mapping = checkResultMapping({ resultToken: { studentId, examId: id }, studentId, examId: id });
    const target = mapping.ok ? resolveSendTarget(c.student.parentPhone) : { to: null, skipReason: mapping.reason };
    const to = target.to;

    if (!to) {
      const reason = target.skipReason ?? "No valid parent phone on file.";
      await prisma.notification.update({ where: { id: c.claimId }, data: { status: "skipped", errorMessage: reason } });
      skipped++;
      results.push({ studentId, ok: false, channel: null, status: "skipped", error: reason });
      continue;
    }

    const message = buildResultMessage({
      examName: exam.name,
      studentName: c.student.name,
      className: exam.class,
      section: exam.section,
      link: `${base}/parent-portal/results/${c.token}`,
    });
    const d = await deliverMessage({ to, body: message, idempotencyKey: `result:${id}:${studentId}` });

    await prisma.notification.update({
      where: { id: c.claimId },
      data: {
        channel: "sms",
        status: d.ok ? "sent" : "failed",
        providerSid: d.providerSid,
        toNumber: to,
        errorCode: d.errorCode,
        errorMessage: d.ok ? null : (d.error ?? "Send failed."),
        sentAt: d.ok ? new Date() : null,
      },
    });

    if (d.ok) sent++; else failed++;
    results.push({ studentId, ok: d.ok, channel: d.channel, status: d.ok ? "sent" : "failed", error: d.error });
  }

  console.log(`[send] exam ${id} batch: processed=${claim.claims.length} sent=${sent} failed=${failed} skipped=${skipped} remaining=${claim.remaining}`);

  return NextResponse.json({
    processed: claim.claims.length,
    sent,
    failed,
    skipped,
    remaining: claim.remaining,
    results,
  });
}
