import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "~/lib/prisma";

export async function PATCH(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const result = await prisma.teacherAlert.updateMany({
    where: { userId: Number(token.id), isRead: false },
    data: { isRead: true },
  });

  return NextResponse.json({ ok: true, count: result.count });
}
