import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "~/lib/prisma";

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const { examId, note } = (await request.json()) as { examId: number; note: string };
  if (!examId) return NextResponse.json({ error: "examId required" }, { status: 400 });

  const exam = await prisma.exam.findUnique({ where: { id: examId } });
  if (!exam) return NextResponse.json({ error: "Exam not found." }, { status: 404 });
  if (exam.status !== "pending_approval") {
    return NextResponse.json({ error: `Exam is ${exam.status} — cannot reject.` }, { status: 409 });
  }

  await prisma.$transaction(async (tx) => {
    await tx.exam.update({
      where: { id: examId },
      data: { status: "rejected", rejectNote: note ?? "" },
    });

    await tx.auditLog.create({
      data: {
        examId,
        userId: Number(token.id),
        action: "reject",
        note: note ?? "No reason given.",
      },
    });

    await tx.teacherAlert.create({
      data: {
        userId:  exam.uploadedById,
        examId,
        type:    "rejected",
        message: `Your ${exam.name} results for Class ${exam.class}${exam.section} have been REJECTED. Reason: ${note || "No reason given."}`,
      },
    });
  });

  return NextResponse.json({ ok: true });
}
