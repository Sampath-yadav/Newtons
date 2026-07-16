import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "~/lib/prisma";
import { getExamConfig, computeStudentResult, getGrade } from "~/lib/exam-config";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ examId: string }> }
) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const { examId } = await params;
  const id = Number(examId);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid exam ID." }, { status: 400 });

  const exam = await prisma.exam.findUnique({
    where: { id },
    include: {
      uploadedBy: { select: { name: true, email: true } },
      marks: {
        include: { student: { select: { id: true, admissionNumber: true, name: true } } },
      },
    },
  });

  if (!exam) return NextResponse.json({ error: "Exam not found." }, { status: 404 });

  let config;
  try { config = getExamConfig(exam.name); }
  catch { return NextResponse.json({ error: "Unknown exam type in DB." }, { status: 500 }); }

  // ── Group marks by student ──────────────────────────────────────────────────
  const studentMap = new Map<number, { admissionNumber: string; name: string; marks: Record<string, string> }>();

  for (const mark of exam.marks as { studentId: number; subject: string; value: string; student: { id: number; admissionNumber: string; name: string } }[]) {
    if (!studentMap.has(mark.studentId)) {
      studentMap.set(mark.studentId, {
        admissionNumber: mark.student.admissionNumber,
        name: mark.student.name,
        marks: {},
      });
    }
    studentMap.get(mark.studentId)!.marks[mark.subject] = mark.value;
  }

  // ── Compute per-student results ─────────────────────────────────────────────
  const students = [...studentMap.values()].map((s) => {
    const result = computeStudentResult(s.marks, config);
    return { ...s, ...result };
  }).sort((a, b) => b.total - a.total);

  // ── Class statistics ────────────────────────────────────────────────────────
  const present = students.filter((s) => s.absentCount < config.subjects.length);
  const totals  = present.map((s) => s.total);
  const highest = totals.length ? Math.max(...totals) : 0;
  const lowest  = totals.length ? Math.min(...totals) : 0;
  const avgRaw  = totals.length ? totals.reduce((a, b) => a + b, 0) / totals.length : 0;
  const average = Math.round(avgRaw);

  const passCount = students.filter((s) => {
    const pct = s.maxPresent > 0 ? (s.total / s.maxPresent) * 100 : 0;
    return getGrade(pct) !== "F";
  }).length;

  const gradeDistribution: Record<string, number> = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0, D: 0, F: 0, "—": 0 };
  for (const s of students) gradeDistribution[s.grade] = (gradeDistribution[s.grade] ?? 0) + 1;

  const absentStudents = students.filter((s) => s.absentCount > 0).length;

  return NextResponse.json({
    exam: {
      id: exam.id,
      name: exam.name,
      class: exam.class,
      section: exam.section,
      status: exam.status,
      rejectNote: exam.rejectNote,
      publishedAt: exam.publishedAt,
      createdAt: exam.createdAt,
      uploadedBy: exam.uploadedBy,
    },
    config: {
      subjects: config.subjects.map((s) => s.name),
      subjectHeaders: config.subjects.map((s) => s.header),
      totalMax: config.totalMax,
    },
    students,
    stats: {
      studentCount: students.length,
      highest,
      lowest,
      average,
      maxMarks: config.totalMax,
      passCount,
      passPercentage: students.length > 0 ? ((passCount / students.length) * 100).toFixed(1) : "0",
      absentStudents,
      gradeDistribution,
    },
  });
}
