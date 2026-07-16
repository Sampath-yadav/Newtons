"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Container } from "~/components/layout/Container";

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
      <path fill="#EA4335" d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.48 14.97.5 12 .5A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 4.75 12 4.75z" />
    </svg>
  );
}

function AdminLogin() {
  const params = useSearchParams();
  const error = params.get("error");
  const [loading, setLoading] = useState(false);

  return (
    <section className="bg-[#f8fafc] py-12 lg:py-20">
      <Container>
        <div className="mx-auto max-w-md">
          {/* Branding */}
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

          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600">
                <p className="font-semibold">Access denied</p>
                <p className="mt-0.5 text-red-500/90">
                  This Google account isn&apos;t authorised for the Admin Portal. Sign in with
                  an approved administrator account, or contact the school office.
                </p>
              </div>
            )}

            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setLoading(true);
                void signIn("google", { callbackUrl: "/admin/marks" });
              }}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-[14px] font-bold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
                  Redirecting to Google…
                </>
              ) : (
                <>
                  <GoogleMark />
                  Continue with Google
                </>
              )}
            </button>

            <p className="mt-5 text-center text-[12px] leading-relaxed text-slate-400">
              Admin access is granted by Google sign-in only. Your password, device and
              two-factor verification are handled securely by Google.
            </p>
          </div>

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

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLogin />
    </Suspense>
  );
}
