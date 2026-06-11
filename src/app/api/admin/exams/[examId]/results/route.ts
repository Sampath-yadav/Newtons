import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "~/lib/prisma";
import { isTestMode } from "~/lib/notifications";

// Lists the per-student parent result links for a PUBLISHED exam, so the admin
// can dispatch them via WhatsApp / SMS. Returns the secure token URL plus the
// most recent notification status for each student.
export async function GET(
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
    return NextResponse.json(
      { error: "Results can only be sent after the exam is published." },
      { status: 409 }
    );
  }

  // One token per student was generated at publish time.
  const tokens = await prisma.resultToken.findMany({
    where: { examId: id },
    include: {
      student: { select: { id: true, name: true, admissionNumber: true, parentPhone: true } },
    },
    orderBy: { student: { name: "asc" } },
  });

  // Latest dispatch per student for this exam (to show "Sent" state).
  const notifications = await prisma.notification.findMany({
    where: { examId: id },
    orderBy: { createdAt: "desc" },
  });
  const lastByStudent = new Map<number, { channel: string; status: string; sentAt: Date | null }>();
  for (const n of notifications) {
    if (!lastByStudent.has(n.studentId)) {
      lastByStudent.set(n.studentId, { channel: n.channel, status: n.status, sentAt: n.sentAt });
    }
  }

  const origin = request.nextUrl.origin;

  const recipients = tokens.map((t) => {
    const last = lastByStudent.get(t.studentId);
    return {
      studentId: t.studentId,
      name: t.student.name,
      admissionNumber: t.student.admissionNumber,
      parentPhone: t.student.parentPhone,
      token: t.token,
      link: `${origin}/parent-portal/results/${t.token}`,
      lastSent: last
        ? { channel: last.channel, status: last.status, sentAt: last.sentAt }
        : null,
    };
  });

  return NextResponse.json({
    exam: {
      id: exam.id,
      name: exam.name,
      class: exam.class,
      section: exam.section,
      publishedAt: exam.publishedAt,
    },
    recipients,
    sentCount: recipients.filter((r) => r.lastSent).length,
    testMode: isTestMode(),
    testNumber: isTestMode() ? process.env.NOTIFICATION_TEST_NUMBER ?? null : null,
  });
}
