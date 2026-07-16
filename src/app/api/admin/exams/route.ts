import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "~/lib/prisma";

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const exams = await prisma.exam.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      uploadedBy: { select: { name: true, email: true } },
      _count: { select: { marks: true } },
    },
  });

  type ExamWithCount = (typeof exams)[number];
  return NextResponse.json(
    exams.map((e: ExamWithCount) => ({
      ...e,
      studentCount: Math.round(e._count.marks / 7),
    }))
  );
}
