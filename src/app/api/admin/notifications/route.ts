import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "~/lib/prisma";
import { sendResultNotification, buildResultMessage } from "~/lib/notifications";

interface DispatchBody {
  examId: number;
  studentId: number;
}

// Sends a published result link to one student's parent, server-side, via the
// notification service (WhatsApp first, automatic SMS fallback). The server
// builds the message and looks up the secure token — it never trusts the client
// for the link or destination.
export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const { examId, studentId } = (await request.json()) as DispatchBody;
  if (!examId || !studentId) {
    return NextResponse.json({ error: "examId and studentId are required." }, { status: 400 });
  }

  const exam = await prisma.exam.findUnique({ where: { id: examId } });
  if (!exam) return NextResponse.json({ error: "Exam not found." }, { status: 404 });
  if (exam.status !== "published") {
    return NextResponse.json({ error: "Exam is not published." }, { status: 409 });
  }

  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) return NextResponse.json({ error: "Student not found." }, { status: 404 });

  const resultToken = await prisma.resultToken.findFirst({
    where: { examId, studentId },
  });
  if (!resultToken) {
    return NextResponse.json({ error: "No result token for this student/exam." }, { status: 404 });
  }

  const base = process.env.NEXT_PUBLIC_BASE_URL ?? request.nextUrl.origin;
  const link = `${base}/parent-portal/results/${resultToken.token}`;
  const body = buildResultMessage({
    examName: exam.name,
    studentName: student.name,
    className: exam.class,
    section: exam.section,
    link,
  });

  const outcome = await sendResultNotification({
    studentId,
    examId,
    parentPhone: student.parentPhone,
    body,
  });

  return NextResponse.json(outcome, { status: outcome.ok ? 200 : 502 });
}
