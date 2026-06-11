import { NextRequest, NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { PARENT_COOKIE, verifyParentSession } from "~/lib/parent-session";
import { getExamConfig, computeStudentResult } from "~/lib/exam-config";

// Academic year label from a date (June–March → YYYY-(YY+1)).
function academicYear(d: Date): string {
  const y = d.getFullYear();
  const startYear = d.getMonth() >= 5 ? y : y - 1; // month index 5 = June
  return `${startYear}-${String((startYear + 1) % 100).padStart(2, "0")}`;
}

export async function GET(request: NextRequest) {
  // ── Auth: signed parent cookie only; scopes everything to this studentId ──
  const studentId = verifyParentSession(request.cookies.get(PARENT_COOKIE)?.value);
  if (!studentId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) {
    return NextResponse.json({ error: "Student not found." }, { status: 404 });
  }

  // Published exams this student has marks in.
  const myMarks = await prisma.mark.findMany({
    where: { studentId, exam: { status: "published" } },
    include: { exam: true },
  });

  // Group the student's own marks by exam.
  const examMap = new Map<number, { exam: typeof myMarks[number]["exam"]; marks: Record<string, string> }>();
  for (const m of myMarks) {
    if (!examMap.has(m.examId)) examMap.set(m.examId, { exam: m.exam, marks: {} });
    examMap.get(m.examId)!.marks[m.subject] = m.value;
  }
  const examIds = [...examMap.keys()];

  // Fetch every student's marks for these exams once, for ranking.
  const allMarks = examIds.length
    ? await prisma.mark.findMany({
        where: { examId: { in: examIds } },
        select: { examId: true, studentId: true, subject: true, value: true },
      })
    : [];

  // examId → studentId → { subject: value }
  const byExam = new Map<number, Map<number, Record<string, string>>>();
  for (const m of allMarks) {
    if (!byExam.has(m.examId)) byExam.set(m.examId, new Map());
    const studs = byExam.get(m.examId)!;
    if (!studs.has(m.studentId)) studs.set(m.studentId, {});
    studs.get(m.studentId)![m.subject] = m.value;
  }

  const exams = [...examMap.values()]
    .map(({ exam, marks }) => {
      let config;
      try { config = getExamConfig(exam.name); } catch { return null; }

      const result = computeStudentResult(marks, config);

      // Rank by present total within the same exam (competition ranking).
      const peers = byExam.get(exam.id);
      let rank: number | null = null;
      let classSize = 0;
      if (peers) {
        const totals: number[] = [];
        for (const pmarks of peers.values()) {
          totals.push(computeStudentResult(pmarks, config).total);
        }
        classSize = totals.length;
        rank = 1 + totals.filter((t) => t > result.total).length;
      }

      const subjects = config.subjects.map((s) => ({
        subject: s.name,
        value: marks[s.name] ?? "AB",
        max: s.max,
      }));

      return {
        examId: exam.id,
        name: exam.name,
        createdAt: exam.createdAt,
        publishedAt: exam.publishedAt,
        total: result.total,
        maxPresent: result.maxPresent,
        fullMax: result.fullMax,
        percentage: result.percentage, // string: "85.8" or "—"
        grade: result.grade,
        absentCount: result.absentCount,
        rank,
        classSize,
        subjects,
      };
    })
    .filter((e): e is NonNullable<typeof e> => e !== null)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  // Trend across exams (skip all-absent exams).
  const trend = exams
    .filter((e) => e.percentage !== "—")
    .map((e) => ({ name: e.name, percentage: parseFloat(e.percentage) }));

  // Overall summary.
  const avgPct = trend.length
    ? Math.round((trend.reduce((a, b) => a + b.percentage, 0) / trend.length) * 10) / 10
    : null;
  const latest = trend.length ? trend[trend.length - 1] : null;

  return NextResponse.json({
    student: {
      name: student.name,
      admissionNumber: student.admissionNumber,
      class: student.class,
      section: student.section,
      academicYear: academicYear(new Date()),
    },
    overall: {
      examsCount: exams.length,
      averagePercentage: avgPct,
      latestPercentage: latest?.percentage ?? null,
      latestExam: latest?.name ?? null,
    },
    exams,
    trend,
  });
}
