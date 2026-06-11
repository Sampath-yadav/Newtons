"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Container } from "~/components/layout/Container";

export default function ParentLoginPage() {
  const router = useRouter();
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/parent/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admissionNumber, mobile }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Login failed. Please try again.");
        setLoading(false);
        return;
      }
      router.push("/parent-portal/dashboard");
    } catch {
      setError("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  }

  return (
    <section className="bg-[#f8fafc] py-12 lg:py-20">
      <Container>
        <div className="mx-auto max-w-md">
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
              Parent Portal
            </span>
            <h1 className="mt-3 text-2xl font-extrabold text-[#1F2A66]">View your child&apos;s progress</h1>
            <p className="mt-1.5 text-[14px] text-slate-500">
              No password needed. Just your child&apos;s admission number and your registered mobile number.
            </p>
          </div>

          {/* Card */}
          <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
            <div>
              <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wider text-slate-500">
                Admission Number
              </label>
              <input
                type="text"
                required
                autoComplete="off"
                value={admissionNumber}
                onChange={(e) => setAdmissionNumber(e.target.value)}
                placeholder="e.g. NH-2024-001"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy/30 transition-colors"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wider text-slate-500">
                Registered Mobile Number
              </label>
              <input
                type="tel"
                required
                inputMode="numeric"
                autoComplete="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="e.g. 9014386804"
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
                <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Checking…</>
              ) : (
                "View Student Dashboard"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-[12px] text-slate-500">
            Just want a quick result? Tap the link sent to your mobile — or{" "}
            <Link href="/parent-portal" className="font-semibold text-brand-navy hover:underline">
              learn how results are shared
            </Link>
            .
          </p>
        </div>
      </Container>
    </section>
  );
}
