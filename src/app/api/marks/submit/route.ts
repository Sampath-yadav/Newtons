import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "~/lib/prisma";
import type { PreviewRow } from "~/app/api/marks/upload/route";
import { getExamConfig } from "~/lib/exam-config";

interface SubmitBody {
  class: string;
  section: string;
  examName: string;
  rows: PreviewRow[];
}

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const body = (await request.json()) as SubmitBody;
  const { rows, examName } = body;
  const cls     = body.class;
  const section = body.section;

  if (!cls || !section || !examName || !rows?.length) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  let config;
  try {
    config = getExamConfig(examName);
  } catch {
    return NextResponse.json({ error: `Unknown exam type: ${examName}` }, { status: 400 });
  }

  const subjects = config.subjects.map((s) => s.name);

  // Block duplicate pending/published upload for same class+section+exam
  const existing = await prisma.exam.findFirst({
    where: {
      class: cls,
      section,
      name: examName,
      status: { in: ["pending_approval", "published"] },
    },
  });

  if (existing) {
    return NextResponse.json(
      { error: `${examName} for Class ${cls}${section} is already ${existing.status}. Contact admin if a resubmission is needed.` },
      { status: 409 }
    );
  }

  // Resolve admission numbers → student IDs
  const admNos = rows.map((r) => r.admNo);
  const students = await prisma.student.findMany({
    where: { admissionNumber: { in: admNos } },
  });
  type StudentRow = { admissionNumber: string; id: number };
  const studentMap = new Map<string, StudentRow>(
    (students as StudentRow[]).map((s) => [s.admissionNumber, s])
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const exam = await prisma.$transaction(async (tx: any) => {
    const newExam = await tx.exam.create({
      data: {
        name: examName,
        class: cls,
        section,
        status: "pending_approval",
        uploadedById: Number(token.id),
      },
    });

    const markData: { studentId: number; examId: number; subject: string; value: string }[] = [];

    for (const row of rows) {
      const student = studentMap.get(row.admNo);
      if (!student) continue;
      for (const subject of subjects) {
        markData.push({
          studentId: student.id,
          examId: newExam.id,
          subject,
          value: row.marks[subject] ?? "",
        });
      }
    }

    await tx.mark.createMany({ data: markData });

    await tx.auditLog.create({
      data: {
        examId: newExam.id,
        userId: Number(token.id),
        action: "submit",
        note: `Submitted ${rows.length} students for ${examName} Class ${cls}${section}`,
      },
    });

    return newExam;
  });

  return NextResponse.json({ examId: exam.id, status: exam.status });
}
