import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import * as XLSX from "xlsx";
import { prisma } from "~/lib/prisma";
import { getExamConfig, computeStudentResult, validateMarkCell } from "~/lib/exam-config";

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

  // ── Validate the file BEFORE parsing, so a wrong/empty/oversized upload
  //    returns a clear 400 instead of crashing the XLSX parser with a 500. ──
  const fileName = file.name.toLowerCase();
  if (!fileName.endsWith(".xlsx") && !fileName.endsWith(".xls")) {
    return NextResponse.json(
      { error: "Please upload an Excel file (.xlsx or .xls)." },
      { status: 400 }
    );
  }
  if (file.size === 0) {
    return NextResponse.json(
      { error: "The file is empty. Please check and re-upload." },
      { status: 400 }
    );
  }
  const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB — the marks template is a few KB
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { error: "The file is too large (max 5 MB). Please upload only the marks template." },
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

  // ── Parse Excel as a raw grid ───────────────────────────────────────────────
  // We read by fixed COLUMN POSITION (A = Admission No., B = Student Name, then
  // the subjects in template order from column C), never by header text — so
  // renaming a column ("Maths" → "Mathematics") can't make us read the wrong
  // subject or skip it. A corrupt/non-spreadsheet file is caught here too.
  let grid: unknown[][];
  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = sheetName ? workbook.Sheets[sheetName] : undefined;
    if (!sheet) {
      return NextResponse.json(
        { error: "The Excel file has no sheets. Please use the marks template." },
        { status: 422 }
      );
    }
    grid = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, raw: false, defval: "" });
  } catch {
    return NextResponse.json(
      { error: "Could not read this file. It may be corrupted or not a valid Excel file. Please re-download the template and try again." },
      { status: 400 }
    );
  }

  if (grid.length < 2) {
    return NextResponse.json({ error: "The uploaded file has no data rows." }, { status: 422 });
  }

  // ── Validate the template STRUCTURE by position (not by trusting headers) ───
  const headerCells = (grid[0] ?? []).map((c) => String(c ?? "").trim());
  const normHeader = (s: string) => s.toLowerCase().replace(/\.$/, "").trim();

  // Hard requirement: column A must be the admission-number column.
  if (!["admission no", "admission number"].includes(normHeader(headerCells[0] ?? ""))) {
    return NextResponse.json(
      { error: 'Wrong template: column A must be "Admission No.". Please download a fresh template and paste your marks into it without changing the columns.' },
      { status: 422 }
    );
  }
  if (normHeader(headerCells[1] ?? "") !== "student name") {
    return NextResponse.json(
      { error: 'Wrong template: column B must be "Student Name". Please download a fresh template.' },
      { status: 422 }
    );
  }

  const SUBJECT_START_COL = 2; // column C
  if (headerCells.length < SUBJECT_START_COL + subjects.length) {
    return NextResponse.json(
      { error: `Wrong template for ${examName}: expected ${subjects.length} subject columns from column C onward. Please download a fresh ${examName} template.` },
      { status: 422 }
    );
  }

  // ── Load students from DB (rows are matched by admission number) ────────────
  const dbStudents = await prisma.student.findMany({
    where: { class: cls, section },
  });
  const studentMap = new Map(dbStudents.map((s: { admissionNumber: string; id: number; name: string; class: string; section: string; parentPhone: string; createdAt: Date }) => [s.admissionNumber, s]));

  // ── Validate each data row, reading marks from FIXED subject columns ────────
  const rows: PreviewRow[] = [];
  const globalErrors: string[] = [];

  grid.slice(1).forEach((cells, idx) => {
    const excelRowNum = idx + 2; // row 1 is the header
    const admNo = String(cells[0] ?? "").trim();
    const name  = String(cells[1] ?? "").trim();

    // Skip a completely blank row (e.g. trailing empty rows in the sheet).
    const anyFilled = subjects.some((_, si) => String(cells[SUBJECT_START_COL + si] ?? "").trim() !== "");
    if (!admNo && !name && !anyFilled) return;

    const rowErrors: string[] = [];
    const who = name || admNo || "Unknown student";

    if (!admNo) {
      rowErrors.push(`Row ${excelRowNum}: Admission number (column A) is blank.`);
    } else if (!studentMap.has(admNo)) {
      rowErrors.push(`Row ${excelRowNum}: Admission number "${admNo}" not found in Class ${cls}${section}.`);
    }

    // Each subject is read from its known column index — header text is ignored.
    const marks: Record<string, string> = {};
    subjects.forEach((sub, si) => {
      const rawVal = String(cells[SUBJECT_START_COL + si] ?? "").trim();
      const check = validateMarkCell(rawVal, sub);
      if (check.ok) {
        marks[sub.name] = check.value;
      } else {
        marks[sub.name] = rawVal; // preserve what the teacher typed for the preview
        if (check.reason === "blank") {
          rowErrors.push(`Row ${excelRowNum} (${who}) — ${sub.name} is blank. Enter a number between 0 and ${sub.max}, or AB for absent.`);
        } else if (check.reason === "exceeds") {
          rowErrors.push(`Row ${excelRowNum} (${who}) — ${sub.name}: ${rawVal} exceeds the maximum of ${sub.max} for ${examName}.`);
        } else {
          rowErrors.push(`Row ${excelRowNum} (${who}) — ${sub.name}: "${rawVal}" is not a valid mark.`);
        }
      }
    });

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

  if (rows.length === 0) {
    return NextResponse.json({ error: "The uploaded file has no data rows." }, { status: 422 });
  }

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
