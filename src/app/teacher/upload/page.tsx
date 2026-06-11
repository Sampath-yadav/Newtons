"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import type { PreviewRow } from "~/app/api/marks/upload/route";
import { EXAM_NAMES } from "~/lib/exam-config";
import { useTeacherAlerts } from "~/hooks/useTeacherAlerts";
import { AlertBanner } from "~/components/teacher/AlertBanner";

const CLASSES  = ["8", "9", "10"];
const SECTIONS = ["A", "B", "C"];

type Step      = "configure" | "preview" | "done";
type ActiveTab = "upload" | "submissions";

interface ValidationResult {
  rows: PreviewRow[];
  subjects: string[];
  subjectHeaders: string[];
  subjectMaxMap: Record<string, number>;
  totalMax: number;
  hasErrors: boolean;
  errorCount: number;
  studentCount: number;
}

interface Submission {
  id: number;
  name: string;
  class: string;
  section: string;
  status: string;
  rejectNote: string | null;
  publishedAt: string | null;
  createdAt: string;
  studentCount: number;
}

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  pending_approval: { label: "Pending Review", cls: "bg-amber-100 text-amber-800 border-amber-200"     },
  published:        { label: "Published",      cls: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  rejected:         { label: "Rejected",       cls: "bg-red-100 text-red-800 border-red-200"           },
  draft:            { label: "Draft",          cls: "bg-slate-100 text-slate-600 border-slate-200"     },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_CONFIG[status] ?? STATUS_CONFIG.draft;
  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${s.cls}`}>{s.label}</span>
  );
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function TeacherUploadPage() {
  const { data: session } = useSession();

  const [activeTab, setActiveTab] = useState<ActiveTab>("upload");

  // Upload form state
  const [cls,      setCls]      = useState("8");
  const [section,  setSection]  = useState("A");
  const [examName, setExamName] = useState("FA-1");

  const [step,            setStep]            = useState<Step>("configure");
  const [preview,         setPreview]         = useState<ValidationResult | null>(null);
  const [selectedFile,    setSelectedFile]    = useState<File | null>(null);
  const [uploading,       setUploading]       = useState(false);
  const [submitting,      setSubmitting]      = useState(false);
  const [uploadError,     setUploadError]     = useState("");
  const [submitError,     setSubmitError]     = useState("");
  const [submittedExamId, setSubmittedExamId] = useState<number | null>(null);

  // Submissions state + auto-polling
  const [submissions,  setSubmissions] = useState<Submission[]>([]);
  const [subsLoading,  setSubsLoading] = useState(false);
  const subsHasLoaded  = useRef(false);
  const subsIntervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  // Teacher alerts (in-app notifications from admin decisions)
  const { alerts, unreadCount, markRead, markAllRead } = useTeacherAlerts();
  const unreadAlerts = alerts.filter((a) => !a.isRead);

  const fileRef = useRef<HTMLInputElement>(null);

  const fetchSubmissions = useCallback(async () => {
    // Only show the spinner on the very first load; background polls are silent
    if (!subsHasLoaded.current) setSubsLoading(true);
    try {
      const res = await fetch("/api/teacher/submissions");
      const d   = await res.json();
      setSubmissions(Array.isArray(d) ? d : []);
    } finally {
      setSubsLoading(false);
      subsHasLoaded.current = true;
    }
  }, []);

  // Auto-poll submissions every 30s when on that tab; clear when leaving
  useEffect(() => {
    if (activeTab === "submissions") {
      fetchSubmissions();
      subsIntervalRef.current = setInterval(fetchSubmissions, 30_000);
    } else {
      clearInterval(subsIntervalRef.current);
    }
    return () => clearInterval(subsIntervalRef.current);
  }, [activeTab, fetchSubmissions]);

  function downloadTemplate() {
    const url = `/api/marks/template?class=${cls}&section=${section}&exam=${encodeURIComponent(examName)}`;
    const a = document.createElement("a");
    a.href = url;
    a.click();
  }

  async function handleUpload(file: File) {
    setUploading(true);
    setUploadError("");
    const form = new FormData();
    form.append("file",    file);
    form.append("class",   cls);
    form.append("section", section);
    form.append("exam",    examName);
    const res  = await fetch("/api/marks/upload", { method: "POST", body: form });
    const data = await res.json();
    setUploading(false);
    if (!res.ok) { setUploadError(data.error ?? "Upload failed."); return; }
    setPreview(data as ValidationResult);
    setStep("preview");
  }

  async function handleSubmit() {
    if (!preview) return;
    setSubmitting(true);
    setSubmitError("");
    const res = await fetch("/api/marks/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ class: cls, section, examName, rows: preview.rows }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) { setSubmitError(data.error ?? "Submission failed."); return; }
    setSubmittedExamId(data.examId);
    setStep("done");
  }

  function reset() {
    setStep("configure");
    setPreview(null);
    setSelectedFile(null);
    setUploadError("");
    setSubmitError("");
    setSubmittedExamId(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  function resubmit(sub: Submission) {
    setCls(sub.class);
    setSection(sub.section);
    setExamName(sub.name);
    reset();
    setActiveTab("upload");
  }

  function gradeColor(g: string) {
    if (["A1","A2"].includes(g)) return "text-[#3fb950]";
    if (["B1","B2"].includes(g)) return "text-sky-400";
    if (["C1","C2"].includes(g)) return "text-yellow-400";
    if (g === "D") return "text-orange-400";
    if (g === "F") return "text-red-400";
    return "text-slate-400";
  }

  return (
    <div className="min-h-screen bg-[#0d1117]">
      {/* Top bar */}
      <header className="border-b border-[#21262d] bg-[#161b22] px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/images/school_logo/Newtons_logo.png" alt="Newton's" width={100} height={34} className="brightness-0 invert" />
            <span className="hidden text-[13px] text-slate-400 sm:inline">Teacher Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[13px] text-slate-400">{session?.user?.name}</span>
            <button
              onClick={() => signOut({ callbackUrl: "/teacher" })}
              className="rounded-lg border border-[#30363d] px-3 py-1.5 text-[12px] text-slate-400 hover:border-slate-500 hover:text-white transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Tab bar */}
      <div className="border-b border-[#21262d] bg-[#161b22] px-6">
        <div className="mx-auto flex max-w-6xl gap-1">
          {(["upload", "submissions"] as ActiveTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); if (tab === "submissions") markAllRead(); }}
              className={`px-4 py-3 text-[13px] font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-[#F39200] text-white"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab === "upload" ? "Upload Marks" : "My Submissions"}
              {tab === "submissions" && unreadCount > 0 && (
                <span className="ml-2 rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-10">

        {/* ─────────── UPLOAD TAB ─────────── */}
        {activeTab === "upload" && (
          <>
            {/* DONE */}
            {step === "done" && (
              <div className="rounded-2xl border border-[#238636]/40 bg-[#0f2a1a] p-10 text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#238636]/20">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#3fb950" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8" aria-hidden><polyline points="20 6 9 17 4 12" /></svg>
                </div>
                <h2 className="mb-2 text-xl font-extrabold text-white">Submitted for Approval</h2>
                <p className="text-[14px] text-slate-400">
                  {examName} — Class {cls}{section} sent to admin for review.
                  <br />Results go live once the admin approves.
                </p>
                {submittedExamId && <p className="mt-3 text-[12px] text-slate-600">Reference ID: #{submittedExamId}</p>}
                <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                  <button onClick={reset} className="rounded-xl bg-[#F39200] px-6 py-3 text-[14px] font-bold text-white hover:bg-[#E58300] transition-colors">
                    Upload Another Sheet
                  </button>
                  <button onClick={() => { setActiveTab("submissions"); fetchSubmissions(); }} className="rounded-xl border border-[#30363d] px-6 py-3 text-[14px] font-medium text-slate-300 hover:border-slate-500 transition-colors">
                    View My Submissions
                  </button>
                </div>
              </div>
            )}

            {/* CONFIGURE */}
            {step === "configure" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-extrabold text-white">Upload Mark Sheet</h1>
                  <p className="mt-1 text-[14px] text-slate-400">
                    Select exam, class, and section. Download the template — marks limits are shown in each column header.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#21262d] bg-[#161b22] p-6">
                  <h2 className="mb-5 text-[15px] font-bold text-white">Step 1 — Select Exam</h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">Class</label>
                      <select value={cls} onChange={(e) => setCls(e.target.value)} className="w-full rounded-xl border border-[#30363d] bg-[#0d1117] px-4 py-2.5 text-sm text-white focus:border-[#F39200] focus:outline-none">
                        {CLASSES.map((c) => <option key={c} value={c}>Class {c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">Section</label>
                      <select value={section} onChange={(e) => setSection(e.target.value)} className="w-full rounded-xl border border-[#30363d] bg-[#0d1117] px-4 py-2.5 text-sm text-white focus:border-[#F39200] focus:outline-none">
                        {SECTIONS.map((s) => <option key={s} value={s}>Section {s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">Exam</label>
                      <select value={examName} onChange={(e) => setExamName(e.target.value)} className="w-full rounded-xl border border-[#30363d] bg-[#0d1117] px-4 py-2.5 text-sm text-white focus:border-[#F39200] focus:outline-none">
                        {EXAM_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#30363d] bg-[#0d1117] px-4 py-1.5">
                    <span className="text-[12px] text-slate-400">
                      {examName.startsWith("FA")
                        ? "FA exam · 20 marks per subject · Phy. Science 10 + Bio. Science 10 · Total 120"
                        : "SA exam · 100 marks per subject · Phy. Science 50 + Bio. Science 50 · Total 600"}
                    </span>
                  </div>

                  <div className="mt-5">
                    <button onClick={downloadTemplate} className="inline-flex items-center gap-2 rounded-xl border border-[#30363d] bg-[#21262d] px-5 py-2.5 text-[13px] font-semibold text-slate-200 hover:border-slate-500 hover:bg-[#2d333b] transition-colors">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                      Download Template — {examName} Class {cls}{section}
                    </button>
                    <p className="mt-2 text-[12px] text-slate-600">
                      Each column shows the max marks. Total, %, and Grade are auto-computed by the system.
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#21262d] bg-[#161b22] p-6">
                  <h2 className="mb-5 text-[15px] font-bold text-white">Step 2 — Upload Filled Sheet</h2>
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#30363d] bg-[#0d1117] p-10 text-center transition-colors hover:border-[#F39200]/50 hover:bg-[#F39200]/5">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="mb-3 h-10 w-10 text-slate-500" aria-hidden><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                    <span className="text-[14px] font-semibold text-slate-300">{selectedFile ? selectedFile.name : "Click to select Excel file"}</span>
                    <span className="mt-1 text-[12px] text-slate-600">.xlsx files only</span>
                    <input ref={fileRef} type="file" accept=".xlsx,.xls" className="sr-only"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) { setSelectedFile(f); setUploadError(""); } }} />
                  </label>

                  {uploadError && (
                    <div className="mt-4 rounded-xl border border-red-800/50 bg-red-900/20 px-4 py-3 text-[13px] text-red-400">{uploadError}</div>
                  )}

                  <button disabled={!selectedFile || uploading} onClick={() => selectedFile && handleUpload(selectedFile)}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#F39200] px-6 py-3 text-[14px] font-bold text-white hover:bg-[#E58300] disabled:opacity-40 transition-colors">
                    {uploading ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Validating…</> : "Validate & Preview"}
                  </button>
                </div>
              </div>
            )}

            {/* PREVIEW */}
            {step === "preview" && preview && (
              <div className="space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-extrabold text-white">Preview Mark Sheet</h1>
                    <p className="mt-1 text-[14px] text-slate-400">
                      {examName} — Class {cls}{section} · {preview.studentCount} students · Max {preview.totalMax} marks
                    </p>
                  </div>
                  <button onClick={reset} className="shrink-0 text-[13px] text-slate-500 hover:text-slate-300 transition-colors">← Start over</button>
                </div>

                {preview.hasErrors ? (
                  <div className="rounded-xl border border-red-800/50 bg-red-900/15 px-5 py-4">
                    <p className="font-semibold text-red-400">
                      {preview.errorCount} error{preview.errorCount !== 1 ? "s" : ""} found — fix the sheet and re-upload.
                    </p>
                    <ul className="mt-2 space-y-1">
                      {preview.rows.flatMap((r) => r.errors).slice(0, 10).map((err, i) => (
                        <li key={i} className="text-[12.5px] text-red-400/80">• {err}</li>
                      ))}
                      {preview.errorCount > 10 && <li className="text-[12px] text-slate-500">…and {preview.errorCount - 10} more</li>}
                    </ul>
                  </div>
                ) : (
                  <div className="rounded-xl border border-[#238636]/40 bg-[#0f2a1a] px-5 py-4 text-[13px] text-[#3fb950]">
                    All {preview.studentCount} rows validated. No errors found.
                  </div>
                )}

                <div className="overflow-x-auto rounded-2xl border border-[#21262d]">
                  <table className="w-full text-[12.5px]">
                    <thead>
                      <tr className="border-b border-[#21262d] bg-[#161b22]">
                        <th className="whitespace-nowrap px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">#</th>
                        <th className="whitespace-nowrap px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">Adm. No.</th>
                        <th className="whitespace-nowrap px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">Student Name</th>
                        {preview.subjectHeaders.map((h) => (
                          <th key={h} className="whitespace-nowrap px-2 py-3 text-center text-[10px] font-bold uppercase tracking-wide text-slate-400">{h}</th>
                        ))}
                        <th className="whitespace-nowrap px-3 py-3 text-center text-[10px] font-bold uppercase tracking-wide text-[#F39200]">Total</th>
                        <th className="whitespace-nowrap px-3 py-3 text-center text-[10px] font-bold uppercase tracking-wide text-[#F39200]">%</th>
                        <th className="whitespace-nowrap px-3 py-3 text-center text-[10px] font-bold uppercase tracking-wide text-[#F39200]">Grade</th>
                        <th className="whitespace-nowrap px-3 py-3 text-center text-[10px] font-bold uppercase tracking-wide text-slate-400">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#21262d] bg-[#0d1117]">
                      {preview.rows.map((row, i) => (
                        <tr key={i} className={row.errors.length > 0 ? "bg-red-900/10" : ""}>
                          <td className="px-3 py-3 text-[11px] text-slate-600">{i + 1}</td>
                          <td className="px-3 py-3 font-mono text-[11px] text-slate-400">{row.admNo}</td>
                          <td className="px-3 py-3 font-medium text-white">{row.name}</td>
                          {preview.subjects.map((sub) => {
                            const max = preview.subjectMaxMap[sub];
                            const val = row.marks[sub];
                            const isAbsent = val === "AB";
                            const isOver   = !isAbsent && val !== "" && Number(val) > max;
                            return (
                              <td key={sub} className="px-2 py-3 text-center">
                                {isAbsent
                                  ? <span className="rounded bg-amber-900/40 px-1.5 py-0.5 text-[11px] font-bold text-amber-400">AB</span>
                                  : isOver
                                    ? <span className="rounded bg-red-900/40 px-1.5 py-0.5 text-[11px] font-bold text-red-400">{val}!</span>
                                    : <span className="text-slate-300">{val || "—"}</span>
                                }
                              </td>
                            );
                          })}
                          <td className="px-3 py-3 text-center font-bold text-[#F39200]">
                            {row.errors.length === 0 ? `${row.total}/${row.maxPresent}` : "—"}
                          </td>
                          <td className="px-3 py-3 text-center font-semibold text-slate-300">
                            {row.errors.length === 0 ? `${row.percentage}%` : "—"}
                          </td>
                          <td className={`px-3 py-3 text-center text-[13px] font-extrabold ${row.errors.length === 0 ? gradeColor(row.grade) : "text-slate-600"}`}>
                            {row.errors.length === 0 ? row.grade : "—"}
                          </td>
                          <td className="px-3 py-3 text-center">
                            {row.errors.length > 0
                              ? <span className="rounded bg-red-900/40 px-1.5 py-0.5 text-[11px] font-bold text-red-400">Error</span>
                              : <span className="rounded bg-[#238636]/20 px-1.5 py-0.5 text-[11px] font-bold text-[#3fb950]">OK</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {!preview.hasErrors && (
                  <div className="flex items-center gap-4">
                    {submitError && <p className="text-[13px] text-red-400">{submitError}</p>}
                    <button disabled={submitting} onClick={handleSubmit}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#F39200] px-8 py-3.5 text-[15px] font-bold text-white hover:bg-[#E58300] disabled:opacity-50 transition-colors">
                      {submitting
                        ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Submitting…</>
                        : "Submit for Admin Approval"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* ─────────── SUBMISSIONS TAB ─────────── */}
        {activeTab === "submissions" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-extrabold text-white">My Submissions</h1>
                <p className="mt-1 text-[14px] text-slate-400">Track all mark sheets you have submitted and view admin feedback. Auto-refreshes every 30s.</p>
              </div>
              <button onClick={fetchSubmissions} className="rounded-lg border border-[#30363d] px-3 py-1.5 text-[12px] text-slate-400 hover:border-slate-500 hover:text-white transition-colors">
                Refresh
              </button>
            </div>

            {/* Admin decision alerts */}
            {unreadAlerts.length > 0 && (
              <div className="space-y-2">
                {unreadAlerts.map((alert) => (
                  <AlertBanner key={alert.id} alert={alert} onDismiss={markRead} />
                ))}
              </div>
            )}

            {subsLoading ? (
              <div className="py-20 text-center text-slate-400">Loading submissions…</div>
            ) : submissions.length === 0 ? (
              <div className="rounded-2xl border border-[#21262d] bg-[#161b22] py-20 text-center text-slate-500 text-[14px]">
                No submissions yet. Upload a mark sheet to get started.
              </div>
            ) : (
              <div className="space-y-3">
                {submissions.map((sub) => (
                  <div key={sub.id}
                    className={`rounded-2xl border bg-[#161b22] p-5 ${
                      sub.status === "rejected" ? "border-red-800/50" : "border-[#21262d]"
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="text-[15px] font-extrabold text-white">{sub.name}</span>
                          <span className="text-[13px] text-slate-400">Class {sub.class}–{sub.section}</span>
                          <StatusBadge status={sub.status} />
                        </div>
                        <div className="flex flex-wrap gap-4 text-[12px] text-slate-500">
                          <span>Submitted {fmt(sub.createdAt)}</span>
                          <span>{sub.studentCount} students</span>
                          <span>Ref: #{sub.id}</span>
                          {sub.status === "published" && sub.publishedAt && (
                            <span className="text-emerald-500">Published {fmt(sub.publishedAt)}</span>
                          )}
                        </div>
                      </div>
                      {sub.status === "rejected" && (
                        <button
                          onClick={() => resubmit(sub)}
                          className="shrink-0 rounded-xl bg-[#F39200] px-4 py-2 text-[13px] font-bold text-white hover:bg-[#E58300] transition-colors"
                        >
                          Edit & Resubmit
                        </button>
                      )}
                    </div>

                    {/* Rejection feedback */}
                    {sub.status === "rejected" && sub.rejectNote && (
                      <div className="mt-4 rounded-xl border border-red-800/40 bg-red-900/15 px-4 py-3">
                        <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-red-400">Admin Feedback</p>
                        <p className="text-[13px] text-red-300">{sub.rejectNote}</p>
                      </div>
                    )}

                    {sub.status === "pending_approval" && (
                      <div className="mt-4 rounded-xl border border-amber-800/30 bg-amber-900/10 px-4 py-3 text-[12px] text-amber-400">
                        Awaiting admin review. You will be notified once a decision is made.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
