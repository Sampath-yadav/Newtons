import Image from "next/image";
import Link from "next/link";
import { Container } from "~/components/layout/Container";
import { AdmissionsSubNav } from "~/components/admissions/AdmissionsSubNav";
import { EnquiryForm } from "~/components/admissions/EnquiryForm";
import { AccreditationsBanner } from "~/components/admissions/AccreditationsBanner";

/* ── Configurable content ───────────────────────────────────────────────── */

const CONFIG = {
  heroImage: "/images/cta-banner/students.jpg",
  heroAlt: "Newton's High School students in class",
  introBody: [
    "As one of the top private schools in Hyderabad, we are dedicated to fostering the confidence and development that help each student thrive. We welcome you to visit our lively campus or connect with us online from anywhere across the state.",
    "Our Admissions team is available year-round, eager to learn how we can best support your family's educational path. Fill out this quick form and we'll get in touch to better understand your child's individual strengths and needs, and explain how we can offer them an outstanding educational experience rooted in the Telangana SSC curriculum.",
  ],
};

/* ── Page ──────────────────────────────────────────────────────────────── */

export default function EnquireNowPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative h-[280px] lg:h-[340px] overflow-hidden">
        <Image
          src={CONFIG.heroImage}
          alt={CONFIG.heroAlt}
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
            <li className="font-semibold text-brand-navy">Enquire now</li>
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
              <h1 className="text-5xl lg:text-6xl font-extrabold text-brand-ink leading-none">
                Enquire<br />now
              </h1>
            </div>
            {/* Right: descriptive text */}
            <div className="space-y-5">
              {CONFIG.introBody.map((para, i) => (
                <p key={i} className="text-[16px] leading-relaxed text-slate-700">
                  {para}
                </p>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="mb-10 h-px w-full bg-slate-100" />

          {/* Enquiry form */}
          <div className="max-w-[860px]">
            <EnquiryForm />
          </div>

        </Container>
      </section>

      {/* ── Accreditations ── */}
      <AccreditationsBanner />
    </>
  );
}
