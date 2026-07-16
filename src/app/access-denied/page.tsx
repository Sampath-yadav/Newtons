"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Container } from "~/components/layout/Container";

function AccessDenied() {
  const reason = useSearchParams().get("reason");
  const disabled = reason === "disabled";

  return (
    <section className="bg-[#f8fafc] py-16 lg:py-24">
      <Container>
        <div className="mx-auto max-w-md text-center">
          <Image
            src="/images/school_logo/Newtons_logo.png"
            alt="Newton's High School"
            width={140}
            height={48}
            className="mx-auto mb-6"
          />

          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7" aria-hidden>
              <circle cx="12" cy="12" r="10" /><line x1="4.9" y1="4.9" x2="19.1" y2="19.1" />
            </svg>
          </div>

          <h1 className="text-2xl font-extrabold text-[#1F2A66]">Access denied</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-500">
            {disabled
              ? "Your account has been disabled. Please contact the School Administration to restore access."
              : "You are not authorised to access this portal. If you believe this is a mistake, please contact the School Administration."}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/teacher"
              className="rounded-xl bg-[#060C8B] px-5 py-3 text-[14px] font-bold text-white transition-colors hover:bg-[#04096a]"
            >
              Teacher Login
            </Link>
            <Link
              href="/admin"
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-[14px] font-bold text-slate-600 transition-colors hover:bg-slate-50"
            >
              Admin Login
            </Link>
          </div>

          <p className="mt-8 text-[12px] text-slate-400">
            Newton&apos;s High School · Bodhan Road, Banswada
          </p>
        </div>
      </Container>
    </section>
  );
}

export default function AccessDeniedPage() {
  return (
    <Suspense fallback={null}>
      <AccessDenied />
    </Suspense>
  );
}
