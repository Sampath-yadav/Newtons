import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import * as XLSX from "xlsx";
import { prisma } from "~/lib/prisma";
import { getExamConfig, computeStudentResult } from "~/lib/exam-config";

export type PreviewRow = {
  admNo: string;
  name: string;
  marks: Record<string, string>; // keyed by subject name e.g. "Telugu"
  errors: string[];
  // Server-computed result fields
  total: number;
  maxPresent: number;
  percentage: string;
  grade: string;
  absentCount: number;
};

// Strip "(20)" / "(100)" suffix from Excel header → subject name
function headerToSubjectName(header: string): string {
  return header.replace(/\s*\(\d+\)\s*$/, "").trim();
}

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const formData = await request.formData();
  const file      = formData.get("file") as File | null;
  const cls       = formData.get("class") as string;
  const section   = formData.get("section") as string;
  const examName  = formData.get("exam") as string;

  if (!file || !cls || !section || !examName) {
    return NextResponse.json(
      { error: "file, class, section, and exam are required" },
      { status: 400 }
    );
  }

  let config;
  try {
    config = getExamConfig(examName);
  } catch {
    return NextResponse.json({ error: `Unknown exam type: ${examName}` }, { status: 400 });
  }

  const { subjects } = config;

  // ── Parse Excel ────────────────────────────────────────────────────────────
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const raw = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, {
    raw: false,
    defval: "",
  });

  if (raw.length === 0) {
    return NextResponse.json({ error: "The uploaded file has no data rows." }, { status: 422 });
  }

  // ── Map Excel headers → subject names ─────────────────────────────────────
  // The template headers are "Telugu (20)" but we need "Telugu" as the key.
  // Build a mapping from whatever header is in the file → subject name.
  const firstRow = raw[0];
  const excelHeaders = Object.keys(firstRow);

  if (!excelHeaders.includes("Admission No.") || !excelHeaders.includes("Student Name")) {
    return NextResponse.json(
      { error: 'Wrong template format. "Admission No." and "Student Name" columns are missing.' },
      { status: 422 }
    );
  }

  // Find which Excel header corresponds to each expected subject
  const headerMap = new Map<string, string>(); // excelHeader → subjectName
  const missingSubjects: string[] = [];

  for (const sub of subjects) {
    // Try exact match first, then strip "(XX)" suffix match
    const exactMatch = excelHeaders.find((h) => h === sub.name || h === sub.header);
    if (exactMatch) {
      headerMap.set(exactMatch, sub.name);
    } else {
      // Try fuzzy: strip suffix from each header and compare
      const fuzzyMatch = excelHeaders.find(
        (h) => headerToSubjectName(h).toLowerCase() === sub.name.toLowerCase()
      );
      if (fuzzyMatch) {
        headerMap.set(fuzzyMatch, sub.name);
      } else {
        missingSubjects.push(sub.name);
      }
    }
  }

  if (missingSubjects.length > 0) {
    return NextResponse.json(
      { error: `Missing subject columns: ${missingSubjects.join(", ")}. Make sure you are using the correct template for ${examName}.` },
      { status: 422 }
    );
  }

  // ── Load students from DB ─────────────────────────────────────────────────
  const dbStudents = await prisma.student.findMany({
    where: { class: cls, section },
  });
  const studentMap = new Map(dbStudents.map((s: { admissionNumber: string; id: number; name: string; class: string; section: string; parentPhone: string; createdAt: Date }) => [s.admissionNumber, s]));

  // ── Validate each row ──────────────────────────────────────────────────────
  const rows: PreviewRow[] = [];
  const globalErrors: string[] = [];

  raw.forEach((row, idx) => {
    const excelRowNum = idx + 2;
    const admNo = String(row["Admission No."] ?? "").trim();
    const name  = String(row["Student Name"]  ?? "").trim();
    const rowErrors: string[] = [];

    if (!admNo) {
      rowErrors.push(`Row ${excelRowNum}: Admission number is blank.`);
    } else if (!studentMap.has(admNo)) {
      rowErrors.push(`Row ${excelRowNum}: Admission number "${admNo}" not found in Class ${cls}${section}.`);
    }

    // Extract and validate marks per subject
    const marks: Record<string, string> = {};

    for (const sub of subjects) {
      // Find the Excel header for this subject
      const excelHeader = [...headerMap.entries()].find(([, v]) => v === sub.name)?.[0];
      const raw_val = excelHeader ? String(row[excelHeader] ?? "").trim() : "";
      const val = raw_val.toUpperCase();

      if (val === "" || val === "TOTAL" || val === "PERCENTAGE" || val === "GRADE") {
        // Ignore computed columns that might have been included
      }

      if (val === "") {
        rowErrors.push(`Row ${excelRowNum}, ${sub.name}: Cell is blank. Enter a mark (0–${sub.max}) or AB.`);
        marks[sub.name] = "";
      } else if (val === "AB") {
        marks[sub.name] = "AB";
      } else {
        const num = Number(raw_val);
        if (isNaN(num) || num < 0) {
          rowErrors.push(`Row ${excelRowNum}, ${sub.name}: "${raw_val}" is not a valid mark.`);
          marks[sub.name] = raw_val;
        } else if (num > sub.max) {
          rowErrors.push(
            `Row ${excelRowNum}, ${sub.name}: ${num} exceeds the maximum of ${sub.max} marks for ${examName}.`
          );
          marks[sub.name] = raw_val;
        } else {
          marks[sub.name] = String(num);
        }
      }
    }

    // Compute result (even for rows with errors — useful in preview)
    const result = computeStudentResult(marks, config);

    rows.push({
      admNo,
      name,
      marks,
      errors: rowErrors,
      total: result.total,
      maxPresent: result.maxPresent,
      percentage: result.percentage,
      grade: result.grade,
      absentCount: result.absentCount,
    });

    globalErrors.push(...rowErrors);
  });

  return NextResponse.json({
    rows,
    subjects: subjects.map((s) => s.name),
    subjectHeaders: subjects.map((s) => s.header),
    subjectMaxMap: Object.fromEntries(subjects.map((s) => [s.name, s.max])),
    totalMax: config.totalMax,
    hasErrors: globalErrors.length > 0,
    errorCount: globalErrors.length,
    studentCount: rows.length,
  });
}
