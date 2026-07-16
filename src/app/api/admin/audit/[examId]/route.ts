import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "~/lib/prisma";

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
  if (isNaN(id)) return NextResponse.json({ error: "Invalid exam ID" }, { status: 400 });

  const logs = await prisma.auditLog.findMany({
    where: { examId: id },
    include: { user: { select: { name: true, role: true } } },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(logs);
}
