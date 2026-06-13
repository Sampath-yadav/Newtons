"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

// Warn the teacher/admin before their session expires so an important action
// (like a marks upload) never fails silently with a 401 and loses their work.
// Shows a fixed banner once the session is within WARN_BEFORE of expiry, with a
// "Stay signed in" button that refreshes the rolling session. Once expired, it
// asks them to sign in again.
const WARN_BEFORE_MS = 10 * 60 * 1000; // 10 minutes

export function SessionExpiryWarning() {
  const { data: session, status, update } = useSession();
  const [msLeft, setMsLeft] = useState<number | null>(null);

  useEffect(() => {
    if (status !== "authenticated" || !session?.expires) {
      setMsLeft(null);
      return;
    }
    const expiresAt = new Date(session.expires).getTime();
    const tick = () => setMsLeft(expiresAt - Date.now());
    tick();
    const id = setInterval(tick, 15_000); // re-check every 15s
    return () => clearInterval(id);
  }, [session?.expires, status]);

  // Nothing to show while signed out or comfortably within the session window.
  if (msLeft === null || msLeft > WARN_BEFORE_MS) return null;

  const expired = msLeft <= 0;
  const minutes = Math.max(1, Math.ceil(msLeft / 60_000));

  return (
    <div
      role="alert"
      className={`fixed inset-x-0 top-0 z-[100] flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4 py-2.5 text-center text-[13px] font-semibold shadow-md ${
        expired ? "bg-red-600 text-white" : "bg-amber-400 text-amber-950"
      }`}
    >
      {expired ? (
        <>
          <span>Your session has expired. Please sign in again to continue.</span>
          <a
            href="/teacher"
            className="rounded-full bg-white/95 px-4 py-1 font-bold text-red-700 transition hover:bg-white"
          >
            Sign in
          </a>
        </>
      ) : (
        <>
          <span>
            Your session will expire in {minutes} minute{minutes !== 1 ? "s" : ""}. Please save your work.
          </span>
          <button
            type="button"
            onClick={() => update()}
            className="rounded-full bg-amber-950 px-4 py-1 font-bold text-amber-50 transition hover:bg-amber-900"
          >
            Stay signed in
          </button>
        </>
      )}
    </div>
  );
}
