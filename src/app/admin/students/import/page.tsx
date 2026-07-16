"use client";

import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

type RowStatus = "valid" | "error" | "duplicate";
interface ReviewRow {
  row: number;
  admissionNumber: string;
  name: string;
  class: string;
  section: string;
  parentPhone: string;
  rollNumber: string;
  status: RowStatus;
  messages: string[];
}
interface DrySummary { total: number; valid: number; invalid: number; duplicateInFile: number; duplicateInDb: number; }
interface CommitSummary extends DrySummary { imported: number; skipped: number; }

function StatCard({ label, value, tone = "slate" }: { label: string; value: number; tone?: "slate" | "green" | "red" | "amber" }) {
  const tones: Record<string, string> = {
    slate: "text-slate-700",
    green: "text-emerald-600",
    red: "text-red-600",
    amber: "text-amber-600",
  };
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center">
      <p className={`text-2xl font-extrabold ${tones[tone]}`}>{value}</p>
      <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
    </div>
  );
}

export default function ImportStudentsPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [report, setReport] = useState<{ summary: DrySummary; rows: ReviewRow[] } | null>(null);
  const [result, setResult] = useState<CommitSummary | null>(null);
  const [validating, setValidating] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authStatus === "unauthenticated") router.push("/admin");
    if (authStatus === "authenticated" && session?.user?.role !== "ADMIN") router.push("/teacher/upload");
  }, [authStatus, session, router]);

  function reset() {
    setFile(null);
    setReport(null);
    setResult(null);
    setError("");
    if (fileRef.current) fileRef.current.value = "";
  }

  function onPick(f: File | null) {
    setFile(f);
    setReport(null);
    setResult(null);
    setError("");
  }

  async function validate() {
    if (!file) return;
    setValidating(true);
    setError("");
    setReport(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/students/import", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Validation failed."); return; }
      setReport({ summary: data.summary, rows: data.rows });
    } catch {
      setError("Network error during validation. Please try again.");
    } finally {
      setValidating(false);
    }
  }

  async function commit() {
    if (!file || !report || report.summary.valid === 0 || importing) return;
    setImporting(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("commit", "1");
      const res = await fetch("/api/admin/students/import", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Import failed."); return; }
      setResult(data.summary);
    } catch {
      setError("Network error during import. The import is transactional, so no partial data was saved. Please re-validate and try again.");
    } finally {
      setImporting(false);
    }
  }

  if (authStatus === "loading") {
    return <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] text-slate-400">Loading…</div>;
  }

  const issues = report?.rows.filter((r) => r.status !== "valid") ?? [];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white px-4 py-3.5 sm:px-6 sm:py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/images/school_logo/Newtons_logo.png" alt="Newton's" width={100} height={34} />
            <div className="hidden h-5 w-px bg-slate-200 sm:block" />
            <div className="hidden sm:block">
              <p className="text-[13px] font-bold text-[#060C8B]">Admin Portal</p>
              <p className="text-[10px] uppercase tracking-wider text-slate-400">Student Import</p>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="hidden text-[13px] text-slate-500 sm:inline">{session?.user?.name}</span>
            <button
              onClick={() => signOut({ callbackUrl: "/admin" })}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-[12px] text-slate-500 hover:bg-slate-50 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
        <Link href="/admin/students" className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-500 transition-colors hover:text-[#060C8B]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Students
        </Link>

        <h1 className="text-xl font-extrabold text-[#1F2A66] sm:text-2xl">Bulk Import Students</h1>
        <p className="mt-0.5 text-[13px] text-slate-400">
          Upload an Excel file to onboard students. The file is validated first — nothing is saved until you confirm.
        </p>

        {/* ── Success result ── */}
        {result ? (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <div>
                <h2 className="text-lg font-extrabold text-[#1F2A66]">Import complete</h2>
                <p className="text-[13px] text-slate-500">{result.imported} student{result.imported !== 1 ? "s" : ""} added to the system.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard label="Total Rows" value={result.total} />
              <StatCard label="Imported" value={result.imported} tone="green" />
              <StatCard label="Invalid (skipped)" value={result.invalid} tone="red" />
              <StatCard label="Duplicates (skipped)" value={result.duplicateInFile + result.duplicateInDb} tone="amber" />
            </div>
            <div className="mt-5 flex gap-2">
              <Link href="/admin/students" className="rounded-xl bg-[#060C8B] px-4 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-[#04096a]">
                View Students
              </Link>
              <button onClick={reset} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[13px] font-bold text-slate-600 transition-colors hover:bg-slate-50">
                Import Another File
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* ── Step 1: choose file ── */}
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-[15px] font-bold text-[#1F2A66]">1. Choose your Excel file</h2>
                <a href="/api/admin/students/import/template" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#060C8B] hover:underline">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download template
                </a>
              </div>

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 px-6 py-8 text-center transition-colors hover:border-[#060C8B]/40 hover:bg-slate-50">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mb-2 h-7 w-7 text-slate-400" aria-hidden>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span className="text-[13px] font-semibold text-slate-600">{file ? file.name : "Click to choose an .xlsx or .xls file"}</span>
                <span className="mt-0.5 text-[11px] text-slate-400">Columns: Admission Number, Student Name, Class, Section, Parent Phone, Roll Number (optional)</span>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".xlsx,.xls"
                  className="hidden"
                  onChange={(e) => onPick(e.target.files?.[0] ?? null)}
                />
              </label>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={validate}
                  disabled={!file || validating}
                  className="rounded-xl bg-[#060C8B] px-4 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-[#04096a] disabled:opacity-50"
                >
                  {validating ? "Validating…" : "Validate File"}
                </button>
                {file && (
                  <button onClick={reset} className="rounded-xl border border-slate-200 px-4 py-2.5 text-[13px] font-semibold text-slate-600 transition-colors hover:bg-slate-50">
                    Clear
                  </button>
                )}
              </div>

              {error && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600">{error}</div>
              )}
            </div>

            {/* ── Step 2: validation report ── */}
            {report && (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="mb-4 text-[15px] font-bold text-[#1F2A66]">2. Validation report</h2>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                  <StatCard label="Total Rows" value={report.summary.total} />
                  <StatCard label="Valid" value={report.summary.valid} tone="green" />
                  <StatCard label="Invalid" value={report.summary.invalid} tone="red" />
                  <StatCard label="Dup. in File" value={report.summary.duplicateInFile} tone="amber" />
                  <StatCard label="Already Exist" value={report.summary.duplicateInDb} tone="amber" />
                </div>

                {issues.length > 0 ? (
                  <div className="mt-5">
                    <p className="mb-2 text-[13px] font-semibold text-slate-600">
                      {issues.length} row{issues.length !== 1 ? "s" : ""} need attention (valid rows will still import):
                    </p>
                    <div className="max-h-80 overflow-auto rounded-xl border border-slate-200">
                      <table className="w-full text-[12px]">
                        <thead className="sticky top-0 bg-slate-50">
                          <tr className="text-left text-[10px] font-bold uppercase tracking-wide text-slate-500">
                            <th className="px-3 py-2">Row</th>
                            <th className="px-3 py-2">Adm. No.</th>
                            <th className="px-3 py-2">Name</th>
                            <th className="px-3 py-2">Issue</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {issues.map((r) => (
                            <tr key={r.row}>
                              <td className="px-3 py-2 text-slate-400">{r.row}</td>
                              <td className="px-3 py-2 font-mono text-slate-500">{r.admissionNumber || "—"}</td>
                              <td className="px-3 py-2 text-slate-700">{r.name || "—"}</td>
                              <td className="px-3 py-2">
                                <span className={`mb-1 mr-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${r.status === "duplicate" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
                                  {r.status}
                                </span>
                                <span className="text-slate-500">{r.messages.join(" ")}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <p className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] text-emerald-700">
                    All {report.summary.total} rows passed validation and are ready to import.
                  </p>
                )}

                <div className="mt-5 flex items-center gap-2">
                  <button
                    onClick={commit}
                    disabled={report.summary.valid === 0 || importing}
                    className="rounded-xl bg-[#060C8B] px-5 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-[#04096a] disabled:opacity-50"
                  >
                    {importing ? "Importing…" : `Import ${report.summary.valid} valid student${report.summary.valid !== 1 ? "s" : ""}`}
                  </button>
                  <button onClick={reset} className="rounded-xl border border-slate-200 px-4 py-2.5 text-[13px] font-semibold text-slate-600 transition-colors hover:bg-slate-50">
                    Cancel
                  </button>
                </div>
                {report.summary.valid === 0 && (
                  <p className="mt-2 text-[12px] text-red-500">No valid rows to import. Fix the issues above and re-validate.</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
