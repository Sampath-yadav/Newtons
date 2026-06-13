import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "~/lib/prisma";

// Admin students browser — powers the ERP-style table with embedded column
// filters. Filtering happens server-side so the table scales past what the
// browser can hold, and the distinct class/section lists are derived from real
// data so the column dropdowns only ever offer values that exist.
export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const cls     = searchParams.get("class")?.trim()   || "";
  const section = searchParams.get("section")?.trim() || "";
  const q       = searchParams.get("q")?.trim()       || "";

  const where: {
    class?: string;
    section?: string;
    OR?: Array<Partial<Record<"name" | "admissionNumber" | "parentPhone", { contains: string; mode: "insensitive" }>>>;
  } = {};
  if (cls)     where.class = cls;
  if (section) where.section = section;
  if (q) {
    where.OR = [
      { name:            { contains: q, mode: "insensitive" } },
      { admissionNumber: { contains: q, mode: "insensitive" } },
      { parentPhone:     { contains: q, mode: "insensitive" } },
    ];
  }

  const [students, total, classGroups, sectionGroups] = await Promise.all([
    prisma.student.findMany({
      where,
      orderBy: [{ class: "asc" }, { section: "asc" }, { name: "asc" }],
      take: 1000,
      select: {
        id: true,
        admissionNumber: true,
        name: true,
        class: true,
        section: true,
        parentPhone: true,
        _count: { select: { marks: true } },
      },
    }),
    prisma.student.count({ where }),
    prisma.student.groupBy({ by: ["class"],   orderBy: { class: "asc" } }),
    prisma.student.groupBy({ by: ["section"], orderBy: { section: "asc" } }),
  ]);

  type Row = (typeof students)[number];
  return NextResponse.json({
    students: students.map((s: Row) => ({
      id: s.id,
      admissionNumber: s.admissionNumber,
      name: s.name,
      class: s.class,
      section: s.section,
      parentPhone: s.parentPhone,
      marksCount: s._count.marks,
    })),
    total,
    returned: students.length,
    filters: {
      classes:  classGroups.map((g: { class: string }) => g.class),
      sections: sectionGroups.map((g: { section: string }) => g.section),
    },
  });
}
