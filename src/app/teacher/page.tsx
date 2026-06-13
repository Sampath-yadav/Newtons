"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function TeacherLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
      return;
    }

    // Route by role: admins land on the Admin Dashboard, teachers on Upload.
    const session = await getSession();
    const role = (session?.user as { role?: string } | undefined)?.role;
    router.push(role === "admin" ? "/admin/marks" : "/teacher/upload");
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#f8fafc] px-4 py-12">
      <div className="mx-auto w-full max-w-md">
        {/* Heading */}
        <div className="mb-8 text-center">
          <Image
            src="/images/school_logo/Newtons_logo.png"
            alt="Newton's High School"
            width={120}
            height={40}
            className="mx-auto mb-4"
          />
          <span className="inline-block rounded-full bg-[#EEF0FB] px-3 py-0.5 text-[11px] font-bold uppercase tracking-widest text-brand-navy">
            Teacher Portal
          </span>
          <h1 className="mt-3 text-2xl font-extrabold text-[#1F2A66]">Sign in to continue</h1>
          <p className="mt-1.5 text-[14px] text-slate-500">
            Newton&apos;s High School — Marks System
          </p>
        </div>

        {/* Card */}
        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <div>
            <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wider text-slate-500">
              Email Address
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@newtons.edu.in"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy/30 transition-colors"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wider text-slate-500">
              Password
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy/30 transition-colors"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-navy px-4 py-3.5 text-[14px] font-bold text-white transition-colors hover:bg-[#04096a] disabled:opacity-50"
          >
            {loading ? (
              <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Signing in…</>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-[12px] text-slate-500">
          For access issues, contact your school administrator.
        </p>
      </div>
    </section>
  );
}
