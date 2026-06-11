"use client";

import { useEffect, useState } from "react";

interface AuditEntry {
  id: number;
  action: string;
  note: string | null;
  createdAt: string;
  user: { name: string; role: string };
}

interface Props {
  examId: number;
  examLabel: string;
  onClose: () => void;
}

const ACTION_CONFIG: Record<string, { label: string; icon: string; color: string; bg: string; dot: string }> = {
  submit:  { label: "Submitted",        icon: "upload",  color: "text-amber-400",  bg: "bg-amber-900/30",  dot: "bg-amber-500"  },
  approve: { label: "Approved",         icon: "check",   color: "text-[#3fb950]",  bg: "bg-[#238636]/25",  dot: "bg-[#3fb950]"  },
  reject:  { label: "Rejected",         icon: "x",       color: "text-red-400",    bg: "bg-red-900/25",    dot: "bg-red-500"    },
  upload:  { label: "File Uploaded",    icon: "file",    color: "text-sky-400",    bg: "bg-sky-900/25",    dot: "bg-sky-500"    },
};

function ActionIcon({ action }: { action: string }) {
  const cfg = ACTION_CONFIG[action] ?? ACTION_CONFIG.upload;
  return (
    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${cfg.bg}`}>
      {action === "submit" || action === "upload" ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-4 w-4 ${cfg.color}`} aria-hidden>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      ) : action === "approve" ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`h-4 w-4 ${cfg.color}`} aria-hidden>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`h-4 w-4 ${cfg.color}`} aria-hidden>
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      )}
    </div>
  );
}

export function AuditLogPanel({ examId, examLabel, onClose }: Props) {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/audit/${examId}`)
      .then((r) => r.json())
      .then((d) => setLogs(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, [examId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-2xl bg-[#161b22] border border-[#30363d] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#21262d] px-5 py-4">
          <div>
            <h3 className="text-[15px] font-bold text-white">Audit Trail</h3>
            <p className="text-[12px] text-slate-400">{examLabel}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-500 hover:text-slate-300 transition-colors" aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Timeline */}
        <div className="max-h-[420px] overflow-y-auto px-5 py-5">
          {loading ? (
            <div className="py-8 text-center text-[13px] text-slate-500">Loading history…</div>
          ) : logs.length === 0 ? (
            <div className="py-8 text-center text-[13px] text-slate-500">No audit entries found.</div>
          ) : (
            <div className="relative">
              {/* Vertical connector line */}
              <div className="absolute left-[15px] top-4 bottom-4 w-px bg-[#30363d]" />

              <div className="space-y-5">
                {logs.map((log, i) => {
                  const cfg = ACTION_CONFIG[log.action] ?? ACTION_CONFIG.upload;
                  return (
                    <div key={log.id} className="flex gap-4">
                      <div className="relative z-10 flex-shrink-0">
                        <ActionIcon action={log.action} />
                      </div>
                      <div className="min-w-0 flex-1 pb-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[13px] font-semibold ${cfg.color}`}>
                            {cfg.label}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            by {log.user.name}
                            <span className="ml-1 rounded border border-[#30363d] bg-[#21262d] px-1.5 py-0.5 text-[10px] font-medium text-slate-400 capitalize">
                              {log.user.role}
                            </span>
                          </span>
                        </div>
                        {log.note && (
                          <p className="mt-1 text-[12px] text-slate-400">{log.note}</p>
                        )}
                        <p className="mt-1 text-[11px] text-slate-600">
                          {new Date(log.createdAt).toLocaleString("en-IN", {
                            day: "2-digit", month: "short", year: "numeric",
                            hour: "2-digit", minute: "2-digit",
                          })}
                        </p>
                        {/* Connector between items */}
                        {i < logs.length - 1 && <div className="mt-3" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
