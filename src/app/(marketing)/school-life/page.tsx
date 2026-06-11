import type { ReactNode } from "react";
import Link from "next/link";
import { Button } from "~/components/ui/Button";
import { Container } from "~/components/layout/Container";
import { ImageFrame } from "~/components/ui/ImageFrame";
import { StatsCounter } from "~/components/our-school/StatsCounter";
import { AccreditationsBanner } from "~/components/admissions/AccreditationsBanner";

/* ── Icons ────────────────────────────────────────────────────────────────── */

const I = {
  palette: <><circle cx="13.5" cy="6.5" r=".5" /><circle cx="17.5" cy="10.5" r=".5" /><circle cx="8.5" cy="7.5" r=".5" /><circle cx="6.5" cy="12.5" r=".5" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" /></>,
  trophy: <><polyline points="8 21 12 17 16 21" /><line x1="12" y1="17" x2="12" y2="11" /><path d="M7 4H4a2 2 0 0 0-2 2v1a5 5 0 0 0 5 5h10a5 5 0 0 0 5-5V6a2 2 0 0 0-2-2h-3" /><rect x="7" y="2" width="10" height="5" rx="1" /></>,
  medal: <><circle cx="12" cy="15" r="6" /><path d="M9 9 7 2h10l-2 7M12 13v4M10.5 15h3" /></>,
  flag: <><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></>,
  compass: <><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></>,
  music: <><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></>,
  heart: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />,
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  inclusive: <><circle cx="9" cy="7" r="3" /><circle cx="17" cy="9" r="2.5" /><path d="M2 21v-2a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v2" /><path d="M16.5 14.5a4 4 0 0 1 3.5 4V21" /></>,
  mentor: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><polyline points="17 11 19 13 23 9" /></>,
  lifebuoy: <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" /><line x1="4.93" y1="4.93" x2="9.17" y2="9.17" /><line x1="14.83" y1="14.83" x2="19.07" y2="19.07" /><line x1="14.83" y1="9.17" x2="19.07" y2="4.93" /><line x1="4.93" y1="19.07" x2="9.17" y2="14.83" /></>,
  play: <polygon points="6 4 20 12 6 20 6 4" />,
  star: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />,
  arrow: <polyline points="9 6 15 12 9 18" />,
} as const;

type IconKey = keyof typeof I;

function Icon({ name, className = "h-6 w-6" }: { name: IconKey; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {I[name]}
    </svg>
  );
}

function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-orange">
      <span className={`h-px w-5 ${light ? "bg-brand-orange/60" : "bg-brand-orange/50"}`} />
      {children}
    </span>
  );
}

/* ── Data ─────────────────────────────────────────────────────────────────── */

const IMG = "/images/sections/school-life";

const DISCOVER = [
  { n: "01", icon: "trophy" as IconKey, title: "Clubs, Sports & Opportunities", body: "Sports, leadership, competitions and creative clubs that build confidence and teamwork.", href: "#life-beyond" },
  { n: "02", icon: "heart" as IconKey, title: "Caring & Inclusive Environment", body: "A safe, supportive space where every student feels respected and empowered to grow.", href: "#caring" },
  { n: "03", icon: "star" as IconKey, title: "Student & Parent Voices", body: "Real stories, achievements and reviews that reflect life at Newton's High School.", href: "#voices" },
];

const LIFE = [
  { icon: "palette" as IconKey, label: "Creative Clubs", desc: "Art, music, drama & more", img: `${IMG}/clubs.jpg`, tone: "navy" as const, span: "lg:col-span-2 lg:row-span-2 h-[240px] lg:h-auto" },
  { icon: "trophy" as IconKey, label: "Sports", desc: "Indoor & outdoor athletics", img: `${IMG}/sports.jpg`, tone: "orange" as const, span: "h-[180px]" },
  { icon: "medal" as IconKey, label: "Competitions", desc: "Quizzes, olympiads & fests", img: `${IMG}/competitions.jpg`, tone: "lavender" as const, span: "h-[180px]" },
  { icon: "flag" as IconKey, label: "Leadership", desc: "Councils & student leaders", img: `${IMG}/leadership.jpg`, tone: "orange" as const, span: "h-[180px]" },
  { icon: "compass" as IconKey, label: "Educational Tours", desc: "Trips & field learning", img: `${IMG}/tours.jpg`, tone: "navy" as const, span: "h-[180px]" },
  { icon: "music" as IconKey, label: "Cultural Events", desc: "Festivals & celebrations", img: `${IMG}/cultural.jpg`, tone: "lavender" as const, span: "lg:col-span-2 h-[180px]" },
];

