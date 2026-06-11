"use client";

import { useEffect } from "react";
import type { Exam } from "~/hooks/useAdminExamPolling";

interface Props {
  submissions: Exam[];
  onDismiss: () => void;
}

export function NewSubmissionToast({ submissions, onDismiss }: Props) {
  // Auto-dismiss after 8 seconds
  useEffect(() => {
    if (submissions.length === 0) return;
    const timer = setTimeout(onDismiss, 8_000);
    return () => clearTimeout(timer);
  }, [submissions.length, onDismiss]);

  if (submissions.length === 0) return null;

  const latest = submissions[submissions.length - 1];

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="rounded-2xl border border-amber-800/40 bg-[#1c1a12] shadow-2xl">
        <div className="flex items-start gap-3 px-4 py-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500/20">
            <svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
              <path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-bold text-amber-400">
              New Submission
              {submissions.length > 1 && ` (+${submissions.length - 1} more)`}
            </p>
            <p className="mt-0.5 text-[12px] text-slate-400">
              {latest.uploadedBy.name} submitted {latest.name} — Class {latest.class}{latest.section}
            </p>
          </div>
          <button
            onClick={onDismiss}
            className="shrink-0 text-slate-600 hover:text-slate-400 transition-colors"
            aria-label="Dismiss"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="border-t border-amber-800/20 px-4 py-2">
          <p className="text-[11px] text-slate-600">
            The pending queue has been updated. Auto-dismisses in 8s.
          </p>
        </div>
      </div>
    </div>
  );
}
