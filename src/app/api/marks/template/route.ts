import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import * as XLSX from "xlsx";
import { prisma } from "~/lib/prisma";
import { getExamConfig } from "~/lib/exam-config";

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const cls      = searchParams.get("class");
  const section  = searchParams.get("section");
  const examName = searchParams.get("exam");

  if (!cls || !section || !examName) {
    return NextResponse.json({ error: "class, section, and exam are required" }, { status: 400 });
  }

  let config;
  try {
    config = getExamConfig(examName);
  } catch {
    return NextResponse.json({ error: `Unknown exam type: ${examName}` }, { status: 400 });
  }

  const students = await prisma.student.findMany({
    where: { class: cls, section },
    orderBy: { admissionNumber: "asc" },
  });

  const { subjects, totalMax } = config;
  const numSubjects = subjects.length;

  // ── Column layout ──────────────────────────────────────────────────────────
  // A  = Admission No.
  // B  = Student Name
  // C…C+n = subject columns (dynamic, 7 subjects)
  // C+n+1  = Total  (formula)
  // C+n+2  = %      (formula)
  // C+n+3  = Grade  (formula)

  const subjectStartCol  = 2;                           // col index C
  const subjectEndCol    = subjectStartCol + numSubjects - 1;
  const totalColIdx      = subjectEndCol + 1;
  const pctColIdx        = totalColIdx + 1;
  const gradeColIdx      = pctColIdx + 1;

  const subStartLetter   = XLSX.utils.encode_col(subjectStartCol);
  const subEndLetter     = XLSX.utils.encode_col(subjectEndCol);
  const totalColLetter   = XLSX.utils.encode_col(totalColIdx);
  const pctColLetter     = XLSX.utils.encode_col(pctColIdx);

  // ── Header row ────────────────────────────────────────────────────────────
  const headerRow: string[] = [
    "Admission No.",
    "Student Name",
    ...subjects.map((s) => s.header),              // "Telugu (20)" etc.
    `Total (Max: ${totalMax})`,
    "Percentage (%)",
    "Grade",
  ];

  const wb = XLSX.utils.book_new();
  const ws: XLSX.WorkSheet = {};

  // Write header
  headerRow.forEach((val, c) => {
    const addr = XLSX.utils.encode_cell({ r: 0, c });
    ws[addr] = { t: "s", v: val };
  });

  // ── Student rows with formulas ────────────────────────────────────────────
  students.forEach((student: { admissionNumber: string; name: string }, rowIdx: number) => {
    const excelRow = rowIdx + 2; // 1-indexed; row 1 = header

    // Admission No.
    ws[XLSX.utils.encode_cell({ r: rowIdx + 1, c: 0 })] = { t: "s", v: student.admissionNumber };
    // Student Name
    ws[XLSX.utils.encode_cell({ r: rowIdx + 1, c: 1 })] = { t: "s", v: student.name };

    // Blank subject cells (teacher fills these)
    subjects.forEach((_, si) => {
      ws[XLSX.utils.encode_cell({ r: rowIdx + 1, c: subjectStartCol + si })] = { t: "s", v: "" };
    });

    // Total formula: SUM ignores text ("AB"), sums only numeric cells
    ws[XLSX.utils.encode_cell({ r: rowIdx + 1, c: totalColIdx })] = {
      t: "n",
      f: `SUM(${subStartLetter}${excelRow}:${subEndLetter}${excelRow})`,
    };

    // Percentage formula: total ÷ totalMax × 100
    // Note: this is an approximate guide — server computes accurate % excluding absent subjects
    ws[XLSX.utils.encode_cell({ r: rowIdx + 1, c: pctColIdx })] = {
      t: "n",
      f: `IF(${totalColLetter}${excelRow}=0,"",ROUND(${totalColLetter}${excelRow}/${totalMax}*100,1))`,
      z: "0.0",
    };

    // Grade formula (nested IF)
    const P = `${pctColLetter}${excelRow}`;
    ws[XLSX.utils.encode_cell({ r: rowIdx + 1, c: gradeColIdx })] = {
      t: "s",
      f: `IF(${P}="","",IF(${P}>=91,"A1",IF(${P}>=81,"A2",IF(${P}>=71,"B1",IF(${P}>=61,"B2",IF(${P}>=51,"C1",IF(${P}>=41,"C2",IF(${P}>=35,"D","F"))))))))`,
    };
  });

  // ── Sheet range ───────────────────────────────────────────────────────────
  const lastRow  = students.length + 1; // 1-indexed
  const lastCol  = gradeColIdx;
  ws["!ref"] = `A1:${XLSX.utils.encode_cell({ r: lastRow, c: lastCol })}`;

  // ── Column widths ─────────────────────────────────────────────────────────
  ws["!cols"] = [
    { wch: 18 }, // Admission No.
    { wch: 26 }, // Student Name
    ...subjects.map(() => ({ wch: 22 })),  // subject columns
    { wch: 16 }, // Total
    { wch: 14 }, // Percentage
    { wch: 10 }, // Grade
  ];

  // ── Freeze first two columns (Admission No. + Name) ──────────────────────
  ws["!freeze"] = { xSplit: 2, ySplit: 1 };

  XLSX.utils.book_append_sheet(wb, ws, "Marks");

  const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${examName}-Class${cls}${section}.xlsx"`,
    },
  });
}
