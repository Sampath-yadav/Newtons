import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "~/lib/prisma";

// Lazy-loaded when an admin expands a student row in the Students table.
// Returns the student's marks grouped per exam so the Student ↔ Mark relation
// is visible inline without loading every student's marks up front.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const id = Number((await params).id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Invalid student id." }, { status: 400 });
  }

  const student = await prisma.student.findUnique({
    where: { id },
    select: { id: true, admissionNumber: true, name: true, class: true, section: true, parentPhone: true },
  });
  if (!student) {
    return NextResponse.json({ error: "Student not found." }, { status: 404 });
  }

  const marks = await prisma.mark.findMany({
    where: { studentId: id },
    select: {
      subject: true,
      value: true,
      exam: { select: { id: true, name: true, status: true, createdAt: true } },
    },
    orderBy: [{ examId: "desc" }, { subject: "asc" }],
  });

  type MarkRow = (typeof marks)[number];

  // Group flat marks rows into one entry per exam.
  const byExam = new Map<number, {
    examId: number;
    examName: string;
    status: string;
    createdAt: Date;
    marks: { subject: string; value: string }[];
  }>();
  for (const m of marks as MarkRow[]) {
    const e = m.exam;
    if (!byExam.has(e.id)) {
      byExam.set(e.id, { examId: e.id, examName: e.name, status: e.status, createdAt: e.createdAt, marks: [] });
    }
    byExam.get(e.id)!.marks.push({ subject: m.subject, value: m.value });
  }

  const exams = [...byExam.values()].map((ex) => {
    const numeric = ex.marks
      .map((mk) => Number(mk.value))
      .filter((n) => Number.isFinite(n));
    return {
      examId: ex.examId,
      examName: ex.examName,
      status: ex.status,
      subjectCount: ex.marks.length,
      obtained: numeric.reduce((a, b) => a + b, 0),
      marks: ex.marks,
    };
  });

  return NextResponse.json({ student, exams });
}
