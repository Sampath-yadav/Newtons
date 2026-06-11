import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "~/lib/prisma";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const { examId } = (await request.json()) as { examId: number };
  if (!examId) return NextResponse.json({ error: "examId required" }, { status: 400 });

  const exam = await prisma.exam.findUnique({
    where: { id: examId },
    include: { marks: { select: { studentId: true }, distinct: ["studentId"] } },
  });

  if (!exam) return NextResponse.json({ error: "Exam not found." }, { status: 404 });
  if (exam.status !== "pending_approval") {
    return NextResponse.json({ error: `Exam is already ${exam.status}.` }, { status: 409 });
  }

  // Publish exam + generate one token per student in a transaction
  await prisma.$transaction(async (tx) => {
    await tx.exam.update({
      where: { id: examId },
      data: { status: "published", publishedAt: new Date() },
    });

    const tokenData = exam.marks.map((m) => ({
      token: randomUUID(),
      studentId: m.studentId,
      examId,
    }));

    await tx.resultToken.createMany({ data: tokenData, skipDuplicates: true });

    await tx.auditLog.create({
      data: {
        examId,
        userId: Number(token.id),
        action: "approve",
        note: `Published. ${tokenData.length} tokens generated.`,
      },
    });

    await tx.teacherAlert.create({
      data: {
        userId:  exam.uploadedById,
        examId,
        type:    "approved",
        message: `Your ${exam.name} results for Class ${exam.class}${exam.section} have been APPROVED and published.`,
      },
    });
  });

  return NextResponse.json({ ok: true });
}
