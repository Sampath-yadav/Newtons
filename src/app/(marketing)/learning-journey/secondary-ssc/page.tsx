import type { ReactNode } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/Button";
import { Container } from "~/components/layout/Container";
import { StageNav } from "~/components/learning-journey/StageNav";
import { CurriculumTabs } from "~/components/learning-journey/CurriculumTabs";
import { SECONDARY_SCHOOL } from "~/data/learning-journey";
import type { IconKey } from "~/data/learning-journey";

export const metadata: Metadata = {
  title: "SSC School in Banswada | Classes 9 & 10 | Newton's High School Telangana",
  description:
    "Newton's High School, Banswada offers focused Telangana SSC Board preparation for Classes 9 and 10. Experienced subject teachers, structured exam framework, individual mentoring, and a disciplined campus environment in Nizamabad, Telangana.",
  keywords:
    "SSC School Banswada, Class 9 10 School Banswada, Telangana SSC Board Preparation, Best SSC School Nizamabad, Newton's High School Banswada, 10th Board Exam Preparation Telangana, SSC Results Banswada",
};

/* ── Icon lookup ────────────────────────────────────────────────────────── */

const ICONS: Record<IconKey, ReactNode> = {
  book: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  globe: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  flask: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden>
      <path d="M9 3h6M9 3v7L4 20h16L15 10V3" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  computer: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden>
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
  trophy: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden>
      <polyline points="8 21 12 17 16 21" />
      <line x1="12" y1="17" x2="12" y2="11" />
      <path d="M7 4H4a2 2 0 0 0-2 2v1a5 5 0 0 0 5 5h10a5 5 0 0 0 5-5V6a2 2 0 0 0-2-2h-3" />
      <rect x="7" y="2" width="10" height="5" rx="1" />
    </svg>
  ),
  palette: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden>
      <circle cx="13.5" cy="6.5" r=".5" />
      <circle cx="17.5" cy="10.5" r=".5" />
      <circle cx="8.5" cy="7.5" r=".5" />
      <circle cx="6.5" cy="12.5" r=".5" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </svg>
  ),
  mic: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden>
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  ),
  leaf: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  lightbulb: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden>
      <line x1="9" y1="18" x2="15" y2="18" />
      <line x1="10" y1="22" x2="14" y2="22" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
    </svg>
  ),
};

/* ── Shared small helpers ───────────────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-3 inline-block text-[11px] font-bold uppercase tracking-widest text-brand-orange">
      {children}
    </span>
  );
}

function SectionHeader({
  label,
  heading,
  body,
  center = true,
}: {
  label?: string;
  heading: string;
  body?: string;
  center?: boolean;
}) {
  return (
    <div className={`mb-12 ${center ? "max-w-2xl mx-auto text-center" : ""}`}>
      {label && <SectionLabel>{label}</SectionLabel>}
      <h2 className="text-3xl lg:text-4xl font-extrabold text-brand-ink mb-4 leading-tight">
        {heading}
      </h2>
      {body && <p className="text-[15px] text-brand-muted leading-relaxed">{body}</p>}
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────────────────── */