const CARING: { icon: IconKey; title: string; body: string }[] = [
  { icon: "heart", title: "Student Wellbeing", body: "Counsellors and mentors who look after every child's emotional health." },
  { icon: "shield", title: "Safety & Security", body: "A gated, CCTV-monitored campus with trained, caring staff." },
  { icon: "inclusive", title: "Inclusive Learning", body: "Every learner is welcomed, respected and supported to thrive." },
  { icon: "mentor", title: "Teacher Mentorship", body: "Personal guidance that builds confidence, discipline and character." },
  { icon: "lifebuoy", title: "Emotional & Academic Support", body: "Always-available help so no student is ever left behind." },
];

const MOMENTS = [
  { label: "Annual Day", img: `${IMG}/annual-day.jpg`, tone: "navy" as const },
  { label: "Sports Day", img: `${IMG}/sports-day.jpg`, tone: "orange" as const },
  { label: "Yoga & Wellness", img: `${IMG}/yoga.jpg`, tone: "lavender" as const },
  { label: "Celebrations & Festivals", img: `${IMG}/festivals.jpg`, tone: "orange" as const },
  { label: "Community Events", img: `${IMG}/community.jpg`, tone: "navy" as const },
  { label: "Cultural Programs", img: `${IMG}/cultural-programs.jpg`, tone: "lavender" as const },
];

const FEATURED = {
  quote: "Newton's gave my daughter a stage to shine — from the science club to the annual day. She's grown so confident, and we feel part of a caring family, not just a school.",
  name: "Mrs. Anitha Rao",
  role: "Parent of Grade 9 Student",
};

const VOICES = [
  { quote: "I captained the cricket team and led the eco-club. School here is so much more than books.", name: "Aarav Sharma", role: "Student · Grade 10", stars: 5 },
  { quote: "The teachers genuinely care. My son feels safe, happy and motivated every single day.", name: "Mr. Ravi Kumar", role: "Parent · Grade 6", stars: 5 },
  { quote: "From yoga mornings to cultural fests, there's always something joyful happening.", name: "Sneha Reddy", role: "Student · Grade 8", stars: 5 },
];

const STATS = [
  { target: 20, suffix: "+", label: "Student Clubs" },
  { target: 15, suffix: "+", label: "Sports Activities" },
  { target: 50, suffix: "+", label: "Events Conducted Yearly" },
  { target: 95, suffix: "%", label: "Student Participation" },
];

const GALLERY = [
  { label: "Sports Activities", img: `${IMG}/gallery-sports.jpg`, tone: "navy" as const, span: "row-span-2 h-[300px]" },
  { label: "School Assembly", img: `${IMG}/gallery-assembly.jpg`, tone: "orange" as const, span: "h-[145px]" },
  { label: "Cultural Programs", img: `${IMG}/gallery-cultural.jpg`, tone: "lavender" as const, span: "h-[145px]" },
  { label: "Yoga Sessions", img: `${IMG}/gallery-yoga.jpg`, tone: "orange" as const, span: "h-[145px]" },
  { label: "Library Activities", img: `${IMG}/gallery-library.jpg`, tone: "navy" as const, span: "h-[145px]" },
  { label: "School Transport", img: `${IMG}/gallery-transport.jpg`, tone: "lavender" as const, span: "row-span-2 h-[300px]" },
  { label: "Classroom Learning", img: `${IMG}/gallery-classroom.jpg`, tone: "orange" as const, span: "h-[145px]" },
  { label: "Celebrations", img: `${IMG}/gallery-celebrations.jpg`, tone: "navy" as const, span: "h-[145px]" },
];

