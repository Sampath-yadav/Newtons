import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "~/lib/prisma";
import type { PreviewRow } from "~/app/api/marks/upload/route";
import { getExamConfig, validateMarkCell } from "~/lib/exam-config";

interface SubmitBody {
  class: string;
  section: string;
  examName: string;
  rows: PreviewRow[];
}

// Thrown inside the write transaction when an active exam already exists for
// this class+section+exam (detected under the advisory lock). Converted to a
// 409 by the caller.
class DuplicateExamError extends Error {
  constructor(public status: string) {
    super("duplicate exam");
  }
}

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const body = (await request.json()) as SubmitBody;
  const { rows, examName } = body;
  const cls     = body.class;
  const section = body.section;

  if (!cls || !section || !examName || !rows?.length) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  let config;
  try {
    config = getExamConfig(examName);
  } catch {
    return NextResponse.json({ error: `Unknown exam type: ${examName}` }, { status: 400 });
  }

  const subjects = config.subjects.map((s) => s.name);

  // ── Data-integrity gate ────────────────────────────────────────────────────
  // Never trust the client payload: re-validate every cell here, so a blank /
  // whitespace-only / invalid mark can NEVER be written to the DB (where it
  // would later read as 0 or "Absent" and mislead a parent). Reject the whole
  // submission with specific, student-named errors. Normalise valid values.
  const markErrors: string[] = [];
  for (const row of rows) {
    const who = row.name || row.admNo || "Unknown student";
    for (const sub of config.subjects) {
      const check = validateMarkCell(row.marks?.[sub.name], sub);
      if (check.ok) {
        row.marks[sub.name] = check.value; // store normalised "AB" / number
      } else if (check.reason === "blank") {
        markErrors.push(`${who} (${row.admNo}) — ${sub.name} is blank. Enter a number between 0 and ${sub.max}, or AB for absent.`);
      } else if (check.reason === "exceeds") {
        markErrors.push(`${who} (${row.admNo}) — ${sub.name} exceeds the maximum of ${sub.max}.`);
      } else {
        markErrors.push(`${who} (${row.admNo}) — ${sub.name} has an invalid value.`);
      }
    }
  }
  if (markErrors.length > 0) {
    return NextResponse.json(
      { error: markErrors[0], details: markErrors.slice(0, 20), errorCount: markErrors.length },
      { status: 422 }
    );
  }

  // Fast path: block an obvious duplicate before doing any work. (The
  // authoritative, race-safe check happens again inside the locked transaction
  // below — this one just gives a friendly error in the common, non-racing case.)
  const existing = await prisma.exam.findFirst({
    where: {
      class: cls,
      section,
      name: examName,
      status: { in: ["pending_approval", "published"] },
    },
  });

  if (existing) {
    return NextResponse.json(
      { error: `${examName} for Class ${cls}${section} is already ${existing.status}. Contact admin if a resubmission is needed.` },
      { status: 409 }
    );
  }

  // Resolve admission numbers → student IDs
  const admNos = rows.map((r) => r.admNo);
  const students = await prisma.student.findMany({
    where: { admissionNumber: { in: admNos } },
  });
  type StudentRow = { admissionNumber: string; id: number };
  const studentMap = new Map<string, StudentRow>(
    (students as StudentRow[]).map((s) => [s.admissionNumber, s])
  );

  // Serialize concurrent submissions for the SAME class+section+exam so two
  // teachers can't both create an exam at once. A transaction-scoped advisory
  // lock is PgBouncer-safe (auto-released on commit/rollback) and only contends
  // between identical keys — different exams never block each other.
  const lockKey = `marks:${cls}|${section}|${examName}`;

  let exam;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    exam = await prisma.$transaction(async (tx: any) => {
      await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${lockKey}))`;

      // Authoritative duplicate check — now safe from races, because any
      // competing submission for this key is blocked on the lock above.
      const dup = await tx.exam.findFirst({
        where: {
          class: cls,
          section,
          name: examName,
          status: { in: ["pending_approval", "published"] },
        },
      });
      if (dup) throw new DuplicateExamError(dup.status);

      const newExam = await tx.exam.create({
        data: {
          name: examName,
          class: cls,
          section,
          status: "pending_approval",
          uploadedById: Number(token.id),
        },
      });

      const markData: { studentId: number; examId: number; subject: string; value: string }[] = [];

      for (const row of rows) {
        const student = studentMap.get(row.admNo);
        if (!student) continue;
        for (const subject of subjects) {
          markData.push({
            studentId: student.id,
            examId: newExam.id,
            subject,
            value: row.marks[subject] ?? "",
          });
        }
      }

      await tx.mark.createMany({ data: markData });

      await tx.auditLog.create({
        data: {
          examId: newExam.id,
          userId: Number(token.id),
          action: "submit",
          note: `Submitted ${rows.length} students for ${examName} Class ${cls}${section}`,
        },
      });

      return newExam;
    });
  } catch (e) {
    if (e instanceof DuplicateExamError) {
      return NextResponse.json(
        { error: `${examName} for Class ${cls}${section} is already ${e.status}. Contact admin if a resubmission is needed.` },
        { status: 409 }
      );
    }
    throw e;
  }

  return NextResponse.json({ examId: exam.id, status: exam.status });
}
