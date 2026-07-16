import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { Prisma } from "@prisma/client";
import { prisma } from "~/lib/prisma";
import { requireAdmin } from "~/lib/admin-guard";
import { normalizePhone } from "~/lib/phone";

const CLASSES = ["8", "9", "10"];
const SECTIONS = ["A", "B", "C"];

function clean(v: unknown): string | null {
  if (typeof v !== "string" && typeof v !== "number") return null;
  const t = String(v).trim();
  return t.length ? t : null;
}

// Lazy-loaded when an admin expands a student row in the Students table.
// Returns the student's marks grouped per exam so the Student ↔ Mark relation
// is visible inline without loading every student's marks up front.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const id = Number((await params).id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Invalid student id." }, { status: 400 });
  }

  const student = await prisma.student.findUnique({
    where: { id },
    select: { id: true, admissionNumber: true, name: true, class: true, section: true, parentPhone: true, rollNumber: true, status: true },
  });
  if (!student) {
    return NextResponse.json({ error: "Student not found." }, { status: 404 });
  }

  const marks = await prisma.mark.findMany({
    where: { studentId: id },
    select: {
      subject: true,
      value: true,
      exam: { select: { id: true, name: true, status: true, createdAt: true } },
    },
    orderBy: [{ examId: "desc" }, { subject: "asc" }],
  });

  type MarkRow = (typeof marks)[number];

  // Group flat marks rows into one entry per exam.
  const byExam = new Map<number, {
    examId: number;
    examName: string;
    status: string;
    createdAt: Date;
    marks: { subject: string; value: string }[];
  }>();
  for (const m of marks as MarkRow[]) {
    const e = m.exam;
    if (!byExam.has(e.id)) {
      byExam.set(e.id, { examId: e.id, examName: e.name, status: e.status, createdAt: e.createdAt, marks: [] });
    }
    byExam.get(e.id)!.marks.push({ subject: m.subject, value: m.value });
  }

  const exams = [...byExam.values()].map((ex) => {
    const numeric = ex.marks
      .map((mk) => Number(mk.value))
      .filter((n) => Number.isFinite(n));
    return {
      examId: ex.examId,
      examName: ex.examName,
      status: ex.status,
      subjectCount: ex.marks.length,
      obtained: numeric.reduce((a, b) => a + b, 0),
      marks: ex.marks,
    };
  });

  return NextResponse.json({ student: { ...student, class: String(student.class) }, exams });
}

// PATCH /api/admin/students/[id] — edit details, transfer (class/section),
// correct the parent phone, or activate/deactivate. Only the provided fields
// change; every change is recorded in the audit log with the exact field diff.
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdmin(request);
  if (!guard.ok) {
    return NextResponse.json({ error: "Admin access required." }, { status: guard.status });
  }

  const id = Number((await params).id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Invalid student id." }, { status: 400 });
  }

  const target = await prisma.student.findUnique({ where: { id } });
  if (!target) {
    return NextResponse.json({ error: "Student not found." }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const data: Prisma.StudentUpdateInput = {};
  const changes: string[] = [];

  if ("name" in body) {
    const name = clean(body.name);
    if (!name) return NextResponse.json({ error: "Student name cannot be empty." }, { status: 400 });
    if (name !== target.name) { data.name = name; changes.push(`name: "${target.name}" → "${name}"`); }
  }

  if ("class" in body) {
    const cls = clean(body.class);
    if (!cls || !CLASSES.includes(cls)) return NextResponse.json({ error: `Class must be one of ${CLASSES.join(", ")}.` }, { status: 400 });
    if (cls !== String(target.class)) { data.class = cls; changes.push(`class: ${target.class} → ${cls}`); }
  }

  if ("section" in body) {
    const section = clean(body.section);
    if (!section || !SECTIONS.includes(section)) return NextResponse.json({ error: `Section must be one of ${SECTIONS.join(", ")}.` }, { status: 400 });
    if (section !== target.section) { data.section = section; changes.push(`section: ${target.section} → ${section}`); }
  }

  if ("rollNumber" in body) {
    const rollNumber = clean(body.rollNumber);
    if (rollNumber !== target.rollNumber) { data.rollNumber = rollNumber; changes.push(`roll: ${target.rollNumber ?? "—"} → ${rollNumber ?? "—"}`); }
  }

  if ("parentPhone" in body) {
    const raw = clean(body.parentPhone);
    if (!raw) return NextResponse.json({ error: "Parent phone number cannot be empty." }, { status: 400 });
    let parentPhone: string;
    try {
      parentPhone = normalizePhone(raw);
    } catch (e) {
      return NextResponse.json({ error: e instanceof Error ? e.message : "Invalid phone number." }, { status: 400 });
    }
    if (parentPhone !== target.parentPhone) { data.parentPhone = parentPhone; changes.push(`phone: ${target.parentPhone} → ${parentPhone}`); }
  }

  if ("status" in body) {
    const status = String(body.status).toUpperCase();
    if (status !== "ACTIVE" && status !== "INACTIVE") {
      return NextResponse.json({ error: "Status must be ACTIVE or INACTIVE." }, { status: 400 });
    }
    if (status !== target.status) { data.status = status; changes.push(`status: ${target.status} → ${status}`); }
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No changes provided." }, { status: 400 });
  }

  try {
    const student = await prisma.student.update({
      where: { id },
      data,
      select: { id: true, admissionNumber: true, name: true, class: true, section: true, parentPhone: true, rollNumber: true, status: true },
    });
    const action =
      "status" in data && Object.keys(data).length === 1
        ? data.status === "ACTIVE" ? "student_activate" : "student_deactivate"
        : ("class" in data || "section" in data) ? "student_transfer"
        : "student_update";
    await prisma.auditLog.create({
      data: { userId: guard.user.id, action, note: `${target.admissionNumber}: ${changes.join("; ")}` },
    });
    return NextResponse.json({ student: { ...student, class: String(student.class) } });
  } catch (e) {
    console.error("[admin/students/:id] update failed:", e);
    return NextResponse.json({ error: "Could not update student." }, { status: 500 });
  }
}
