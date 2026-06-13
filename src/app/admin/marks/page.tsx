"use client";

import { useEffect, useState, useMemo } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAdminExamPolling } from "~/hooks/useAdminExamPolling";
import { NewSubmissionToast } from "~/components/admin/NewSubmissionToast";
import { AuditLogPanel } from "~/components/admin/AuditLogPanel";

interface Exam {
  id: number;
  name: string;
  class: string;
  section: string;
  status: string;
  rejectNote: string | null;
  publishedAt: string | null;
  createdAt: string;
  uploadedBy: { name: string; email: string };
  _count: { marks: number };
  studentCount: number;
}

type FilterKey = "all" | "pending_approval" | "published" | "rejected";

const FILTER_LABELS: Record<FilterKey, string> = {
  all:              "All Submissions",
  pending_approval: "Pending Review",
  published:        "Published",
  rejected:         "Rejected",
};

const STATUS_STYLES: Record<string, { badge: string; dot: string }> = {
  pending_approval: { badge: "bg-amber-100 text-amber-800 border-amber-200",     dot: "bg-amber-500"   },
  published:        { badge: "bg-emerald-100 text-emerald-800 border-emerald-200", dot: "bg-emerald-500" },
  rejected:         { badge: "bg-red-100 text-red-800 border-red-200",           dot: "bg-red-500"     },
  draft:            { badge: "bg-slate-100 text-slate-600 border-slate-200",     dot: "bg-slate-400"   },
};

