import { NextRequest, NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";
import { signParentSession, PARENT_COOKIE, PARENT_SESSION_MAX_AGE } from "~/lib/parent-session";

interface LoginBody {
  admissionNumber: string;
  mobile: string;
}

// ── Simple in-memory rate limiter ───────────────────────────────────────────
// Keyed by admission number. Good enough for a single-instance, low-traffic
// school deployment. For multi-instance production, back this with Redis or a
// DB table so the lockout is shared across instances.
const MAX_ATTEMPTS = 5;
const LOCK_MS = 10 * 60 * 1000; // 10 minutes
const attempts = new Map<string, { count: number; lockUntil: number }>();

function checkLock(key: string): number | null {
  const rec = attempts.get(key);
  if (rec && rec.lockUntil > Date.now()) {
    return Math.ceil((rec.lockUntil - Date.now()) / 1000); // seconds remaining
  }
  return null;
}

function registerFailure(key: string) {
  const rec = attempts.get(key) ?? { count: 0, lockUntil: 0 };
  rec.count += 1;
  if (rec.count >= MAX_ATTEMPTS) {
    rec.lockUntil = Date.now() + LOCK_MS;
    rec.count = 0;
  }
  attempts.set(key, rec);
}

// Compare phone numbers by their last 10 digits, so "+91 90144 38604",
// "9014386804" and "09014386804" all match the same parent.
function phoneMatches(a: string, b: string): boolean {
  const da = a.replace(/\D/g, "");
  const db = b.replace(/\D/g, "");
  if (da.length < 10 || db.length < 10) return false;
  return da.slice(-10) === db.slice(-10);
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as LoginBody | null;
  if (!body?.admissionNumber || !body?.mobile) {
    return NextResponse.json({ error: "Admission number and mobile are required." }, { status: 400 });
  }

  const admissionNumber = body.admissionNumber.trim();
  const key = admissionNumber.toLowerCase();

  const lockedFor = checkLock(key);
  if (lockedFor) {
    return NextResponse.json(
      { error: `Too many attempts. Please try again in ${Math.ceil(lockedFor / 60)} minute(s).` },
      { status: 429 }
    );
  }

  // Look up by admission number, then verify the mobile matches (don't filter on
  // phone in the query so we can rate-limit wrong-mobile guesses).
  const student = await prisma.student.findUnique({
    where: { admissionNumber },
  });

  if (!student || !phoneMatches(student.parentPhone, body.mobile)) {
    registerFailure(key);
    return NextResponse.json(
      { error: "No matching record found. Check the admission number and registered mobile number." },
      { status: 401 }
    );
  }

  // Success — clear any failure record and issue a signed session cookie.
  attempts.delete(key);
  const tokenValue = signParentSession(student.id);

  const res = NextResponse.json({
    ok: true,
    student: { name: student.name, admissionNumber: student.admissionNumber },
  });
  res.cookies.set(PARENT_COOKIE, tokenValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: PARENT_SESSION_MAX_AGE,
  });
  return res;
}