function initials(name: string) {
  return name.replace(/^(Mr|Mrs|Ms|Dr)\.?\s+/i, "").trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
}

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5 text-brand-orange" aria-label={`${n} out of 5`}>
      {Array.from({ length: n }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────────── */

export default function SchoolLifePage() {
  return (
    <>
      {/* ── 1 · Immersive hero ── */}
      <section className="relative isolate">
        <ImageFrame
          src={`${IMG}/hero.jpg`}
          tone="navy"
          rounded="rounded-none"
          overlay
          className="h-[440px] lg:h-[600px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/85 via-brand-navy/30 to-transparent" />
        <div className="absolute inset-0 flex items-end pb-12 lg:pb-16">
          <Container>
            <div className="max-w-2xl">
              <Eyebrow light>Newton&apos;s High School</Eyebrow>
              <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] text-white lg:text-6xl">
                School Life,<br /><span className="text-brand-orange">Beautifully Lived</span>
              </h1>
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/85 lg:text-[17px]">
                Explore the experiences, opportunities, support systems and memorable moments
                that make student life vibrant, engaging and meaningful at Newton&apos;s.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <Button href="#life-beyond" size="lg">Explore Student Life</Button>
                <button type="button" className="group inline-flex items-center gap-3 text-[14px] font-semibold text-white">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-white/10 backdrop-blur transition-colors group-hover:bg-white group-hover:text-brand-navy">
                    <Icon name="play" className="h-4 w-4" />
                  </span>
                  Watch campus life
                </button>
              </div>
            </div>
          </Container>
        </div>
      </section>

      {/* ── 2 · What you'll discover (editorial index) ── */}
      <section className="bg-white py-16 lg:py-24">
        <Container>
          <div className="mb-12 max-w-2xl">
            <Eyebrow>What You&apos;ll Discover</Eyebrow>
            <h2 className="mt-4 text-3xl font-extrabold text-brand-ink lg:text-[2.6rem]">
              One vibrant student-life experience
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-slate-100 bg-slate-100 md:grid-cols-3">
            {DISCOVER.map((d) => (
              <Link key={d.n} href={d.href} className="group relative flex flex-col bg-white p-8 transition-colors hover:bg-[#f7f8fd] lg:p-10">
                <span className="text-[13px] font-extrabold text-brand-orange">{d.n}</span>
                <span className="mt-5 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-navy/6 text-brand-navy transition-colors group-hover:bg-brand-navy group-hover:text-white">
                  <Icon name={d.icon} />
                </span>
                <h3 className="mt-5 text-[17px] font-extrabold text-brand-ink">{d.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-brand-muted">{d.body}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-[12px] font-bold uppercase tracking-wider text-brand-navy/70 transition-colors group-hover:text-brand-orange">
                  Explore
                  <Icon name="arrow" className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 3 · Life Beyond the Classroom (bento) ── */}
      <section id="life-beyond" className="scroll-mt-24 py-16 lg:py-24" style={{ background: "#060C8B" }}>
        <Container>
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="flex justify-center"><Eyebrow light>Beyond the Classroom</Eyebrow></div>
            <h2 className="mt-4 text-3xl font-extrabold text-white lg:text-4xl">Life Beyond the Classroom</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-white/70">
              Confidence, teamwork and real-world skills — discovered through the things students love.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {LIFE.map((l) => (
              <div key={l.label} className={`relative ${l.span}`}>
                <ImageFrame src={l.img} tone={l.tone} className="h-full" overlay />
                <span className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white/90 text-brand-navy shadow-sm">
                  <Icon name={l.icon} className="h-4 w-4" />
                </span>
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-[15px] font-bold text-white drop-shadow-sm">{l.label}</p>
                  <p className="text-[11.5px] text-white/80">{l.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 4 · A Caring School Community (sticky split + stepper) ── */}
      <section id="caring" className="scroll-mt-24 bg-white py-16 lg:py-24">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <Eyebrow>A Caring Community</Eyebrow>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight text-brand-ink lg:text-4xl">
                Where Every Student Feels They Belong
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-brand-muted">
                A safe, supportive and inclusive atmosphere is the foundation of everything we
                do — so each child feels respected, encouraged and free to be themselves.
              </p>
              <ImageFrame src={`${IMG}/caring.jpg`} label="Caring Community" tone="lavender" className="mt-7 hidden h-[260px] lg:block shadow-card-lg" />
            </div>
            <ol className="relative space-y-3">
              <span className="absolute bottom-6 left-[27px] top-6 hidden w-px bg-slate-200 sm:block" aria-hidden />
              {CARING.map((c) => (
                <li key={c.title} className="group relative flex gap-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-card transition-all duration-300 hover:border-brand-orange/30 hover:shadow-card-lg sm:p-6">
                  <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-orange/10 text-brand-orange transition-colors duration-300 group-hover:bg-brand-orange group-hover:text-white">
                    <Icon name={c.icon} />
                  </span>
                  <div>
                    <h3 className="text-[16px] font-bold text-brand-ink">{c.title}</h3>
                    <p className="mt-1 text-[13.5px] leading-relaxed text-brand-muted">{c.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* ── 5 · Moments & Memories (horizontal filmstrip) ── */}
      <section className="py-16 lg:py-24" style={{ background: "#f7f8fd" }}>
        <Container>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <Eyebrow>Moments &amp; Memories</Eyebrow>
              <h2 className="mt-4 text-3xl font-extrabold text-brand-ink lg:text-4xl">The Days They&apos;ll Never Forget</h2>
            </div>
            <p className="text-[13px] text-brand-muted">← Scroll to explore →</p>
          </div>
        </Container>
        {/* full-bleed scroll rail */}
        <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 sm:px-6 lg:px-8" style={{ scrollbarWidth: "none" }}>
          {MOMENTS.map((m) => (
            <div key={m.label} className="w-[260px] shrink-0 snap-start lg:w-[320px]">
              <ImageFrame src={m.img} caption={m.label} tone={m.tone} className="h-[340px] lg:h-[400px] shadow-card" />
            </div>
          ))}
        </div>
      </section>

      {/* ── 6 · Student & Parent Voices ── */}
      <section id="voices" className="scroll-mt-24 bg-white py-16 lg:py-24">
        <Container>
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="flex justify-center"><Eyebrow>Voices of Our Community</Eyebrow></div>
            <h2 className="mt-4 text-3xl font-extrabold text-brand-ink lg:text-4xl">Student &amp; Parent Voices</h2>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-orange/10 px-4 py-1.5">
              <Stars n={5} />
              <span className="text-[13px] font-bold text-brand-ink">4.9/5 average rating</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            {/* Featured */}
            <figure className="relative flex flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-brand-navy to-[#1b2378] p-8 text-white lg:p-10">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-10 w-10 text-white/20" aria-hidden>
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <blockquote className="mt-4 text-[18px] font-medium leading-relaxed lg:text-[21px]">{FEATURED.quote}</blockquote>
              <figcaption className="mt-7 flex items-center gap-4 border-t border-white/15 pt-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-[14px] font-extrabold">{initials(FEATURED.name)}</span>
                <span>
                  <span className="block text-[15px] font-bold">{FEATURED.name}</span>
                  <span className="block text-[12px] text-white/70">{FEATURED.role}</span>
                </span>
              </figcaption>
            </figure>

            {/* Supporting */}
            <div className="grid grid-cols-1 gap-4">
              {VOICES.map((v) => (
                <figure key={v.name} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-lg">
                  <Stars n={v.stars} />
                  <blockquote className="mt-3 text-[13.5px] leading-relaxed text-brand-ink">{v.quote}</blockquote>
                  <figcaption className="mt-4 flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-navy to-[#2b34a0] text-[12px] font-extrabold text-white">{initials(v.name)}</span>
                    <span>
                      <span className="block text-[13px] font-bold text-brand-ink">{v.name}</span>
                      <span className="block text-[11px] text-brand-muted">{v.role}</span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── 7 · School Life statistics ── */}
      <section className="py-16 lg:py-24" style={{ background: "#ECEAFB" }}>
        <Container>
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="flex justify-center"><Eyebrow>By the Numbers</Eyebrow></div>
            <h2 className="mt-4 text-3xl font-extrabold text-brand-ink lg:text-4xl">A School Buzzing With Life</h2>
          </div>
          <StatsCounter stats={STATS} />
        </Container>
      </section>

      {/* ── 8 · Gallery (masonry) ── */}
      <section className="bg-white py-16 lg:py-24">
        <Container>
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="flex justify-center"><Eyebrow>Life in Pictures</Eyebrow></div>
            <h2 className="mt-4 text-3xl font-extrabold text-brand-ink lg:text-4xl">Our Photo Wall</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-brand-muted">
              Placeholders ready for your favourite moments — drop the photos in and they appear instantly.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {GALLERY.map((g) => (
              <ImageFrame key={g.label} src={g.img} caption={g.label} tone={g.tone} className={g.span} />
            ))}
          </div>
        </Container>
      </section>

      {/* ── 9 · CTA ── */}
      <section className="relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr]">
          <div className="relative z-10 flex flex-col justify-center bg-brand-navy px-8 py-14 lg:px-14 lg:py-20">
            <Eyebrow light>Come See For Yourself</Eyebrow>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-white lg:text-4xl">
              Experience Newton&apos;s School Life
            </h2>
            <p className="mb-8 mt-4 max-w-sm text-[15px] leading-relaxed text-white/70">
              The energy of our campus is best felt in person. Book a visit or enquire about
              admissions and see student life in full colour.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button href="/admissions/enquire-now" size="lg">Enquire Now</Button>
              <Button href="/admissions/how-to-apply" size="lg" variant="outline-light">Book a Campus Tour</Button>
            </div>
          </div>
          <ImageFrame src={`${IMG}/cta.jpg`} label="Campus Life" tone="orange" rounded="rounded-none" className="h-[300px] min-h-[300px] lg:h-auto" />
        </div>
      </section>

      <AccreditationsBanner />
    </>
  );
}
