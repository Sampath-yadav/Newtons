import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { Prisma } from "@prisma/client";
import { prisma } from "~/lib/prisma";
import { requireAdmin } from "~/lib/admin-guard";
import { normalizePhone } from "~/lib/phone";

const CLASSES = ["8", "9", "10"];
const SECTIONS = ["A", "B", "C"];
const DEFAULT_PAGE_SIZE = 50;
const MAX_PAGE_SIZE = 200;

function clean(v: unknown): string | null {
  if (typeof v !== "string" && typeof v !== "number") return null;
  const t = String(v).trim();
  return t.length ? t : null;
}

// GET /api/admin/students — paginated, filter-first roster. Filtering and
// pagination are server-side so the table scales to thousands of students
// without ever loading them all into the browser.
export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const cls     = searchParams.get("class")?.trim()   || "";
  const section = searchParams.get("section")?.trim() || "";
  const status  = searchParams.get("status")?.trim().toUpperCase() || "";
  const q       = searchParams.get("q")?.trim()       || "";
  const page     = Math.max(1, Number(searchParams.get("page")) || 1);
  const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, Number(searchParams.get("pageSize")) || DEFAULT_PAGE_SIZE));

  const where: Prisma.StudentWhereInput = {};
  if (cls)     where.class = cls;
  if (section) where.section = section;
  if (status === "ACTIVE" || status === "INACTIVE") where.status = status;
  if (q) {
    where.OR = [
      { name:            { contains: q, mode: "insensitive" } },
      { admissionNumber: { contains: q, mode: "insensitive" } },
      { parentPhone:     { contains: q, mode: "insensitive" } },
      { rollNumber:      { contains: q, mode: "insensitive" } },
    ];
  }

  const [students, total, classGroups, sectionGroups, activeCount, inactiveCount] = await Promise.all([
    prisma.student.findMany({
      where,
      orderBy: [{ class: "asc" }, { section: "asc" }, { name: "asc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        admissionNumber: true,
        name: true,
        class: true,
        section: true,
        parentPhone: true,
        rollNumber: true,
        status: true,
        _count: { select: { marks: true } },
      },
    }),
    prisma.student.count({ where }),
    prisma.student.groupBy({ by: ["class"],   orderBy: { class: "asc" } }),
    prisma.student.groupBy({ by: ["section"], orderBy: { section: "asc" } }),
    // School-wide counts (no filter) so the stats bar always reflects reality.
    prisma.student.count({ where: { status: "ACTIVE" } }),
    prisma.student.count({ where: { status: "INACTIVE" } }),
  ]);

  type Row = (typeof students)[number];
  return NextResponse.json({
    students: students.map((s: Row) => ({
      id: s.id,
      admissionNumber: s.admissionNumber,
      name: s.name,
      class: String(s.class),
      section: s.section,
      parentPhone: s.parentPhone,
      rollNumber: s.rollNumber,
      status: s.status,
      marksCount: s._count.marks,
    })),
    total,
    returned: students.length,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
    filters: {
      classes:  classGroups.map((g: { class: string }) => String(g.class)),
      sections: sectionGroups.map((g: { section: string }) => g.section),
    },
    stats: {
      total: activeCount + inactiveCount,
      active: activeCount,
      inactive: inactiveCount,
    },
  });
}

// POST /api/admin/students — add a single student (new admission). Admission
// number is the business key (unique); phone is normalised to E.164 up front so
// a bad number is rejected here, never at SMS-send time.
export async function POST(request: NextRequest) {
  const guard = await requireAdmin(request);
  if (!guard.ok) {
    return NextResponse.json({ error: "Admin access required." }, { status: guard.status });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const admissionNumber = clean(body.admissionNumber);
  const name = clean(body.name);
  const cls = clean(body.class);
  const section = clean(body.section);
  const rollNumber = clean(body.rollNumber);
  const phoneRaw = clean(body.parentPhone);

  if (!admissionNumber) return NextResponse.json({ error: "Admission number is required." }, { status: 400 });
  if (!name) return NextResponse.json({ error: "Student name is required." }, { status: 400 });
  if (!cls || !CLASSES.includes(cls)) return NextResponse.json({ error: `Class must be one of ${CLASSES.join(", ")}.` }, { status: 400 });
  if (!section || !SECTIONS.includes(section)) return NextResponse.json({ error: `Section must be one of ${SECTIONS.join(", ")}.` }, { status: 400 });
  if (!phoneRaw) return NextResponse.json({ error: "Parent phone number is required." }, { status: 400 });

  let parentPhone: string;
  try {
    parentPhone = normalizePhone(phoneRaw);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Invalid phone number." }, { status: 400 });
  }

  const existing = await prisma.student.findUnique({
    where: { admissionNumber },
    select: { id: true },
  });
  if (existing) {
    return NextResponse.json({ error: `Admission number "${admissionNumber}" already exists.` }, { status: 409 });
  }

  try {
    const student = await prisma.student.create({
      data: { admissionNumber, name, class: cls, section, parentPhone, rollNumber, status: "ACTIVE" },
      select: { id: true, admissionNumber: true, name: true, class: true, section: true, parentPhone: true, rollNumber: true, status: true },
    });
    await prisma.auditLog.create({
      data: { userId: guard.user.id, action: "student_create", note: `Added student ${admissionNumber} (${name}) to ${cls}${section}` },
    });
    return NextResponse.json({ student: { ...student, class: String(student.class) } }, { status: 201 });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json({ error: `Admission number "${admissionNumber}" already exists.` }, { status: 409 });
    }
    console.error("[admin/students] create failed:", e);
    return NextResponse.json({ error: "Could not create student." }, { status: 500 });
  }
}
