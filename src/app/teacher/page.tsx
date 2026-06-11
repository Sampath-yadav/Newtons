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
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-10 text-center">
          <Image
            src="/images/school_logo/Newtons_logo.png"
            alt="Newton's High School"
            width={140}
            height={48}
            className="mx-auto mb-5 brightness-0 invert"
          />
          <h1 className="text-[22px] font-extrabold text-white">Teacher Portal</h1>
          <p className="mt-1 text-[13px] text-slate-400">
            Newton&apos;s High School — Marks System
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wider text-slate-400">
              Email Address
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@newtons.edu.in"
              className="w-full rounded-xl border border-[#30363d] bg-[#161b22] px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-[#F39200] focus:outline-none focus:ring-1 focus:ring-[#F39200]/60 transition-colors"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wider text-slate-400">
              Password
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-[#30363d] bg-[#161b22] px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-[#F39200] focus:outline-none focus:ring-1 focus:ring-[#F39200]/60 transition-colors"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-800/60 bg-red-900/20 px-4 py-3 text-[13px] text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-[#F39200] px-4 py-3.5 text-[14px] font-bold text-white transition-colors hover:bg-[#E58300] disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="mt-8 text-center text-[12px] text-slate-600">
          For access issues, contact your school administrator.
        </p>
      </div>
    </div>
  );
}