export default function SecondarySscPage() {
  const d = SECONDARY_SCHOOL;

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative h-[460px] lg:h-[560px] overflow-hidden">
        <Image
          src={d.heroImage}
          alt="Class 9 and 10 students at Newton's High School Banswada studying for Telangana SSC Board Examinations"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060C8B]/90 via-[#060C8B]/60 to-transparent" />
        <div className="absolute inset-0 flex items-end lg:items-center pb-12 lg:pb-0">
          <Container>
            <div className="max-w-lg">
              <span className="mb-4 inline-block rounded-full border border-brand-orange/50 bg-brand-orange/15 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-brand-orange">
                {d.agesLabel}
              </span>
              <h1 className="text-4xl lg:text-6xl font-extrabold text-white leading-tight mb-4">
                Excellence in<br />SSC Education
              </h1>
              <p className="text-sm font-semibold italic text-brand-orange/90 mb-3 leading-relaxed">
                {d.heroTagline}
              </p>
              <p className="text-base lg:text-lg text-white/80 mb-8 leading-relaxed">
                {d.heroDescription}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button href="/admissions/enquire-now" size="lg">Enquire Now</Button>
                <Button href="/admissions/how-to-apply" size="lg" variant="outline-light">Schedule a Campus Visit</Button>
              </div>
            </div>
          </Container>
        </div>
      </section>

      {/* ── Stage navigation ── */}
      <StageNav />

      {/* ── Breadcrumb ── */}
      <nav className="bg-white border-b border-slate-100 py-3">
        <Container>
          <ol className="flex items-center gap-1.5 text-sm text-brand-muted">
            <li><Link href="/" className="transition hover:text-brand-navy">Home</Link></li>
            <li className="text-slate-300">/</li>
            <li><Link href="/learning-journey" className="transition hover:text-brand-navy">Learning Journey</Link></li>
            <li className="text-slate-300">/</li>
            <li className="font-medium text-brand-navy">Secondary School (SSC)</li>
          </ol>
        </Container>
      </nav>

      {/* ── Why Choose Newton's SSC (4 features) ── */}
      <section className="py-16 lg:py-24 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-14">
            <SectionLabel>Why Families in Banswada Choose Newton&apos;s for SSC</SectionLabel>
            <h2 className="text-3xl lg:text-[42px] font-extrabold text-brand-ink leading-tight mb-5">
              {d.introHeading}
            </h2>
            <p className="text-[16px] text-brand-muted leading-relaxed">{d.introBody}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {d.features.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl bg-white border border-slate-100 shadow-card p-7 hover:shadow-card-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-colors duration-200">
                  {ICONS[f.iconKey]}
                </div>
                <h3 className="text-base font-bold text-brand-ink mb-2">{f.title}</h3>
                <p className="text-sm text-brand-muted leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Honest Achievement Statement (4 stat cards) ── */}
      <section className="py-16 lg:py-24" style={{ background: "#ECEAFB" }}>
        <Container>
          <SectionHeader
            label="Our Students&apos; Success"
            heading={d.statsHeading}
            body={d.statsBody}
          />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {d.stats.map((stat, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white p-7 text-center shadow-card hover:shadow-card-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="text-3xl lg:text-4xl font-extrabold text-brand-orange mb-3 leading-none">
                  {stat.value}
                </div>
                <div className="mb-3 mx-auto h-px w-10 bg-slate-200" />
                <p className="text-[13px] text-brand-muted leading-snug">{stat.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── SSC Curriculum (6 tabs) ── */}
      <section className="py-16 lg:py-24 bg-white">
        <Container>
          <SectionHeader
            label="Telangana SSC Curriculum"
            heading={d.curriculumHeading}
            body={d.curriculumBody}
          />
          <CurriculumTabs tabs={d.curriculumTabs} />
        </Container>
      </section>

      {/* ── Board Exam Preparation Framework (6 numbered steps) ── */}
      <section className="py-16 lg:py-24" style={{ background: "#f7f8fd" }}>
        <Container>
          <SectionHeader
            label="SSC Board Exam Preparation"
            heading={d.examHeading}
            body={d.examBody}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {d.examFramework.map((item) => (
              <div
                key={item.step}
                className="group relative rounded-2xl bg-white border border-slate-100 shadow-card p-7 hover:shadow-card-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <span
                  className="pointer-events-none absolute -top-3 -right-2 text-[72px] font-extrabold leading-none select-none"
                  style={{ color: "rgba(243,146,0,0.08)" }}
                  aria-hidden
                >
                  {item.step}
                </span>
                <span className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-orange text-white text-[13px] font-extrabold leading-none">
                  {item.step}
                </span>
                <h3 className="text-base font-bold text-brand-ink mb-2">{item.title}</h3>
                <p className="text-sm text-brand-muted leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Typical Day ── */}
      <section className="py-16 lg:py-24 bg-white">
        <Container>
          <SectionHeader
            label="Daily Schedule"
            heading={d.typicalDayHeading}
            body={d.typicalDayBody}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {d.typicalDay.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-100 p-6 shadow-card hover:shadow-card-lg hover:-translate-y-1 transition-all duration-300"
                style={{ background: item.color }}
              >
                <span
                  className="mb-4 inline-block rounded-full px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white"
                  style={{ background: item.accent }}
                >
                  {item.time}
                </span>
                <h3 className="text-base font-bold text-brand-ink mb-2">{item.title}</h3>
                <p className="text-sm text-brand-muted leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Academic Support System ── */}
      <section className="py-16 lg:py-24" style={{ background: "#f7f8fd" }}>
        <Container>
          <SectionHeader
            label="Student Academic Support"
            heading={d.supportHeading}
            body={d.supportBody}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {d.supportItems.map((item) => (
              <div
                key={item.title}
                className="group flex items-start gap-4 rounded-2xl bg-white border border-slate-100 shadow-card p-6 hover:shadow-card-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-navy/8 text-brand-navy group-hover:bg-brand-navy group-hover:text-white transition-colors duration-200">
                  {ICONS[item.iconKey]}
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-brand-ink mb-1.5">{item.title}</h3>
                  <p className="text-[13px] text-brand-muted leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Science & Practical Learning (6 image tiles) ── */}
      <section className="py-16 lg:py-24 bg-white">
        <Container>
          <SectionHeader
            label="Hands-On Science at Newton&apos;s"
            heading={d.scienceHeading}
            body={d.scienceBody}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {d.scienceItems.map((item) => (
              <div
                key={item.label}
                className="group relative h-[200px] rounded-2xl overflow-hidden shadow-card hover:shadow-card-lg"
              >
                <Image
                  src={item.image}
                  alt={item.label}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-[15px] font-bold text-white leading-snug">{item.label}</h3>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Newton's Real Activities (4 cards) ── */}
      <section className="py-16 lg:py-24" style={{ background: "#f7f8fd" }}>
        <Container>
          <div className="max-w-2xl mx-auto text-center mb-12">
            <SectionLabel>Life at Newton&apos;s Secondary School</SectionLabel>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-brand-ink mb-4">
              {d.schoolActivitiesHeading}
            </h2>
            <p className="text-[15px] text-brand-muted leading-relaxed">{d.schoolActivitiesBody}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {d.schoolActivities.map((item) => (
              <div
                key={item.title}
                className="group rounded-2xl border border-slate-100 bg-white shadow-card p-7 hover:shadow-card-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="mb-4 text-3xl">{item.icon}</div>
                <h3 className="text-base font-bold text-brand-ink mb-3">{item.title}</h3>
                <p className="text-sm text-brand-muted leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Leadership & Life Skills ── */}
      <section className="py-16 lg:py-24 bg-white">
        <Container>
          <SectionHeader
            label="Beyond Academics"
            heading={d.leadershipHeading}
            body={d.leadershipBody}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {d.leadershipItems.map((item) => (
              <div
                key={item.title}
                className="group flex items-start gap-4 rounded-2xl bg-white border border-slate-100 shadow-card p-6 hover:shadow-card-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-colors duration-200">
                  {ICONS[item.iconKey]}
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-brand-ink mb-1.5">{item.title}</h3>
                  <p className="text-[13px] text-brand-muted leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Career Guidance (4 cards) ── */}
      <section className="py-16 lg:py-24" style={{ background: "#f7f8fd" }}>
        <Container>
          <SectionHeader
            label="Planning Beyond SSC"
            heading={d.careerHeading}
            body={d.careerBody}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
            {d.careerItems.map((item) => (
              <div
                key={item.title}
                className="group rounded-2xl border border-slate-100 bg-white shadow-card p-7 hover:shadow-card-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#16a34a]/10 text-[#16a34a] group-hover:bg-[#16a34a] group-hover:text-white transition-colors duration-200">
                  {ICONS[item.iconKey]}
                </div>
                <h3 className="text-[15px] font-bold text-brand-ink mb-2">{item.title}</h3>
                <p className="text-[13px] text-brand-muted leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Facilities (6 icon cards) ── */}
      <section className="py-16 lg:py-24 bg-white">
        <Container>
          <SectionHeader
            label="Campus Infrastructure"
            heading={d.facilitiesHeading}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {d.facilities.map((item) => (
              <div
                key={item.title}
                className="group rounded-2xl bg-white border border-slate-100 shadow-card p-7 hover:shadow-card-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-navy/6 text-brand-navy group-hover:bg-brand-navy group-hover:text-white transition-colors duration-200">
                  {ICONS[item.iconKey]}
                </div>
                <h3 className="text-base font-bold text-brand-ink mb-2">{item.title}</h3>
                <p className="text-sm text-brand-muted leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Parent Partnership (6 items) ── */}
      <section className="py-16 lg:py-24" style={{ background: "#f7f8fd" }}>
        <Container>
          <SectionHeader
            label="Parents and Newton&apos;s — Full Partnership"
            heading={d.parentHeading}
            body={d.parentBody}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {d.parentItems.map((item) => (
              <div
                key={item.title}
                className="group flex items-start gap-4 rounded-2xl border border-slate-100 bg-white shadow-card p-6 hover:shadow-card-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-[#7c3aed]/10 text-[#7c3aed] group-hover:bg-[#7c3aed] group-hover:text-white transition-colors duration-200">
                  {ICONS[item.iconKey]}
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-brand-ink mb-1.5">{item.title}</h3>
                  <p className="text-[13px] text-brand-muted leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Beyond SSC — full-width impact section ── */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <Image
          src="/images/sections/learning-journey/secondary-ssc/school_poster.png"
          alt="Newton's High School Banswada Secondary School graduates ready for Intermediate education and future careers"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-brand-navy/88" />
        <Container className="relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-5 inline-block rounded-full border border-brand-orange/50 bg-brand-orange/15 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-brand-orange">
              Life After Newton&apos;s
            </span>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-7">
              {d.beyondHeading}
            </h2>
            <div className="mx-auto mb-8 h-px w-16 rounded-full bg-brand-orange" />
            <p className="text-lg lg:text-xl text-white/80 leading-relaxed mb-8">
              {d.beyondBody}
            </p>
            <p className="text-[15px] text-brand-orange/90 italic leading-relaxed">
              &ldquo;At Newton&apos;s High School, we prepare students not just for the SSC Board Examination — but for a future that demands both knowledge and character. We are proud of every student who has carried Newton&apos;s values forward into their life beyond school.&rdquo;
            </p>
            <p className="mt-3 text-[13px] font-bold uppercase tracking-widest text-white/50">
              — Newton&apos;s High School, Banswada
            </p>
          </div>
        </Container>
      </section>

      {/* ── Admissions CTA ── */}
      <section className="py-16 lg:py-20 bg-white">
        <Container>
          <div className="max-w-xl mx-auto text-center">
            <span className="mb-3 inline-block text-[11px] font-bold uppercase tracking-widest text-brand-orange">
              SSC Admissions — Banswada
            </span>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-brand-ink mb-5 leading-tight">
              {d.enrollHeading}
            </h2>
            <p className="text-[15px] text-brand-muted leading-relaxed mb-8">{d.enrollBody}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
              <Button href="/admissions/enquire-now" size="lg">
                Apply for SSC Admission
              </Button>
              <Button href="/admissions/how-to-apply" size="lg" variant="outline-navy">
                Schedule a Campus Visit
              </Button>
            </div>
            <p className="text-[13px] text-brand-muted">
              Call us on{" "}
              <a href="tel:+919866089343" className="font-semibold text-brand-navy hover:text-brand-orange transition-colors">
                098660 89343
              </a>{" "}
              · Bodhan Road, Banswada, Nizamabad – 503187, Telangana
            </p>
          </div>
        </Container>
      </section>

      {/* ── Continue the Journey (related stage cards) ── */}
      <section className="py-16 lg:py-20" style={{ background: "#f7f8fd" }}>
        <Container>
          <div className="mb-10 text-center">
            <span className="mb-3 inline-block text-[11px] font-bold uppercase tracking-widest text-brand-orange">
              Explore the Full Learning Journey
            </span>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-brand-ink">
              Every Stage at Newton&apos;s High School, Banswada
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {d.relatedCards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group relative h-[260px] rounded-2xl overflow-hidden shadow-card hover:shadow-card-lg transition-all duration-300 hover:-translate-y-1"
              >
                <Image
                  src={card.image}
                  alt={card.label}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-white/70 mb-1">{card.ages}</p>
                  <h3 className="text-base font-extrabold text-white leading-tight">{card.label}</h3>
                </div>
                <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
                    <polyline points="9 6 15 12 9 18" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
