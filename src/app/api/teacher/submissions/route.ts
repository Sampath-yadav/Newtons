import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "~/lib/prisma";

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const exams = await prisma.exam.findMany({
    where: { uploadedById: Number(token.id) },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { marks: true } } },
  });

  type ExamRow = (typeof exams)[number];

  return NextResponse.json(
    exams.map((e: ExamRow) => ({
      id: e.id,
      name: e.name,
      class: e.class,
      section: e.section,
      status: e.status,
      rejectNote: e.rejectNote,
      publishedAt: e.publishedAt,
      createdAt: e.createdAt,
      studentCount: Math.round(e._count.marks / 7),
    }))
  );
}
