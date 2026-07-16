import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { requireAdmin } from "~/lib/admin-guard";

// GET /api/admin/students/import/template — downloads a ready-to-fill .xlsx with
// the exact columns the importer expects, plus one example row.
export async function GET(request: NextRequest) {
  const guard = await requireAdmin(request);
  if (!guard.ok) {
    return NextResponse.json({ error: "Admin access required." }, { status: guard.status });
  }

  const rows = [
    ["Admission Number", "Student Name", "Class", "Section", "Parent Phone", "Roll Number"],
    ["NH-2025-001", "Example Student", "9", "A", "9876543210", "1"],
  ];
  const sheet = XLSX.utils.aoa_to_sheet(rows);
  sheet["!cols"] = [{ wch: 18 }, { wch: 24 }, { wch: 8 }, { wch: 8 }, { wch: 16 }, { wch: 12 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, sheet, "Students");
  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;

  return new NextResponse(new Uint8Array(buf), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="student-import-template.xlsx"',
    },
  });
}
