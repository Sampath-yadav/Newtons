"use client";

import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AuditLogPanel } from "~/components/admin/AuditLogPanel";

interface ExamInfo {
  id: number;
  name: string;
  class: string;
  section: string;
  status: string;
  rejectNote: string | null;
  publishedAt: string | null;
  createdAt: string;
  uploadedBy: { name: string; email: string };
}

interface StudentRow {
  admissionNumber: string;
  name: string;
  marks: Record<string, string>;
  total: number;
  maxPresent: number;
  percentage: string;
  grade: string;
  absentCount: number;
}

interface Stats {
  studentCount: number;
  highest: number;
  lowest: number;
  average: number;
  maxMarks: number;
  passCount: number;
  passPercentage: string;
  absentStudents: number;
  gradeDistribution: Record<string, number>;
}

interface ReviewData {
  exam: ExamInfo;
  config: { subjects: string[]; subjectHeaders: string[]; totalMax: number };
  students: StudentRow[];
  stats: Stats;
}

const GRADE_ORDER = ["A1", "A2", "B1", "B2", "C1", "C2", "D", "F"];
const GRADE_COLORS: Record<string, { bar: string; text: string; bg: string }> = {
  A1: { bar: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50" },
  A2: { bar: "bg-green-500",   text: "text-green-700",   bg: "bg-green-50"   },
  B1: { bar: "bg-sky-500",     text: "text-sky-700",     bg: "bg-sky-50"     },
  B2: { bar: "bg-blue-500",    text: "text-blue-700",    bg: "bg-blue-50"    },
  C1: { bar: "bg-yellow-500",  text: "text-yellow-700",  bg: "bg-yellow-50"  },
  C2: { bar: "bg-amber-500",   text: "text-amber-700",   bg: "bg-amber-50"   },
  D:  { bar: "bg-orange-500",  text: "text-orange-700",  bg: "bg-orange-50"  },
  F:  { bar: "bg-red-500",     text: "text-red-700",     bg: "bg-red-50"     },
};

function gradeTextColor(g: string) {
  return GRADE_COLORS[g]?.text ?? "text-slate-500";
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string; label: string }> = {
    pending_approval: { cls: "bg-amber-100 text-amber-800 border-amber-200",   label: "Pending Review" },
    published:        { cls: "bg-emerald-100 text-emerald-800 border-emerald-200", label: "Published"  },
    rejected:         { cls: "bg-red-100 text-red-800 border-red-200",         label: "Rejected"      },
  };
  const s = map[status] ?? { cls: "bg-slate-100 text-slate-600 border-slate-200", label: status };
  return (
    <span className={`rounded-full border px-3 py-1 text-[11px] font-bold ${s.cls}`}>{s.label}</span>
  );
}

const PAGE_SIZE = 20;

