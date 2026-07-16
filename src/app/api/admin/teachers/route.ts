import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "~/lib/prisma";
import { requireAdmin } from "~/lib/admin-guard";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t.length ? t : null;
}

// GET /api/admin/teachers?q=&status=  — searchable teacher directory.
// Scoped strictly to role TEACHER so the admin roster never exposes other admins.
export async function GET(request: NextRequest) {
  const guard = await requireAdmin(request);
  if (!guard.ok) {
    return NextResponse.json({ error: "Admin access required." }, { status: guard.status });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() || "";
  const status = searchParams.get("status")?.trim().toUpperCase() || "";

  const where: Prisma.UserWhereInput = { role: "TEACHER" };
  if (status === "ACTIVE" || status === "INACTIVE") where.status = status;
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { subject: { contains: q, mode: "insensitive" } },
    ];
  }

  const teachers = await prisma.user.findMany({
    where,
    orderBy: [{ status: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      email: true,
      subject: true,
      assignedClass: true,
      assignedSection: true,
      phone: true,
      status: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ teachers });
}

// POST /api/admin/teachers — add a teacher. No password is generated: teachers
// authenticate by identity (credential login today, Google later). The row is
// what authorizes them, so creating it is the entire onboarding step.
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

  const name = clean(body.name);
  const emailRaw = clean(body.email);
  const subject = clean(body.subject);
  const assignedClass = clean(body.assignedClass);
  const assignedSection = clean(body.assignedSection);
  const phone = clean(body.phone);

  if (!name) return NextResponse.json({ error: "Full name is required." }, { status: 400 });
  if (!emailRaw) return NextResponse.json({ error: "Email address is required." }, { status: 400 });
  if (!subject) return NextResponse.json({ error: "Subject is required." }, { status: 400 });

  const email = emailRaw.toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  // Case-insensitive duplicate guard (the unique index is case-sensitive, but
  // Google identities are not, so we reject collisions before they happen).
  const existing = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
    select: { id: true },
  });
  if (existing) {
    return NextResponse.json({ error: "A user with this email already exists." }, { status: 409 });
  }

  try {
    const teacher = await prisma.user.create({
      data: {
        name,
        email,
        subject,
        assignedClass,
        assignedSection,
        phone,
        role: "TEACHER",
        status: "ACTIVE",
      },
      select: {
        id: true,
        name: true,
        email: true,
        subject: true,
        assignedClass: true,
        assignedSection: true,
        phone: true,
        status: true,
        createdAt: true,
      },
    });

    await prisma.auditLog.create({
      data: { userId: guard.user.id, action: "teacher_create", note: `Added teacher ${email}` },
    });

    return NextResponse.json({ teacher }, { status: 201 });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json({ error: "A user with this email already exists." }, { status: 409 });
    }
    console.error("[admin/teachers] create failed:", e);
    return NextResponse.json({ error: "Could not create teacher." }, { status: 500 });
  }
}
