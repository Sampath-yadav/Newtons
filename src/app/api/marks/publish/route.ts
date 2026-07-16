import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "~/lib/prisma";
import { randomUUID } from "crypto";

// Thrown inside the locked transaction if the exam is no longer publishable
// (another request already published it). Converted to a 409 by the caller.
class AlreadyPublishedError extends Error {
  constructor(public status: string) {
    super("already published");
  }
}

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "ADMIN") {
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

  // Serialize concurrent publishes of the SAME exam so two admins can't both
  // create tokens. The advisory lock is transaction-scoped (PgBouncer-safe); the
  // status is re-checked under the lock, and createMany is idempotent thanks to
  // the @@unique([examId, studentId]) on ResultToken.
  const lockKey = `publish:exam:${examId}`;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await prisma.$transaction(async (tx: any) => {
      await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${lockKey}))`;

      const fresh = await tx.exam.findUnique({ where: { id: examId }, select: { status: true } });
      if (!fresh || fresh.status !== "pending_approval") {
        throw new AlreadyPublishedError(fresh?.status ?? "missing");
      }

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
  } catch (e) {
    if (e instanceof AlreadyPublishedError) {
      return NextResponse.json({ error: `Exam is already ${e.status}.` }, { status: 409 });
    }
    throw e;
  }

  console.log(`[publish] exam ${examId} published with ${exam.marks.length} student token(s).`);
  return NextResponse.json({ ok: true });
}