export default function ReviewPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const params = useParams();
  const examId = params?.examId as string;

  const [data, setData] = useState<ReviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Modals
  const [approveModal, setApproveModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectNote, setRejectNote] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");
  const [actionDone, setActionDone] = useState("");
  const [auditOpen,  setAuditOpen]  = useState(false);

  useEffect(() => {
    if (authStatus === "unauthenticated") router.push("/admin");
    if (authStatus === "authenticated" && session?.user?.role !== "ADMIN") router.push("/teacher/upload");
  }, [authStatus, session, router]);

  useEffect(() => {
    if (!examId) return;
    setLoading(true);
    fetch(`/api/admin/exams/${examId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else setData(d);
      })
      .catch(() => setError("Failed to load exam data."))
      .finally(() => setLoading(false));
  }, [examId]);

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = search.toLowerCase();
    return data.students.filter(
      (s) => s.name.toLowerCase().includes(q) || s.admissionNumber.toLowerCase().includes(q)
    );
  }, [data, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  async function handleApprove() {
    setActionLoading(true);
    setActionError("");
    const res = await fetch("/api/marks/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ examId: Number(examId) }),
    });
    const d = await res.json();
    setActionLoading(false);
    if (!res.ok) { setActionError(d.error); return; }
    setApproveModal(false);
    setActionDone("approved");
    // Refresh
    const r = await fetch(`/api/admin/exams/${examId}`);
    const updated = await r.json();
    if (!updated.error) setData(updated);
  }

  async function handleReject() {
    setActionLoading(true);
    setActionError("");
    const res = await fetch("/api/marks/reject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ examId: Number(examId), note: rejectNote }),
    });
    const d = await res.json();
    setActionLoading(false);
    if (!res.ok) { setActionError(d.error); return; }
    setRejectModal(false);
    setRejectNote("");
    setActionDone("rejected");
    const r = await fetch(`/api/admin/exams/${examId}`);
    const updated = await r.json();
    if (!updated.error) setData(updated);
  }

  if (authStatus === "loading" || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] text-slate-400">
        Loading…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f8fafc]">
        <p className="text-red-600">{error}</p>
        <Link href="/admin/marks" className="text-[13px] text-[#060C8B] underline">← Back to Dashboard</Link>
      </div>
    );
  }

  if (!data) return null;

  const { exam, config, stats } = data;
  const isPending = exam.status === "pending_approval";

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Image src="/images/school_logo/Newtons_logo.png" alt="Newton's" width={90} height={30} />
            <div className="hidden h-5 w-px bg-slate-200 sm:block" />
            <Link href="/admin/marks" className="flex items-center gap-1.5 text-[13px] text-slate-500 hover:text-[#060C8B] transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden><polyline points="15 18 9 12 15 6" /></svg>
              Dashboard
            </Link>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 text-slate-300" aria-hidden><polyline points="9 18 15 12 9 6" /></svg>
            <span className="text-[13px] font-semibold text-[#1F2A66]">
              {exam.name} — Class {exam.class}{exam.section}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={exam.status} />
            <button
              onClick={() => setAuditOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-[12px] font-semibold text-slate-500 hover:bg-slate-50 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
              History
            </button>
            {isPending && (
              <>
                <button
                  onClick={() => setApproveModal(true)}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-[13px] font-bold text-white hover:bg-emerald-700 transition-colors"
                >
                  Approve & Publish
                </button>
                <button
                  onClick={() => setRejectModal(true)}
                  className="rounded-lg border border-red-200 px-4 py-2 text-[13px] font-bold text-red-600 hover:bg-red-50 transition-colors"
                >
                  Reject
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 space-y-6">

        {/* Action feedback banner */}
        {actionDone === "approved" && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-[14px] font-semibold text-emerald-800">
            Results approved and published. Parents can now view results via their links.
          </div>
        )}
        {actionDone === "rejected" && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-[14px] font-semibold text-red-800">
            Mark sheet rejected. The teacher has been notified and can resubmit after corrections.
          </div>
        )}

        {/* Rejection note shown if already rejected */}
        {exam.status === "rejected" && exam.rejectNote && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4">
            <p className="text-[12px] font-bold uppercase tracking-wide text-red-500 mb-1">Rejection Reason</p>
            <p className="text-[14px] text-red-800">{exam.rejectNote}</p>
          </div>
        )}

        {/* Submission meta */}
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-4">
          <div className="flex flex-wrap items-center gap-6 text-[13px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-slate-400" aria-hidden><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              <span className="font-medium text-slate-700">{exam.uploadedBy.name}</span>
              <span className="text-slate-400">({exam.uploadedBy.email})</span>
            </span>
            <span className="flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-slate-400" aria-hidden><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
              Submitted {new Date(exam.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </span>
            <span className="flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-slate-400" aria-hidden><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
              {stats.studentCount} students
            </span>
            <span className="flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-slate-400" aria-hidden><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
              Max {config.totalMax} marks
            </span>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {[
            { label: "Highest Score", value: `${stats.highest}/${stats.maxMarks}`, color: "text-emerald-600" },
            { label: "Lowest Score",  value: `${stats.lowest}/${stats.maxMarks}`,  color: "text-red-500"     },
            { label: "Class Average", value: `${stats.average}/${stats.maxMarks}`, color: "text-[#060C8B]"   },
            { label: "Pass Rate",     value: `${stats.passPercentage}%`,           color: "text-sky-600"     },
            { label: "Absent Students", value: String(stats.absentStudents),       color: "text-amber-600"   },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-center">
              <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
              <p className="mt-1 text-[11px] text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Grade distribution */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="mb-5 text-[15px] font-bold text-[#1F2A66]">Grade Distribution</h2>
          <div className="space-y-3">
            {GRADE_ORDER.filter((g) => (stats.gradeDistribution[g] ?? 0) > 0 || g === "A1").map((g) => {
              const count = stats.gradeDistribution[g] ?? 0;
              const pct   = stats.studentCount > 0 ? (count / stats.studentCount) * 100 : 0;
              const c     = GRADE_COLORS[g] ?? { bar: "bg-slate-400", text: "text-slate-600", bg: "bg-slate-50" };
              return (
                <div key={g} className="flex items-center gap-3">
                  <span className={`w-7 text-center text-[13px] font-extrabold ${c.text}`}>{g}</span>
                  <div className="flex-1 overflow-hidden rounded-full bg-slate-100 h-4">
                    <div
                      className={`h-4 rounded-full transition-all duration-500 ${c.bar}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-28 text-right text-[12px] text-slate-500">
                    {count} student{count !== 1 ? "s" : ""} ({pct.toFixed(0)}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Student table */}
        <div className="rounded-2xl border border-slate-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-6 py-4">
            <h2 className="text-[15px] font-bold text-[#1F2A66]">Student Results</h2>
            <input
              type="search"
              placeholder="Search by name or admission number…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full rounded-xl border border-slate-200 px-4 py-2 text-[13px] text-slate-700 placeholder:text-slate-400 focus:border-[#060C8B] focus:outline-none sm:w-72"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px]">
              <thead className="bg-slate-50">
                <tr>
                  <th className="whitespace-nowrap px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">#</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">Adm. No.</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">Student Name</th>
                  {config.subjectHeaders.map((h) => (
                    <th key={h} className="whitespace-nowrap px-2 py-3 text-center text-[10px] font-bold uppercase tracking-wide text-slate-400">{h}</th>
                  ))}
                  <th className="whitespace-nowrap px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wide text-[#060C8B]">Total</th>
                  <th className="whitespace-nowrap px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wide text-[#060C8B]">%</th>
                  <th className="whitespace-nowrap px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wide text-[#060C8B]">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginated.map((s, i) => (
                  <tr key={s.admissionNumber} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-[11px] text-slate-400">{(page - 1) * PAGE_SIZE + i + 1}</td>
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-500">{s.admissionNumber}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{s.name}</td>
                    {config.subjects.map((sub) => {
                      const val = s.marks[sub] ?? "";
                      return (
                        <td key={sub} className="px-2 py-3 text-center">
                          {val === "AB"
                            ? <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[11px] font-bold text-amber-700">AB</span>
                            : <span className="text-slate-700">{val || "—"}</span>
                          }
                        </td>
                      );
                    })}
                    <td className="px-4 py-3 text-center font-bold text-[#060C8B]">
                      {s.maxPresent > 0 ? `${s.total}/${s.maxPresent}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-slate-600">
                      {s.percentage !== "—" ? `${s.percentage}%` : "—"}
                    </td>
                    <td className={`px-4 py-3 text-center text-[13px] font-extrabold ${gradeTextColor(s.grade)}`}>
                      {s.grade}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
              <span className="text-[12px] text-slate-500">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-[12px] text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
                >
                  Previous
                </button>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-[12px] text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom action bar */}
        {isPending && (
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-4">
            <p className="flex-1 text-[13px] text-slate-500">
              Review complete? Approve to publish results or reject with feedback for the teacher.
            </p>
            <button
              onClick={() => setRejectModal(true)}
              className="rounded-xl border border-red-200 px-5 py-2.5 text-[13px] font-bold text-red-600 hover:bg-red-50 transition-colors"
            >
              Reject
            </button>
            <button
              onClick={() => setApproveModal(true)}
              className="rounded-xl bg-emerald-600 px-5 py-2.5 text-[13px] font-bold text-white hover:bg-emerald-700 transition-colors"
            >
              Approve & Publish
            </button>
          </div>
        )}
      </main>

      {/* Approve Confirmation Modal */}
      {approveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
              <svg viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <h3 className="mb-1 text-[17px] font-extrabold text-[#1F2A66]">Approve & Publish Results?</h3>
            <p className="mb-5 text-[13px] text-slate-500">
              This will publish {exam.name} results for Class {exam.class}{exam.section} ({stats.studentCount} students).
              Parents will receive SMS notifications with their result links.
            </p>
            <div className="mb-5 rounded-xl bg-slate-50 px-4 py-3 text-[13px] space-y-1">
              <div className="flex justify-between"><span className="text-slate-500">Exam</span><span className="font-semibold text-slate-700">{exam.name}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Class</span><span className="font-semibold text-slate-700">{exam.class}-{exam.section}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Teacher</span><span className="font-semibold text-slate-700">{exam.uploadedBy.name}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Students</span><span className="font-semibold text-slate-700">{stats.studentCount}</span></div>
            </div>
            {actionError && <p className="mb-3 text-[13px] text-red-600">{actionError}</p>}
            <div className="flex gap-3">
              <button
                disabled={actionLoading}
                onClick={handleApprove}
                className="flex-1 rounded-xl bg-emerald-600 py-3 text-[14px] font-bold text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
              >
                {actionLoading ? "Publishing…" : "Confirm Approve"}
              </button>
              <button
                onClick={() => { setApproveModal(false); setActionError(""); }}
                className="flex-1 rounded-xl border border-slate-200 py-3 text-[14px] font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </div>
            <h3 className="mb-1 text-[17px] font-extrabold text-[#1F2A66]">Reject Mark Sheet</h3>
            <p className="mb-4 text-[13px] text-slate-500">
              {exam.name} — Class {exam.class}{exam.section} · {exam.uploadedBy.name}
            </p>
            <label className="mb-1.5 block text-[12px] font-semibold text-slate-600">
              Reason for rejection <span className="font-normal text-slate-400">(shown to teacher)</span>
            </label>
            <textarea
              rows={3}
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              placeholder="e.g. Marks for 3 students appear incorrect in rows 15–17. Please verify and resubmit."
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-[13px] text-slate-800 placeholder:text-slate-400 focus:border-[#060C8B] focus:outline-none"
            />
            {actionError && <p className="mt-2 text-[13px] text-red-600">{actionError}</p>}
            <div className="mt-5 flex gap-3">
              <button
                disabled={actionLoading}
                onClick={handleReject}
                className="flex-1 rounded-xl bg-red-600 py-3 text-[14px] font-bold text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {actionLoading ? "Rejecting…" : "Reject & Notify Teacher"}
              </button>
              <button
                onClick={() => { setRejectModal(false); setRejectNote(""); setActionError(""); }}
                className="flex-1 rounded-xl border border-slate-200 py-3 text-[14px] font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audit log modal */}
      {auditOpen && data && (
        <AuditLogPanel
          examId={data.exam.id}
          examLabel={`${data.exam.name} — Class ${data.exam.class}${data.exam.section}`}
          onClose={() => setAuditOpen(false)}
        />
      )}
    </div>
  );
}
