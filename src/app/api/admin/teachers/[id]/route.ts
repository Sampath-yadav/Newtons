import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "~/lib/prisma";
import { requireAdmin } from "~/lib/admin-guard";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SELECT = {
  id: true,
  name: true,
  email: true,
  subject: true,
  assignedClass: true,
  assignedSection: true,
  phone: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const;

function clean(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t.length ? t : null;
}

// GET /api/admin/teachers/[id] — view a single teacher.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdmin(request);
  if (!guard.ok) {
    return NextResponse.json({ error: "Admin access required." }, { status: guard.status });
  }

  const id = Number((await params).id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Invalid teacher id." }, { status: 400 });
  }

  const teacher = await prisma.user.findFirst({ where: { id, role: "TEACHER" }, select: SELECT });
  if (!teacher) {
    return NextResponse.json({ error: "Teacher not found." }, { status: 404 });
  }
  return NextResponse.json({ teacher });
}

// PATCH /api/admin/teachers/[id] — edit profile fields and/or toggle status
// (activate / disable). Only TEACHER rows can be touched here, so this endpoint
// can never escalate or alter an admin account.
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
    return NextResponse.json({ error: "Invalid teacher id." }, { status: 400 });
  }

  const target = await prisma.user.findFirst({ where: { id, role: "TEACHER" } });
  if (!target) {
    return NextResponse.json({ error: "Teacher not found." }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const data: Prisma.UserUpdateInput = {};

  if ("name" in body) {
    const name = clean(body.name);
    if (!name) return NextResponse.json({ error: "Full name cannot be empty." }, { status: 400 });
    data.name = name;
  }

  if ("subject" in body) {
    const subject = clean(body.subject);
    if (!subject) return NextResponse.json({ error: "Subject cannot be empty." }, { status: 400 });
    data.subject = subject;
  }

  // These are nullable — an empty value clears the assignment.
  if ("assignedClass" in body) data.assignedClass = clean(body.assignedClass);
  if ("assignedSection" in body) data.assignedSection = clean(body.assignedSection);
  if ("phone" in body) data.phone = clean(body.phone);

  if ("email" in body) {
    const emailRaw = clean(body.email);
    if (!emailRaw || !EMAIL_RE.test(emailRaw.toLowerCase())) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    const email = emailRaw.toLowerCase();
    if (email !== target.email.toLowerCase()) {
      const clash = await prisma.user.findFirst({
        where: { email: { equals: email, mode: "insensitive" }, id: { not: id } },
        select: { id: true },
      });
      if (clash) {
        return NextResponse.json({ error: "A user with this email already exists." }, { status: 409 });
      }
      data.email = email;
    }
  }

  if ("status" in body) {
    const status = String(body.status).toUpperCase();
    if (status !== "ACTIVE" && status !== "INACTIVE") {
      return NextResponse.json({ error: "Status must be ACTIVE or INACTIVE." }, { status: 400 });
    }
    data.status = status as "ACTIVE" | "INACTIVE";
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No changes provided." }, { status: 400 });
  }

  try {
    const teacher = await prisma.user.update({ where: { id }, data, select: SELECT });

    const action =
      "status" in data && Object.keys(data).length === 1
        ? data.status === "ACTIVE"
          ? "teacher_activate"
          : "teacher_disable"
        : "teacher_update";
    await prisma.auditLog.create({
      data: { userId: guard.user.id, action, note: `${action} for ${teacher.email}` },
    });

    return NextResponse.json({ teacher });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json({ error: "A user with this email already exists." }, { status: 409 });
    }
    console.error("[admin/teachers/:id] update failed:", e);
    return NextResponse.json({ error: "Could not update teacher." }, { status: 500 });
  }
}
