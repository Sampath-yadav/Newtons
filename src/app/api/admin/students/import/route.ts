import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { prisma } from "~/lib/prisma";
import { requireAdmin } from "~/lib/admin-guard";
import { safeNormalizePhone } from "~/lib/phone";

export const maxDuration = 60;

const CLASSES = ["8", "9", "10"];
const SECTIONS = ["A", "B", "C"];
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const MAX_ROWS = 5000;

// Column synonyms — we map by header NAME (not fixed position), so reordered
// columns and extra columns in the uploaded sheet are handled gracefully.
const COLUMN_ALIASES: Record<string, string[]> = {
  admissionNumber: ["admission number", "admission no", "admissionno", "adm no", "admno", "admission"],
  name: ["student name", "name", "student"],
  class: ["class", "grade", "std"],
  section: ["section", "sec"],
  parentPhone: ["parent phone", "parent phone number", "parent mobile", "phone", "mobile", "contact"],
  rollNumber: ["roll number", "roll no", "rollno", "roll"],
};

const norm = (s: unknown) => String(s ?? "").toLowerCase().replace(/[.()]/g, "").replace(/\s+/g, " ").trim();

type RowStatus = "valid" | "error" | "duplicate";
interface ReviewRow {
  row: number;
  admissionNumber: string;
  name: string;
  class: string;
  section: string;
  parentPhone: string;   // normalised E.164 when valid, else the raw value
  rollNumber: string;
  status: RowStatus;
  messages: string[];
}

