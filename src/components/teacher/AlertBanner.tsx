"use client";

import type { TeacherAlert } from "~/hooks/useTeacherAlerts";

interface Props {
  alert: TeacherAlert;
  onDismiss: (id: number) => void;
}

export function AlertBanner({ alert, onDismiss }: Props) {
  const isApproved = alert.type === "approved";

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${
        isApproved
          ? "border-emerald-200 bg-emerald-50"
          : "border-red-200 bg-red-50"
      }`}
    >
      {/* Icon */}
      <div
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
          isApproved ? "bg-emerald-100" : "bg-red-100"
        }`}
      >
        {isApproved ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden>
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden>
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className={`text-[13px] font-semibold ${isApproved ? "text-emerald-700" : "text-red-700"}`}>
          {alert.message}
        </p>
        <p className="mt-0.5 text-[11px] text-slate-400">
          {new Date(alert.createdAt).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {/* Dismiss */}
      <button
        onClick={() => onDismiss(alert.id)}
        className="shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-slate-400 hover:text-slate-600 transition-colors"
      >
        Dismiss
      </button>
    </div>
  );
}
