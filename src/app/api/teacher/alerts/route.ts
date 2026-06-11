import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "~/lib/prisma";

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const alerts = await prisma.teacherAlert.findMany({
    where: { userId: Number(token.id) },
    orderBy: { createdAt: "desc" },
    include: { exam: { select: { name: true, class: true, section: true } } },
  });

  return NextResponse.json(alerts);
}