export async function POST(request: NextRequest) {
  const guard = await requireAdmin(request);
  if (!guard.ok) {
    return NextResponse.json({ error: "Admin access required." }, { status: guard.status });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }
  const file = formData.get("file") as File | null;
  const commit = formData.get("commit") === "1";

  // ── File guards ──
  if (!file) return NextResponse.json({ error: "Please choose an Excel file to upload." }, { status: 400 });
  const fileName = file.name.toLowerCase();
  if (!fileName.endsWith(".xlsx") && !fileName.endsWith(".xls")) {
    return NextResponse.json({ error: "Please upload an Excel file (.xlsx or .xls)." }, { status: 400 });
  }
  if (file.size === 0) return NextResponse.json({ error: "The file is empty." }, { status: 400 });
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "The file is too large (max 5 MB)." }, { status: 400 });
  }

  // ── Parse ── raw:false renders formula cells to their computed text.
  let grid: unknown[][];
  try {
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { type: "buffer" });
    const sheetName = wb.SheetNames[0];
    const sheet = sheetName ? wb.Sheets[sheetName] : undefined;
    if (!sheet) return NextResponse.json({ error: "The Excel file has no sheets." }, { status: 422 });
    grid = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, raw: false, defval: "" });
  } catch {
    return NextResponse.json({ error: "Could not read this file. It may be corrupted or not a valid Excel file." }, { status: 400 });
  }

  if (grid.length < 2) {
    return NextResponse.json({ error: "The file has a header but no student rows." }, { status: 422 });
  }

  // ── Map columns by header name ──
  const header = (grid[0] ?? []).map(norm);
  const colIndex: Record<string, number> = {};
  for (const [field, aliases] of Object.entries(COLUMN_ALIASES)) {
    colIndex[field] = header.findIndex((h) => aliases.includes(h));
  }
  const missing = (["admissionNumber", "name", "class", "section", "parentPhone"] as const).filter((f) => colIndex[f] === -1);
  if (missing.length) {
    const labels: Record<string, string> = {
      admissionNumber: "Admission Number", name: "Student Name", class: "Class", section: "Section", parentPhone: "Parent Phone",
    };
    return NextResponse.json(
      { error: `Missing required column(s): ${missing.map((m) => labels[m]).join(", ")}. Download the template for the correct format.` },
      { status: 422 },
    );
  }

  const dataRows = grid.slice(1);
  if (dataRows.length > MAX_ROWS) {
    return NextResponse.json({ error: `Too many rows (${dataRows.length}). Please split the file into batches of ${MAX_ROWS}.` }, { status: 422 });
  }

  const cell = (cells: unknown[], field: string) => String(cells[colIndex[field]] ?? "").trim();

  // ── Pre-load existing admission numbers + phones for duplicate detection ──
  const [existingAdm, existingPhones] = await Promise.all([
    prisma.student.findMany({ select: { admissionNumber: true } }),
    prisma.student.findMany({ select: { parentPhone: true } }),
  ]);
  const dbAdm = new Set(existingAdm.map((s) => s.admissionNumber));
  const dbPhones = new Set(existingPhones.map((s) => s.parentPhone));

  const seenAdm = new Set<string>();
  const seenPhone = new Set<string>();
  const review: ReviewRow[] = [];
  let duplicateInFile = 0;
  let duplicateInDb = 0;

  dataRows.forEach((cells, idx) => {
    const excelRow = idx + 2;
    const admissionNumber = cell(cells, "admissionNumber");
    const name = cell(cells, "name");
    const cls = cell(cells, "class");
    const section = cell(cells, "section").toUpperCase();
    const phoneRaw = cell(cells, "parentPhone");
    const rollNumber = colIndex.rollNumber !== -1 ? cell(cells, "rollNumber") : "";

    // Skip a fully blank row (trailing rows / gaps).
    if (!admissionNumber && !name && !cls && !section && !phoneRaw && !rollNumber) return;

    const messages: string[] = [];
    let status: RowStatus = "valid";

    if (!admissionNumber) messages.push("Admission number is blank.");
    if (!name) messages.push("Student name is blank.");
    if (!cls) messages.push("Class is blank.");
    else if (!CLASSES.includes(cls)) messages.push(`Invalid class "${cls}" (allowed: ${CLASSES.join(", ")}).`);
    if (!section) messages.push("Section is blank.");
    else if (!SECTIONS.includes(section)) messages.push(`Invalid section "${section}" (allowed: ${SECTIONS.join(", ")}).`);

    const e164 = safeNormalizePhone(phoneRaw);
    if (!phoneRaw) messages.push("Parent phone is blank.");
    else if (!e164) messages.push(`Invalid phone "${phoneRaw}" (expected a 10-digit Indian mobile).`);

    // Duplicate admission number — within the file, then against the database.
    let isDuplicate = false;
    if (admissionNumber) {
      if (seenAdm.has(admissionNumber)) {
        isDuplicate = true; duplicateInFile++;
        messages.push("Duplicate admission number within this file (later row skipped).");
      } else {
        seenAdm.add(admissionNumber);
        if (dbAdm.has(admissionNumber)) {
          isDuplicate = true; duplicateInDb++;
          messages.push("Admission number already exists in the system (will be skipped).");
        }
      }
    }

    // Duplicate phone is a non-blocking warning (siblings can share a number).
    const phoneForCheck = e164 ?? "";
    if (phoneForCheck) {
      if (seenPhone.has(phoneForCheck) || dbPhones.has(phoneForCheck)) {
        messages.push("Warning: this phone number is already used by another student.");
      } else {
        seenPhone.add(phoneForCheck);
      }
    }

    const hasError = messages.some((m) => !m.startsWith("Warning:") && !m.includes("skipped"));
    if (isDuplicate) status = "duplicate";
    else if (hasError) status = "error";

    review.push({
      row: excelRow,
      admissionNumber,
      name,
      class: cls,
      section,
      parentPhone: e164 ?? phoneRaw,
      rollNumber,
      status,
      messages,
    });
  });

  const total = review.length;
  const importable = review.filter((r) => r.status === "valid");
  const invalid = review.filter((r) => r.status === "error").length;

  if (total === 0) {
    return NextResponse.json({ error: "No student rows found in the file." }, { status: 422 });
  }

  const summary = {
    total,
    valid: importable.length,
    invalid,
    duplicateInFile,
    duplicateInDb,
  };

  // ── Dry run: report only ──
  if (!commit) {
    return NextResponse.json({ committed: false, summary, rows: review });
  }

  // ── Commit: insert only the clean, non-duplicate rows, in one transaction.
  //    skipDuplicates is a race guard so a concurrent import / double-click can
  //    never create duplicate admission numbers. ──
  if (importable.length === 0) {
    return NextResponse.json({ error: "There are no valid rows to import. Fix the errors and re-upload." }, { status: 422 });
  }

  let imported = 0;
  try {
    const result = await prisma.$transaction(async (tx) => {
      const created = await tx.student.createMany({
        data: importable.map((r) => ({
          admissionNumber: r.admissionNumber,
          name: r.name,
          class: r.class,
          section: r.section,
          parentPhone: r.parentPhone,
          rollNumber: r.rollNumber || null,
          status: "ACTIVE",
        })),
        skipDuplicates: true,
      });
      await tx.auditLog.create({
        data: {
          userId: guard.user.id,
          action: "student_import",
          note: `Imported ${created.count} of ${total} rows (invalid ${invalid}, duplicates ${duplicateInFile + duplicateInDb})`,
        },
      });
      return created.count;
    });
    imported = result;
  } catch (e) {
    console.error("[admin/students/import] commit failed:", e);
    return NextResponse.json({ error: "Import failed and was rolled back. No students were added." }, { status: 500 });
  }

  return NextResponse.json({
    committed: true,
    summary: {
      ...summary,
      imported,
      skipped: importable.length - imported, // lost a race to a concurrent import
    },
  });
}
