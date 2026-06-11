import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "~/lib/prisma";
import { sendResultNotification, buildResultMessage } from "~/lib/notifications";

// Sends the result link to every parent of a published exam, sequentially
// (avoids Twilio trial rate limits). Returns a per-student summary.
// In single-test-number mode this repeatedly messages the one test number.
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

  const exam = await prisma.exam.findUnique({ where: { id } });
  if (!exam) return NextResponse.json({ error: "Exam not found." }, { status: 404 });
  if (exam.status !== "published") {
    return NextResponse.json({ error: "Exam is not published." }, { status: 409 });
  }

  const tokens = await prisma.resultToken.findMany({
    where: { examId: id },
    include: {
      student: { select: { id: true, name: true, parentPhone: true } },
    },
    orderBy: { student: { name: "asc" } },
  });

  const base = process.env.NEXT_PUBLIC_BASE_URL ?? request.nextUrl.origin;

  const results: Array<{
    studentId: number;
    name: string;
    ok: boolean;
    channel: string | null;
    status: string;
    fellBack: boolean;
    error?: string;
  }> = [];

  // Sequential to stay within trial rate limits.
  for (const t of tokens) {
    const body = buildResultMessage({
      examName: exam.name,
      studentName: t.student.name,
      className: exam.class,
      section: exam.section,
      link: `${base}/parent-portal/results/${t.token}`,
    });
    const outcome = await sendResultNotification({
      studentId: t.studentId,
      examId: id,
      parentPhone: t.student.parentPhone,
      body,
    });
    results.push({
      studentId: t.studentId,
      name: t.student.name,
      ok: outcome.ok,
      channel: outcome.channel,
      status: outcome.status,
      fellBack: outcome.fellBack,
      error: outcome.error,
    });
  }

  const sent   = results.filter((r) => r.ok).length;
  const failed = results.length - sent;

  return NextResponse.json({ total: results.length, sent, failed, results });
}
