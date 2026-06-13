"use client";

import { useState } from "react";
import { signIn, getSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Container } from "~/components/layout/Container";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result || !result.ok || result.error) {
        setError("Invalid email or password. Please try again.");
        return;
      }

      // Confirm the session persisted (catches a misconfigured NEXTAUTH_URL /
      // NEXTAUTH_SECRET in the deployment, which silently drops the cookie).
      const session = await getSession();
      if (!session) {
        console.error("[admin-login] sign-in succeeded but no session was created — check NEXTAUTH_URL/NEXTAUTH_SECRET in the deployment environment.");
        setError("Signed in, but the session could not be created. Please contact the administrator.");
        return;
      }

      // This entry point is admins-only. A valid teacher account is signed back
      // out so it cannot reach the admin dashboard through this door.
      const role = (session.user as { role?: string } | undefined)?.role;
      if (role !== "admin") {
        await signOut({ redirect: false });
        setError("This login is for administrators only. Please use the Teacher Portal.");
        return;
      }

      router.push("/admin/marks");
    } catch (err) {
      console.error("[admin-login] authentication flow failed:", err);
      setError("Couldn't sign you in right now. Please try again in a moment.");
    } finally {
      // Always clear loading so the button never sticks on "Signing in…".
      setLoading(false);
    }
  }

  return (
    <section className="bg-[#f8fafc] py-12 lg:py-20">
      <Container>
        <div className="mx-auto max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Image
            src="/images/school_logo/Newtons_logo.png"
            alt="Newton's High School"
            width={140}
            height={48}
            className="mx-auto mb-5"
          />
          <span className="inline-block rounded-full bg-[#060C8B]/10 px-3 py-0.5 text-[11px] font-bold uppercase tracking-widest text-[#060C8B]">
            Administrator
          </span>
          <h1 className="mt-3 text-[22px] font-extrabold text-[#1F2A66]">Admin Portal</h1>
          <p className="mt-1 text-[13px] text-slate-500">
            Marks Approval &amp; Result Publishing
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="admin@newtons.edu.in"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-[#060C8B] focus:outline-none focus:ring-1 focus:ring-[#060C8B]/40 transition-colors"
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
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-[#060C8B] focus:outline-none focus:ring-1 focus:ring-[#060C8B]/40 transition-colors"
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
            className="mt-2 w-full rounded-xl bg-[#060C8B] px-4 py-3.5 text-[14px] font-bold text-white transition-colors hover:bg-[#04096a] disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign In as Administrator"}
          </button>
        </form>

        <p className="mt-8 text-center text-[12px] text-slate-400">
          Not an administrator?{" "}
          <a href="/teacher" className="font-semibold text-[#060C8B] hover:underline">
            Go to Teacher Portal
          </a>
        </p>
        </div>
      </Container>
    </section>
  );
}
