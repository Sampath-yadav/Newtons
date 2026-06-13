"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Recipient {
  studentId: number;
  name: string;
  admissionNumber: string;
  parentPhone: string;
  token: string;
  link: string;
  lastSent: { channel: string; status: string; sentAt: string | null } | null;
}

interface ResultsData {
  exam: { id: number; name: string; class: string; section: string; publishedAt: string | null };
  recipients: Recipient[];
  sentCount: number;
  testMode: boolean;
  testNumber: string | null;
}

interface SendOutcome {
  ok: boolean;
  channel: "sms" | null;
  status: "sent" | "failed" | "skipped";
  to: string | null;
  error?: string;
}

// Per-student UI state for the send action.
type SendState =
  | { state: "sending" }
  | { state: "sent"; channel: string | null }
  | { state: "failed"; error?: string };

export default function SendResultsPage() {
  const params = useParams<{ examId: string }>();
  const examId = params?.examId;

  const [data, setData]       = useState<ResultsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [search, setSearch]   = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [statusMap, setStatusMap] = useState<Record<number, SendState>>({});
  const [sendingAll, setSendingAll] = useState(false);
  const [allSummary, setAllSummary] = useState<string>("");

  const fetchResults = useCallback(async () => {
    if (!examId) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/exams/${examId}/results`);
      const json = await res.json();
      if (!res.ok) { setError(json.error ?? "Failed to load recipients."); return; }
      const payload = json as ResultsData;
      setData(payload);
      // Seed status from prior dispatch history (server is source of truth, so
      // the page resumes correctly after a reload — sent stay sent, failures show).
      const initial: Record<number, SendState> = {};
      for (const r of payload.recipients) {
        const s = r.lastSent?.status;
        if (s === "sent" || s === "delivered") {
          initial[r.studentId] = { state: "sent", channel: r.lastSent!.channel };
        } else if (s === "failed") {
          initial[r.studentId] = { state: "failed", error: "Previous attempt failed — resend to retry." };
        }
      }
      setStatusMap(initial);
    } catch {
      setError("Network error. Please retry.");
    } finally {
      setLoading(false);
    }
  }, [examId]);

  useEffect(() => { fetchResults(); }, [fetchResults]);

  // Server-side SMS send for one student.
  const sendOne = useCallback(async (studentId: number): Promise<SendOutcome | null> => {
    setStatusMap((p) => ({ ...p, [studentId]: { state: "sending" } }));
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examId: Number(examId), studentId }),
      });
      const outcome = (await res.json()) as SendOutcome & { error?: string };
      if (outcome.ok) {
        setStatusMap((p) => ({ ...p, [studentId]: { state: "sent", channel: outcome.channel } }));
      } else {
        setStatusMap((p) => ({ ...p, [studentId]: { state: "failed", error: outcome.error ?? "Send failed." } }));
      }
      return outcome;
    } catch {
      setStatusMap((p) => ({ ...p, [studentId]: { state: "failed", error: "Network error." } }));
      return null;
    }
  }, [examId]);

  // Bulk send runs as a client-driven loop over a batched, idempotent endpoint:
  // each call sends the next batch and reports how many remain, so 600 parents
  // never hit a single-request timeout, already-sent parents are skipped, and a
  // re-click retries only the failures. Resumable — server is the source of truth.
  type BatchResult = { studentId: number; ok: boolean; channel: string | null; status: string; error?: string };

  async function sendAll() {
    if (!examId) return;
    setSendingAll(true);
    setAllSummary("");
    // Mark not-yet-sent recipients as sending for immediate feedback.
    setStatusMap((p) => {
      const next = { ...p };
      data?.recipients.forEach((r) => {
        if (next[r.studentId]?.state !== "sent") next[r.studentId] = { state: "sending" };
      });
      return next;
    });

    let totalSent = 0, totalFailed = 0, totalSkipped = 0, guard = 0;
    try {
      for (;;) {
        if (++guard > 2000) break; // safety valve
        const res = await fetch(`/api/admin/exams/${examId}/results/send-all`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode: "pending" }),
        });
        const json = await res.json();
        if (!res.ok) { setAllSummary(json.error ?? "Bulk send failed."); break; }

        setStatusMap((p) => {
          const next = { ...p };
          for (const r of json.results as BatchResult[]) {
            next[r.studentId] = r.ok
              ? { state: "sent", channel: r.channel }
              : { state: "failed", error: r.error ?? (r.status === "skipped" ? "Skipped." : "Send failed.") };
          }
          return next;
        });

        totalSent += json.sent; totalFailed += json.failed; totalSkipped += json.skipped;
        setAllSummary(`Sending… ${totalSent} sent${totalFailed ? `, ${totalFailed} failed` : ""}${totalSkipped ? `, ${totalSkipped} skipped` : ""} · ${json.remaining} remaining`);

        // Stop when nothing remains or a batch made no progress (e.g. all in-flight).
        if (json.remaining === 0 || json.processed === 0) break;
      }
      setAllSummary(`Done. ${totalSent} sent${totalFailed ? ` · ${totalFailed} failed` : ""}${totalSkipped ? ` · ${totalSkipped} skipped` : ""}.`);
    } catch {
      setAllSummary("Network error during bulk send. Click “Send to all” again to resume.");
    } finally {
      setSendingAll(false);
    }
  }

  async function copyLink(r: Recipient) {
    try {
      await navigator.clipboard.writeText(r.link);
      setCopiedId(r.studentId);
      setTimeout(() => setCopiedId((c) => (c === r.studentId ? null : c)), 1500);
    } catch { /* clipboard unavailable */ }
  }

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    if (!q) return data.recipients;
    return data.recipients.filter(
      (r) => r.name.toLowerCase().includes(q) || r.admissionNumber.toLowerCase().includes(q)
    );
  }, [data, search]);

  const sentTotal = useMemo(
    () => Object.values(statusMap).filter((s) => s.state === "sent").length,
    [statusMap]
  );

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/admin/marks" className="flex items-center gap-2 text-[13px] font-medium text-slate-500 hover:text-[#060C8B] transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
            Back to Dashboard
          </Link>
          <p className="text-[13px] font-bold text-[#060C8B]">Send Results to Parents</p>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8">
        {loading ? (
          <div className="py-20 text-center text-slate-400">Loading recipients…</div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-[14px] text-red-600">
            {error}
            <div className="mt-3">
              <Link href="/admin/marks" className="text-[13px] font-semibold text-[#060C8B] hover:underline">← Return to dashboard</Link>
            </div>
          </div>
        ) : data ? (
          <>
            {/* Test-mode banner */}
            {data.testMode && (
              <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 h-4 w-4 shrink-0" aria-hidden><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                <p className="text-[12.5px] text-amber-800">
                  <span className="font-bold">Test mode is ON.</span> Every message is delivered only to the configured test number
                  {data.testNumber ? <span className="font-semibold"> ({data.testNumber})</span> : null} — real parent numbers are ignored. Disable <code className="rounded bg-amber-100 px-1">NOTIFICATION_TEST_MODE</code> to send to actual parents.
                </p>
              </div>
            )}

            {/* Exam summary + Send all */}
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-[#1F2A66]">{data.exam.name} — Class {data.exam.class}{data.exam.section}</h1>
                <p className="mt-1 text-[13px] text-slate-500">
                  Sends the secure result link to each parent by SMS. No login needed on the parent&apos;s side.
                </p>
                {allSummary && <p className="mt-2 text-[13px] font-semibold text-[#060C8B]">{allSummary}</p>}
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-3 text-center">
                  <p className="text-2xl font-extrabold text-emerald-600">{sentTotal}<span className="text-slate-400 text-[15px]"> / {data.recipients.length}</span></p>
                  <p className="text-[11px] font-medium text-slate-600">Sent</p>
                </div>
                <button
                  onClick={sendAll}
                  disabled={sendingAll || data.recipients.length === 0}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#060C8B] px-5 py-3 text-[13px] font-bold text-white hover:bg-[#04096a] disabled:opacity-50 transition-colors"
                >
                  {sendingAll ? (
                    <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Sending…</>
                  ) : (
                    <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>Send to all</>
                  )}
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="mb-4">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by student name or admission number…"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[14px] text-slate-800 placeholder-slate-400 focus:border-[#060C8B] focus:outline-none focus:ring-1 focus:ring-[#060C8B]/30"
              />
            </div>

            {/* Recipients */}
            <div className="space-y-2.5">
              {filtered.map((r) => {
                const st = statusMap[r.studentId];
                return (
                  <div key={r.studentId} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="text-[15px] font-bold text-[#1F2A66]">{r.name}</span>
                          <StatusPill state={st} />
                        </div>
                        <p className="mt-0.5 text-[12px] text-slate-500">
                          Adm. {r.admissionNumber} · Parent: {r.parentPhone || <span className="text-red-500">no phone on file</span>}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => sendOne(r.studentId)}
                          disabled={st?.state === "sending" || sendingAll}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[#060C8B] px-3.5 py-2 text-[12px] font-bold text-white hover:bg-[#04096a] disabled:opacity-50 transition-colors"
                        >
                          {st?.state === "sending" ? (
                            <><span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />Sending…</>
                          ) : st?.state === "sent" ? (
                            <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden><polyline points="20 6 9 17 4 12" /></svg>Resend</>
                          ) : (
                            <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>Send</>
                          )}
                        </button>
                        <button
                          onClick={() => copyLink(r)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-[12px] font-semibold text-slate-500 hover:bg-slate-50 transition-colors"
                        >
                          {copiedId === r.studentId ? "Copied!" : "Copy link"}
                        </button>
                      </div>
                    </div>
                    {st?.state === "failed" && st.error && (
                      <p className="mt-2 text-[12px] text-red-600">{st.error}</p>
                    )}
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center text-[14px] text-slate-400">
                  No students match “{search}”.
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

function StatusPill({ state }: { state: SendState | undefined }) {
  if (!state) return null;
  if (state.state === "sending") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 border border-slate-200">
        <span className="h-2 w-2 animate-spin rounded-full border-2 border-slate-300 border-t-slate-500" />
        Sending
      </span>
    );
  }
  if (state.state === "sent") {
    const label = "Sent via SMS";
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-100">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-2.5 w-2.5" aria-hidden><polyline points="20 6 9 17 4 12" /></svg>
        {label}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600 border border-red-100">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-2.5 w-2.5" aria-hidden><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
      Failed
    </span>
  );
}
