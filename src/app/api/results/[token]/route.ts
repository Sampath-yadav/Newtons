import { NextRequest, NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { getExamConfig, computeStudentResult } from "~/lib/exam-config";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  // ── Check 1: token must exist ──────────────────────────────────────────────
  const resultToken = await prisma.resultToken.findUnique({
    where: { token },
    include: {
      student: true,
      exam: true,
    },
  });

  if (!resultToken) {
    return NextResponse.json({ error: "Result not found or link has expired." }, { status: 404 });
  }

  // ── Check 2: exam must be published ────────────────────────────────────────
  if (resultToken.exam.status !== "published") {
    return NextResponse.json({ error: "Results are not yet published." }, { status: 403 });
  }

  // ── Check 3: fetch ONLY this student's marks for this exam ──────────────────
  const marks = await prisma.mark.findMany({
    where: { studentId: resultToken.studentId, examId: resultToken.examId },
  });

  // Use the exam config as the single source of truth for per-subject max marks.
  let config;
  try {
    config = getExamConfig(resultToken.exam.name);
  } catch {
    return NextResponse.json({ error: "Result configuration error. Please contact the school office." }, { status: 500 });
  }

  // Map DB marks → { subject: value } so we can compute with the shared helper.
  const markMap: Record<string, string> = {};
  for (const m of marks) markMap[m.subject] = m.value;

  const result = computeStudentResult(markMap, config);

  // Audit the access — fire-and-forget so it never blocks or fails the (often
  // 2G) parent page. Records which token/student/exam was viewed, plus ip/ua.
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const userAgent = request.headers.get("user-agent") ?? null;
  void prisma.resultAccessLog
    .create({ data: { token, studentId: resultToken.studentId, examId: resultToken.examId, ip, userAgent } })
    .catch(() => { /* logging must never break result delivery */ });

  // Return subjects in config order, each with its own max — never assume /100.
  const orderedMarks = config.subjects.map((s) => ({
    subject: s.name,
    value: markMap[s.name] ?? "AB",
    max: s.max,
  }));

  return NextResponse.json({
    student: {
      name: resultToken.student.name,
      admissionNumber: resultToken.student.admissionNumber,
      class: resultToken.student.class,
      section: resultToken.student.section,
    },
    exam: {
      name: resultToken.exam.name,
      publishedAt: resultToken.exam.publishedAt,
    },
    marks: orderedMarks,
    summary: {
      total: result.total,
      maxMarks: result.maxPresent,        // denominator excludes absent subjects
      fullMax: config.totalMax,           // full paper max (for reference)
      percentage: result.percentage,      // already excludes absent subjects
      grade: result.grade,                // school SSC grade scale
      absentCount: result.absentCount,
    },
  });
}
