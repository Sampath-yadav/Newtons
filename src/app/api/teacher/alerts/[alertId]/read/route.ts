import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "~/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ alertId: string }> }
) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { alertId } = await params;
  const id = Number(alertId);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid alert ID" }, { status: 400 });

  await prisma.teacherAlert.updateMany({
    where: { id, userId: Number(token.id) },
    data: { isRead: true },
  });

  return NextResponse.json({ ok: true });
}