const STATUS_LABELS: Record<string, string> = {
  pending_approval: "Pending Review",
  published:        "Published",
  rejected:         "Rejected",
  draft:            "Draft",
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.draft;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${s.badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function isToday(iso: string) {
  const d = new Date(iso);
  const t = new Date();
  return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate();
}

export default function AdminMarksPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();

  const [filter, setFilter] = useState<FilterKey>("pending_approval");

  const [approveModal, setApproveModal] = useState<Exam | null>(null);
  const [rejectModal, setRejectModal]   = useState<Exam | null>(null);
  const [rejectNote, setRejectNote]     = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError]     = useState("");

  // Audit log modal
  const [auditExam, setAuditExam] = useState<Exam | null>(null);

  // Auto-polling hook — replaces manual fetchExams + useState<Exam[]>
  const { exams, newSubmissions, clearNewSubmissions, refetch: fetchExams } = useAdminExamPolling();
  const loading = exams.length === 0 && newSubmissions.length === 0;

  useEffect(() => {
    if (authStatus === "unauthenticated") router.push("/admin");
    if (authStatus === "authenticated" && session?.user?.role !== "admin") router.push("/teacher/upload");
  }, [authStatus, session, router]);

  async function handleApprove() {
    if (!approveModal) return;
    setActionLoading(true);
    setActionError("");
    const res = await fetch("/api/marks/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ examId: approveModal.id }),
    });
    const data = await res.json();
    setActionLoading(false);
    if (!res.ok) { setActionError(data.error); return; }
    setApproveModal(null);
    fetchExams();
  }

  async function handleReject() {
    if (!rejectModal) return;
    setActionLoading(true);
    setActionError("");
    const res = await fetch("/api/marks/reject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ examId: rejectModal.id, note: rejectNote }),
    });
    const data = await res.json();
    setActionLoading(false);
    if (!res.ok) { setActionError(data.error); return; }
    setRejectModal(null);
    setRejectNote("");
    fetchExams();
  }

  const filtered = useMemo(
    () => (filter === "all" ? exams : exams.filter((e) => e.status === filter)),
    [exams, filter]
  );

  const pendingCount       = exams.filter((e) => e.status === "pending_approval").length;
  const publishedTodayCount = exams.filter((e) => e.status === "published" && e.publishedAt && isToday(e.publishedAt)).length;
  const rejectedTodayCount  = exams.filter((e) => e.status === "rejected" && isToday(e.createdAt)).length;
  const totalPublished      = exams.filter((e) => e.status === "published").length;

  if (authStatus === "loading") {
    return <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] text-slate-400">Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white px-4 py-3.5 sm:px-6 sm:py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/images/school_logo/Newtons_logo.png" alt="Newton's" width={100} height={34} />
            <div className="hidden h-5 w-px bg-slate-200 sm:block" />
            <div className="hidden sm:block">
              <p className="text-[13px] font-bold text-[#060C8B]">Admin Portal</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Marks Approval Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[13px] text-slate-500">{session?.user?.name}</span>
            <button
              onClick={() => signOut({ callbackUrl: "/admin" })}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-[12px] text-slate-500 hover:bg-slate-50 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Sub-nav */}
      <div className="border-b border-slate-200 bg-white px-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl gap-1">
          <span className="border-b-2 border-[#060C8B] px-3 py-3 text-[13px] font-semibold text-[#060C8B]">
            Mark Approvals
          </span>
          <Link href="/admin/students" className="border-b-2 border-transparent px-3 py-3 text-[13px] font-medium text-slate-500 hover:text-slate-800 transition-colors">
            Students
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Page title + refresh */}
        <div className="mb-6 flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-extrabold text-[#1F2A66] sm:text-2xl">Mark Sheet Approvals</h1>
            <p className="mt-0.5 text-[13px] text-slate-400">Review, approve, or reject mark sheets submitted by teachers.</p>
          </div>
          <button
            onClick={fetchExams}
            className="flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12px] text-slate-500 hover:bg-slate-50 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>
            Refresh
          </button>
        </div>

        {/* Summary stat cards */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:grid-cols-4 sm:gap-4">
          {[
            { label: "Pending Reviews",   value: pendingCount,        color: "text-amber-600",   icon: "⏳", bg: "bg-amber-50 border-amber-100"    },
            { label: "Published Today",   value: publishedTodayCount, color: "text-emerald-600", icon: "✓",  bg: "bg-emerald-50 border-emerald-100" },
            { label: "Rejected Today",    value: rejectedTodayCount,  color: "text-red-600",     icon: "✕",  bg: "bg-red-50 border-red-100"         },
            { label: "Total Published",   value: totalPublished,      color: "text-[#060C8B]",   icon: "★",  bg: "bg-blue-50 border-blue-100"       },
          ].map((s) => (
            <div key={s.label} className={`rounded-2xl border p-4 sm:p-5 ${s.bg}`}>
              <p className={`text-2xl font-extrabold sm:text-3xl ${s.color}`}>{s.value}</p>
              <p className="mt-1.5 text-[12px] font-medium text-slate-600">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Mobile filter pills */}
        <div className="mb-4 flex lg:hidden gap-2 overflow-x-auto pb-3">
          {(["pending_approval", "published", "rejected", "all"] as FilterKey[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-[12px] font-medium transition-colors ${
                filter === f ? "bg-[#060C8B] text-white" : "border border-slate-200 bg-white text-slate-600"
              }`}
            >
              {FILTER_LABELS[f]}
              {f === "pending_approval" && pendingCount > 0 && (
                <span className="ml-1.5 rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold text-white">{pendingCount}</span>
              )}
            </button>
          ))}
        </div>

        {/* 2-column layout: sidebar + cards */}
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="hidden w-52 shrink-0 lg:block">
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Filter by Status</p>
              </div>
              <nav className="p-2">
                {(["pending_approval", "published", "rejected", "all"] as FilterKey[]).map((f) => {
                  const count = f === "all" ? exams.length : exams.filter((e) => e.status === f).length;
                  const active = filter === f;
                  return (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors ${
                        active
                          ? "bg-[#060C8B] text-white"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span>{FILTER_LABELS[f]}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Exam cards */}
          <div className="min-w-0 flex-1">
            {loading ? (
              <div className="py-20 text-center text-slate-400">Loading submissions…</div>
            ) : filtered.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white py-20 text-center">
                <p className="text-slate-400 text-[14px]">No {filter === "all" ? "" : FILTER_LABELS[filter].toLowerCase()} submissions found.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((exam) => (
                  <ExamCard
                    key={exam.id}
                    exam={exam}
                    onApprove={() => { setApproveModal(exam); setActionError(""); }}
                    onReject={() => { setRejectModal(exam); setRejectNote(""); setActionError(""); }}
                    onAuditLog={() => setAuditExam(exam)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Approve Confirmation Modal */}
      {approveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
              <svg viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <h3 className="mb-1 text-[17px] font-extrabold text-[#1F2A66]">Approve & Publish Results?</h3>
            <p className="mb-5 text-[13px] text-slate-500">
              This will publish the results and make them accessible to parents.
            </p>
            <div className="mb-5 space-y-1.5 rounded-xl bg-slate-50 px-4 py-3 text-[13px]">
              <div className="flex justify-between"><span className="text-slate-500">Exam</span><span className="font-semibold text-slate-700">{approveModal.name}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Class</span><span className="font-semibold text-slate-700">{approveModal.class}-{approveModal.section}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Teacher</span><span className="font-semibold text-slate-700">{approveModal.uploadedBy.name}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Students</span><span className="font-semibold text-slate-700">{approveModal.studentCount}</span></div>
            </div>
            {actionError && <p className="mb-3 text-[13px] text-red-600">{actionError}</p>}
            <div className="flex gap-3">
              <button disabled={actionLoading} onClick={handleApprove}
                className="flex-1 rounded-xl bg-emerald-600 py-3 text-[14px] font-bold text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors">
                {actionLoading ? "Publishing…" : "Confirm Approve"}
              </button>
              <button onClick={() => { setApproveModal(null); setActionError(""); }}
                className="flex-1 rounded-xl border border-slate-200 py-3 text-[14px] font-medium text-slate-600 hover:bg-slate-50 transition-colors">
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
              {rejectModal.name} — Class {rejectModal.class}{rejectModal.section} · {rejectModal.uploadedBy.name}
            </p>
            <label className="mb-1.5 block text-[12px] font-semibold text-slate-600">
              Reason for rejection <span className="font-normal text-slate-400">(shown to teacher)</span>
            </label>
            <textarea
              rows={3}
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              placeholder="e.g. Marks for rows 15–17 appear incorrect. Please verify and resubmit."
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-[13px] text-slate-800 placeholder:text-slate-400 focus:border-[#060C8B] focus:outline-none"
            />
            {actionError && <p className="mt-2 text-[13px] text-red-600">{actionError}</p>}
            <div className="mt-5 flex gap-3">
              <button disabled={actionLoading} onClick={handleReject}
                className="flex-1 rounded-xl bg-red-600 py-3 text-[14px] font-bold text-white hover:bg-red-700 disabled:opacity-50 transition-colors">
                {actionLoading ? "Rejecting…" : "Reject & Notify Teacher"}
              </button>
              <button onClick={() => { setRejectModal(null); setRejectNote(""); setActionError(""); }}
                className="flex-1 rounded-xl border border-slate-200 py-3 text-[14px] font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New-submission toast (auto-polling detected a brand-new pending exam) */}
      <NewSubmissionToast submissions={newSubmissions} onDismiss={clearNewSubmissions} />

      {/* Audit Log modal */}
      {auditExam && (
        <AuditLogPanel
          examId={auditExam.id}
          examLabel={`${auditExam.name} — Class ${auditExam.class}${auditExam.section}`}
          onClose={() => setAuditExam(null)}
        />
      )}
    </div>
  );
}

function ExamCard({
  exam,
  onApprove,
  onReject,
  onAuditLog,
}: {
  exam: Exam;
  onApprove: () => void;
  onReject: () => void;
  onAuditLog: () => void;
}) {
  const isPending = exam.status === "pending_approval";

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Card header */}
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <p className="text-[15px] font-extrabold text-[#1F2A66]">{exam.name}</p>
          <p className="mt-0.5 text-[13px] text-slate-500">Class {exam.class} — Section {exam.section}</p>
        </div>
        <StatusBadge status={exam.status} />
      </div>

      {/* Card body */}
      <div className="flex-1 space-y-2.5 px-5 py-4 text-[13px]">
        <div className="flex items-center gap-2 text-slate-600">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
          <span className="truncate">
            <span className="font-medium text-slate-700">{exam.uploadedBy.name}</span>
            <span className="text-slate-400 ml-1 text-[11px]">{exam.uploadedBy.email}</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
          Submitted {fmt(exam.createdAt)}
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
          {exam.studentCount} students &bull; {exam._count.marks} marks recorded
        </div>

        {/* Rejection note */}
        {exam.status === "rejected" && exam.rejectNote && (
          <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-[12px] text-red-700">
            <span className="font-bold">Rejection reason: </span>{exam.rejectNote}
          </div>
        )}
        {/* Published date */}
        {exam.status === "published" && exam.publishedAt && (
          <p className="text-[12px] text-emerald-600">
            Published {fmt(exam.publishedAt)}
          </p>
        )}
      </div>

      {/* Card actions */}
      <div className="border-t border-slate-100 px-5 py-3">
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/marks/review/${exam.id}`}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-[12px] font-semibold text-[#060C8B] hover:bg-slate-50 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
            Preview
          </Link>
          <button
            onClick={onAuditLog}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-[12px] font-semibold text-slate-500 hover:bg-slate-50 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
            Log
          </button>
          {isPending && (
            <>
              <button
                onClick={onApprove}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-[12px] font-bold text-white hover:bg-emerald-700 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden><polyline points="20 6 9 17 4 12" /></svg>
                Approve
              </button>
              <button
                onClick={onReject}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-[12px] font-bold text-red-600 hover:bg-red-50 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                Reject
              </button>
            </>
          )}
          {exam.status === "published" && (
            <Link
              href={`/admin/marks/send/${exam.id}`}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#060C8B] px-3 py-2 text-[12px] font-bold text-white hover:bg-[#04096a] transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
              Send Results
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
