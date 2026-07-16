import type { ReactNode } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/Button";
import { Container } from "~/components/layout/Container";
import { StageNav } from "~/components/learning-journey/StageNav";
import { CurriculumTabs } from "~/components/learning-journey/CurriculumTabs";
import { UPPER_PRIMARY_SCHOOL } from "~/data/learning-journey";
import type { IconKey } from "~/data/learning-journey";

export const metadata: Metadata = {
  title: "Upper Primary School Banswada | Classes 6–8 | Newton's High School Telangana",
  description:
    "Newton's High School, Banswada offers a strong Upper Primary programme for Classes 6 to 8. Concept-based SSC learning, leadership development, trilingual communication, and co-curricular activities in a disciplined, caring campus in Nizamabad, Telangana.",
  keywords:
    "Upper Primary School Banswada, Classes 6 7 8 School Banswada, Middle School SSC Telangana, Newton's High School Banswada, Best School Nizamabad Classes 6 to 8, SSC Preparation Banswada",
};

/* ── Icon lookup (all 12 keys) ──────────────────────────────────────────── */

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

/* ── Page ──────────────────────────────────────────────────────────────── */

export default function UpperPrimaryPage() {
  const d = UPPER_PRIMARY_SCHOOL;

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative h-[460px] lg:h-[560px] overflow-hidden">
        <Image
          src={d.heroImage}
          alt="Upper Primary students at Newton's High School Banswada engaged in a concept-based learning discussion — Classes 6 to 8"
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
              <h1 className="text-3xl lg:text-5xl font-extrabold text-white leading-tight mb-4">
                {d.heroTagline}
              </h1>
              <p className="text-base lg:text-lg text-white/80 mb-8 leading-relaxed">
                {d.heroDescription}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button href="/admissions/enquire-now" size="lg">Enquire Now</Button>
                <Button href="/admissions/how-to-apply" size="lg" variant="outline-light">Book a Campus Visit</Button>
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
            <li className="font-medium text-brand-navy">Upper Primary School</li>
          </ol>
        </Container>
      </nav>

      {/* ── Key Highlights (4 features) ── */}
      <section className="py-16 lg:py-24 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-14">
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

      {/* ── Academic Growth Stats (4 stats, 2×2 → 4-col) ── */}
      <section className="py-16 lg:py-24" style={{ background: "#ECEAFB" }}>
        <Container>
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-brand-ink mb-4">
              {d.statsHeading}
            </h2>
            <p className="text-[15px] text-brand-muted leading-relaxed">{d.statsBody}</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {d.stats.map((stat, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white p-7 text-center shadow-card hover:shadow-card-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="text-4xl lg:text-5xl font-extrabold text-brand-orange mb-3 leading-none">
                  {stat.value}
                </div>
                <p className="text-[13px] text-brand-muted leading-relaxed">{stat.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Our Curriculum ── */}
      <section className="py-16 lg:py-24 bg-white">
        <Container>
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-brand-ink mb-4">
              {d.curriculumHeading}
            </h2>
            <p className="text-[15px] text-brand-muted leading-relaxed">{d.curriculumBody}</p>
          </div>
          <CurriculumTabs tabs={d.curriculumTabs} />
        </Container>
      </section>

      {/* ── Beyond the Classroom (6 activity tiles) ── */}
      <section className="py-16 lg:py-24" style={{ background: "#f7f8fd" }}>
        <Container>
          <div className="max-w-2xl mx-auto text-center mb-12">
            <span className="mb-3 inline-block text-[11px] font-bold uppercase tracking-widest text-brand-orange">
              Practical Learning at Newton&apos;s
            </span>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-brand-ink mb-4">
              {d.activitiesHeading}
            </h2>
            <p className="text-[15px] text-brand-muted leading-relaxed">{d.activitiesBody}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {d.activities.map((activity) => (
              <div
                key={activity.label}
                className="group relative h-[200px] rounded-2xl overflow-hidden shadow-card hover:shadow-card-lg"
              >
                <Image
                  src={activity.image}
                  alt={activity.label}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-[15px] font-bold text-white leading-snug">{activity.label}</h3>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Newton's Real Activities (Section 7) ── */}
      <section className="py-16 lg:py-24 bg-white">
        <Container>
          <div className="max-w-2xl mx-auto text-center mb-12">
            <span className="mb-3 inline-block text-[11px] font-bold uppercase tracking-widest text-brand-orange">
              Newton&apos;s School Life — What Makes Us Different
            </span>
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

      {/* ── A Typical Day ── */}
      <section className="py-16 lg:py-24 bg-white">
        <Container>
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-brand-ink mb-4">
              {d.typicalDayHeading}
            </h2>
            <p className="text-[15px] text-brand-muted leading-relaxed">{d.typicalDayBody}</p>
          </div>

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

      {/* ── Core Learning Pillars ── */}
      <section className="py-16 lg:py-24" style={{ background: "#f7f8fd" }}>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Left: heading + points */}
            <div className="lg:sticky lg:top-[140px]">
              <span className="mb-3 inline-block text-[11px] font-bold uppercase tracking-widest text-brand-orange">
                Learning Philosophy
              </span>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-brand-ink mb-5 leading-tight">
                {d.pillarsHeading}
              </h2>
              <p className="text-[15px] text-brand-muted leading-relaxed mb-8">{d.pillarsBody}</p>
              <ul className="space-y-4">
                {d.pillarsPoints.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-[14.5px] text-brand-ink">
                    <span className="mt-[6px] h-2 w-2 shrink-0 rounded-full bg-brand-orange" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: 6 pillar cards in 3×2 grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {d.pillarCards.map((card) => (
                <div
                  key={card.title}
                  className="group rounded-2xl bg-white border border-slate-100 shadow-card p-5 hover:shadow-card-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-colors duration-200">
                    {ICONS[card.iconKey]}
                  </div>
                  <h3 className="text-[13px] font-bold text-brand-ink mb-1.5 leading-snug">{card.title}</h3>
                  <p className="text-[12px] text-brand-muted leading-relaxed">{card.body}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Clubs & Student Development ── */}
      <section className="py-16 lg:py-24 bg-white">
        <Container>
          <div className="max-w-2xl mx-auto text-center mb-12">
            <span className="mb-3 inline-block text-[11px] font-bold uppercase tracking-widest text-brand-orange">
              Student Development
            </span>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-brand-ink mb-4">
              Clubs & Co-Curricular Activities
            </h2>
            <p className="text-[15px] text-brand-muted leading-relaxed">
              Our clubs give students the space to discover passions, develop leadership, and grow beyond the academic curriculum.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {d.clubs.map((club) => (
              <div
                key={club.title}
                className="group flex items-start gap-4 rounded-2xl border border-slate-100 bg-white shadow-card p-6 hover:shadow-card-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-navy/8 text-brand-navy group-hover:bg-brand-navy group-hover:text-white transition-colors duration-200">
                  {ICONS[club.iconKey]}
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-brand-ink mb-1.5">{club.title}</h3>
                  <p className="text-[13px] text-brand-muted leading-relaxed">{club.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Student Life Gallery ── */}
      <section className="py-16 lg:py-24" style={{ background: "#f7f8fd" }}>
        <Container>
          <div className="max-w-2xl mx-auto text-center mb-12">
            <span className="mb-3 inline-block text-[11px] font-bold uppercase tracking-widest text-brand-orange">
              Campus Life
            </span>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-brand-ink">
              {d.galleryHeading}
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {d.galleryItems.map((item, i) => (
              <div
                key={item.label}
                className={`group relative rounded-2xl overflow-hidden shadow-card hover:shadow-card-lg transition-all duration-300 ${
                  i === 0 ? "col-span-2 lg:col-span-1 h-[220px] lg:h-[260px]" : "h-[180px] lg:h-[200px]"
                }`}
              >
                <Image
                  src={item.image}
                  alt={item.label}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <span className="absolute bottom-3 left-4 text-sm font-semibold text-white drop-shadow">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Preparing for Secondary School (SSC) — navy callout ── */}
      <section className="bg-brand-navy py-16 lg:py-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: text */}
            <div>
              <span className="mb-4 inline-block rounded-full border border-brand-orange/50 bg-brand-orange/15 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-brand-orange">
                Grades 9–10 Readiness
              </span>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-5">
                {d.sscPrepHeading}
              </h2>
              <p className="text-[15px] text-white/70 leading-relaxed mb-8">
                {d.sscPrepBody}
              </p>
              <ul className="space-y-4 mb-10">
                {d.sscPrepPoints.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-[14.5px] text-white/85">
                    <span className="mt-[6px] h-2 w-2 shrink-0 rounded-full bg-brand-orange" />
                    {point}
                  </li>
                ))}
              </ul>
              <Button href="/learning-journey/secondary-ssc" size="lg">
                Explore Secondary School
              </Button>
            </div>

            {/* Right: image */}
            <div className="relative h-[360px] lg:h-[460px] rounded-2xl overflow-hidden shadow-card-lg">
              <Image
                src={d.sscPrepImage}
                alt="Newton's Secondary School students"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060C8B]/30 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <p className="text-xs font-bold uppercase tracking-widest text-white/70 mb-1">
                  Next Step
                </p>
                <p className="text-lg font-extrabold text-white leading-snug">
                  Secondary School (Grades 9–10 SSC)
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Parent Partnership ── */}
      <section className="py-16 lg:py-24 bg-white">
        <Container>
          <div className="max-w-2xl mx-auto text-center mb-12">
            <span className="mb-3 inline-block text-[11px] font-bold uppercase tracking-widest text-brand-orange">
              Parent Engagement
            </span>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-brand-ink mb-4">
              {d.parentHeading}
            </h2>
            <p className="text-[15px] text-brand-muted leading-relaxed">{d.parentBody}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {d.parentCards.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-slate-100 bg-white shadow-card p-7 hover:shadow-card-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="mb-4 h-1 w-10 rounded-full bg-brand-orange" />
                <h3 className="text-base font-bold text-brand-ink mb-2">{card.title}</h3>
                <p className="text-sm text-brand-muted leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Admissions CTA ── */}
      <section className="py-16 lg:py-20 bg-white">
        <Container>
          <div className="max-w-xl mx-auto text-center">
            <span className="mb-3 inline-block text-[11px] font-bold uppercase tracking-widest text-brand-orange">
              Upper Primary Admissions — Banswada
            </span>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-brand-ink mb-5 leading-tight">
              {d.enrollHeading}
            </h2>
            <p className="text-[15px] text-brand-muted leading-relaxed mb-8">{d.enrollBody}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
              <Button href="/admissions/enquire-now" size="lg">
                Apply for Upper Primary Admission
              </Button>
              <Button href="/admissions/how-to-apply" size="lg" variant="outline-navy">
                Book a Campus Visit
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
              Continue the Learning Journey
            </span>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-brand-ink">
              Explore Every Stage at Newton&apos;s High School, Banswada
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
