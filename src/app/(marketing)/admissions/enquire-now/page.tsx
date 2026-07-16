import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "~/components/layout/Container";
import { AdmissionsSubNav } from "~/components/admissions/AdmissionsSubNav";
import { EnquiryForm } from "~/components/admissions/EnquiryForm";
import { AccreditationsBanner } from "~/components/admissions/AccreditationsBanner";

/* ── SEO ─────────────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Enquire Now | Newton's High School Banswada | SSC Admissions Telangana",
  description:
    "Enquire about admissions at Newton's High School, Banswada. Fill in our simple form and our admissions team will be in touch to help your child join one of Nizamabad's most trusted SSC schools. Open year-round for Pre-Primary to Class 10.",
};

/* ── Page ──────────────────────────────────────────────────────────────── */

export default function EnquireNowPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative h-[280px] lg:h-[340px] overflow-hidden">
        <Image
          src="/images/cta-banner/students.jpg"
          alt="Parents and students enquiring about admissions at Newton's High School, Banswada — SSC school in Telangana"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-brand-navy/25" />
      </section>

      {/* ── Admissions sub-nav ── */}
      <AdmissionsSubNav />

      {/* ── Breadcrumb ── */}
      <nav className="border-b border-slate-100 bg-white py-3">
        <Container>
          <ol className="flex items-center gap-1.5 text-sm text-brand-muted">
            <li>
              <Link href="/" className="transition hover:text-brand-navy" aria-label="Home">
                <svg viewBox="0 0 20 20" fill="currentColor" className="inline h-4 w-4 -mt-0.5" aria-hidden>
                  <path d="M10.707 2.293a1 1 0 0 0-1.414 0l-7 7A1 1 0 0 0 3 11h1v6a1 1 0 0 0 1 1h4v-5h2v5h4a1 1 0 0 0 1-1v-6h1a1 1 0 0 0 .707-1.707l-7-7z" />
                </svg>
              </Link>
            </li>
            <li className="text-slate-300">›</li>
            <li>
              <Link href="/admissions" className="transition hover:text-brand-navy">
                Admissions
              </Link>
            </li>
            <li className="text-slate-300">›</li>
            <li className="font-semibold text-brand-navy">Enquire Now</li>
          </ol>
        </Container>
      </nav>

      {/* ── Main content ── */}
      <section className="bg-white py-14 lg:py-20">
        <Container>

          {/* Two-column intro */}
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[2fr_3fr] lg:gap-16 mb-14 lg:mb-20">
            {/* Left: heading */}
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-widest text-brand-orange">
                Admissions · Newton&apos;s High School, Banswada
              </p>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-brand-ink leading-none">
                Enquire<br />Now
              </h1>
            </div>
            {/* Right: descriptive text */}
            <div className="space-y-5">
              <p className="text-[16px] leading-relaxed text-slate-700">
                Newton&apos;s High School welcomes families from Banswada and the wider
                Nizamabad district to get in touch with our admissions team — whether you
                are ready to apply, still exploring your options, or simply want to
                understand what Newton&apos;s offers before making any decision.
              </p>
              <p className="text-[16px] leading-relaxed text-slate-700">
                We admit students from Pre-Primary (Nursery) through to Class 10 (SSC) and
                our admissions team is available throughout the year. Fill in the short form
                below and we will contact you promptly to understand your child&apos;s needs
                and walk you through the full admissions process at your own pace — with no
                pressure and no obligation.
              </p>
              <p className="text-[16px] leading-relaxed text-slate-700">
                You are also warmly welcome to visit Newton&apos;s High School in person at
                Bodhan Road, Banswada — meet our teachers, see our classrooms, and experience
                what makes our school trusted by families across Banswada.
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="mb-10 h-px w-full bg-slate-100" />

          {/* Form heading */}
          <p className="mb-8 text-[15px] font-semibold text-brand-muted">
            Tell us about your child — we will take it from there.
          </p>

          {/* Form + contact sidebar */}
          <div id="form" className="grid grid-cols-1 gap-10 lg:grid-cols-[5fr_3fr] lg:gap-12">

            {/* Form */}
            <div>
              <EnquiryForm />
            </div>

            {/* Contact sidebar */}
            <aside>
              <div className="sticky top-[120px] rounded-2xl border border-slate-200 bg-slate-50 p-8">
                <h2 className="mb-7 text-[17px] font-extrabold text-brand-ink">
                  Prefer to speak with us directly?
                </h2>

                <div className="space-y-7">
                  {/* Phone */}
                  <div className="flex gap-4">
                    <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-navy/10 text-lg">
                      📞
                    </div>
                    <div>
                      <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-brand-muted">
                        Call us
                      </p>
                      <p className="text-[15px] font-bold text-brand-ink">098660 89343</p>
                      <p className="mt-0.5 text-[12px] text-brand-muted">
                        Monday to Saturday · 9:00 AM – 4:00 PM
                      </p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex gap-4">
                    <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-navy/10 text-lg">
                      📍
                    </div>
                    <div>
                      <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-brand-muted">
                        Visit us
                      </p>
                      <p className="text-[14px] font-bold text-brand-ink">
                        Newton&apos;s High School
                      </p>
                      <p className="mt-0.5 text-[13px] leading-relaxed text-brand-muted">
                        Bodhan Road, Buswatarag Nagar, Gouse Nagar,<br />
                        Banswada, Nizamabad – 503187, Telangana
                      </p>
                    </div>
                  </div>

                  {/* Campus tour */}
                  <div className="flex gap-4">
                    <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-navy/10 text-lg">
                      📅
                    </div>
                    <div>
                      <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-brand-muted">
                        Book a campus tour
                      </p>
                      <p className="mt-0.5 text-[13px] leading-relaxed text-brand-muted">
                        Visit Newton&apos;s in person — meet our teachers and see our
                        classrooms.
                      </p>
                      <a
                        href="#form"
                        className="mt-2 inline-block text-[13px] font-bold text-brand-navy transition-colors hover:text-brand-orange"
                      >
                        Book a Tour →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

          </div>

        </Container>
      </section>

      {/* ── Accreditations ── */}
      <AccreditationsBanner />
    </>
  );
}
