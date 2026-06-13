"use client";

import { useEffect, useState } from "react";
import { Container } from "~/components/layout/Container";
import { ImageFrame } from "~/components/ui/ImageFrame";

/* ── Constants ────────────────────────────────────────────────────────────── */

const IMG = "/images/sections/calendar";
const YEARS = ["2026–27", "2027–28", "2028–29", "2029–30", "2030–31"];
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function fmt(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return `${MON[d.getMonth()]} ${d.getDate()}`;
}
function daysUntil(iso: string, now: number) {
  return Math.ceil((new Date(iso + "T09:00:00").getTime() - now) / 86400000);
}

/* ── Data (Telangana SSC academic year, June → May) ───────────────────────── */

const ROADMAP: { m: string; emoji: string; items: { e: string; t: string }[] }[] = [
  { m: "June", emoji: "🌱", items: [{ e: "📚", t: "School Reopening" }, { e: "👋", t: "Orientation" }, { e: "🚌", t: "Transport Registration" }, { e: "📖", t: "Textbook Distribution" }] },
  { m: "July", emoji: "📘", items: [{ e: "📝", t: "Unit Tests Begin" }, { e: "👨‍👩‍👧", t: "Parent-Teacher Meeting" }, { e: "🎨", t: "Club Activities Launch" }] },
  { m: "August", emoji: "🇮🇳", items: [{ e: "🇮🇳", t: "Independence Day" }, { e: "📝", t: "FA-1 Preparation" }, { e: "🐘", t: "Vinayaka Chavithi" }] },
  { m: "September", emoji: "📝", items: [{ e: "📝", t: "FA-1 Examinations" }, { e: "🎓", t: "Progress Reports" }, { e: "👩‍🏫", t: "Teachers' Day" }] },
  { m: "October", emoji: "🪔", items: [{ e: "🏵️", t: "Gandhi Jayanti" }, { e: "🎉", t: "Dussehra Vacation" }, { e: "📝", t: "FA-2 Begins" }] },
  { m: "November", emoji: "🎭", items: [{ e: "🎭", t: "Cultural Fest" }, { e: "🧒", t: "Children's Day" }, { e: "📝", t: "FA-2 Examinations" }] },
  { m: "December", emoji: "🏅", items: [{ e: "🏅", t: "Annual Sports Day" }, { e: "📝", t: "SA-1 Examinations" }, { e: "🎄", t: "Christmas" }] },
  { m: "January", emoji: "🪁", items: [{ e: "🪁", t: "Sankranti Vacation" }, { e: "🇮🇳", t: "Republic Day" }, { e: "📝", t: "FA-3 Begins" }] },
  { m: "February", emoji: "🎪", items: [{ e: "🎭", t: "Annual Day" }, { e: "🕉️", t: "Maha Shivaratri" }, { e: "📝", t: "FA-4 Preparation" }] },
  { m: "March", emoji: "📚", items: [{ e: "📖", t: "Revision Classes" }, { e: "📝", t: "SA-2 / Annual Exams" }, { e: "🌙", t: "Ramzan" }] },
  { m: "April", emoji: "🎓", items: [{ e: "🎓", t: "Results Published" }, { e: "🏆", t: "Prize Distribution" }, { e: "📋", t: "Admissions Open" }] },
  { m: "May", emoji: "☀️", items: [{ e: "☀️", t: "Summer Vacation" }, { e: "🎒", t: "Summer Camp" }, { e: "📝", t: "New Session Prep" }] },
];

const EXAM_JOURNEY: { code: string; title: string; window: string; points: string[] }[] = [
  { code: "FA-1", title: "Formative Assessment 1", window: "August – September", points: ["Assignments & worksheets", "Projects & activities", "Slip tests & observation"] },
  { code: "FA-2", title: "Formative Assessment 2", window: "October – November", points: ["Continuous evaluation", "Class participation", "Notebook submission"] },
  { code: "SA-1", title: "Summative Assessment 1", window: "December", points: ["First major written exam", "Half-yearly evaluation", "Progress report issued"] },
  { code: "FA 3-4", title: "Formative 3 & 4", window: "January – February", points: ["Activity-based assessment", "Revision checkpoints"] },
  { code: "SA-2", title: "Annual Examination", window: "March – April", points: ["Final written examination", "Full-syllabus evaluation", "Promotion decision"] },
  { code: "Results", title: "Results & Reports", window: "April", points: ["Final report cards", "Parent feedback meeting", "Prize distribution"] },
];

type HCat = "National" | "Religious" | "School";
const HOLIDAYS: { name: string; date: string; cat: HCat }[] = [
  { name: "Independence Day", date: "2026-08-15", cat: "National" },
  { name: "Gandhi Jayanti", date: "2026-10-02", cat: "National" },
  { name: "Republic Day", date: "2027-01-26", cat: "National" },
  { name: "Vinayaka Chavithi", date: "2026-08-27", cat: "Religious" },
  { name: "Dussehra", date: "2026-10-20", cat: "Religious" },
  { name: "Christmas", date: "2026-12-25", cat: "Religious" },
  { name: "Sankranti", date: "2027-01-15", cat: "Religious" },
  { name: "Maha Shivaratri", date: "2027-02-15", cat: "Religious" },
  { name: "Ramzan (Eid)", date: "2027-03-20", cat: "Religious" },
  { name: "Dussehra Vacation", date: "2026-10-17", cat: "School" },
  { name: "Sankranti Vacation", date: "2027-01-13", cat: "School" },
  { name: "Summer Vacation", date: "2027-04-23", cat: "School" },
];
const HCAT_META: Record<HCat, { color: string; bg: string }> = {
  National: { color: "#2563eb", bg: "#eff6ff" },
  Religious: { color: "#9333ea", bg: "#faf5ff" },
  School: { color: "#16a34a", bg: "#f0fdf4" },
};

const HIGHLIGHTS = {
  featured: { title: "Annual Sports Day", date: "2026-12-12", desc: "A spectacular day of athletics, march-past, team spirit and inter-house championships — families welcome to cheer their champions.", img: `${IMG}/sports-day.jpg` },
  side: [
    { title: "Science Fair", date: "2026-09-18", img: `${IMG}/science-fair.jpg` },
    { title: "Cultural Fest", date: "2026-11-14", img: `${IMG}/cultural-fest.jpg` },
    { title: "Children's Day", date: "2026-11-14", img: `${IMG}/childrens-day.jpg` },
    { title: "Annual Day", date: "2027-02-21", img: `${IMG}/annual-day.jpg` },
  ],
};

const IMPORTANT: { icon: string; title: string; date: string }[] = [
  { icon: "📚", title: "School Reopening", date: "2026-06-12" },
  { icon: "🧘", title: "International Yoga Day", date: "2026-06-21" },
  { icon: "👨‍👩‍👧", title: "Parent-Teacher Meeting", date: "2026-07-20" },
  { icon: "📝", title: "FA-1 Examinations", date: "2026-09-01" },
];

const EXAMS_DATED = EXAM_JOURNEY.map((e, i) => ({ title: e.code, date: ["2026-09-01", "2026-11-10", "2026-12-15", "2027-02-01", "2027-03-23", "2027-04-25"][i] }));
const EVENTS_DATED = [{ title: "Orientation", date: "2026-06-12" }, { title: "Science Fair", date: "2026-09-18" }, { title: "Sports Day", date: "2026-12-12" }, { title: "Annual Day", date: "2027-02-21" }];

const PARENTS = [
  { icon: "👨‍👩‍👧", t: "Parent-Teacher Meetings", d: "Jul 20 · Oct 11 · Jan 17" },
  { icon: "🎓", t: "Report Card Release", d: "After each SA examination" },
  { icon: "💳", t: "Fee Deadlines", d: "Quarterly · Jun · Sep · Dec · Mar" },
  { icon: "🔔", t: "Holiday Alerts", d: "Notified 3 days in advance" },
];
const TEACHERS = [
  { icon: "📋", t: "Syllabus Tracking", d: "Monthly completion review" },
  { icon: "📝", t: "Exam Planning", d: "FA & SA schedule preparation" },
  { icon: "📊", t: "Marks Submission", d: "Within 7 days of each exam" },
  { icon: "🗓️", t: "Staff Meetings", d: "Every second Saturday" },
];

const INSIGHTS = [
  { m: "June", work: 24, hol: 2, exam: "—", event: "School Reopening" },
  { m: "July", work: 26, hol: 1, exam: "Unit Test", event: "PTM" },
  { m: "August", work: 24, hol: 3, exam: "FA-1 Prep", event: "Independence Day" },
  { m: "September", work: 22, hol: 2, exam: "FA-1", event: "Teachers' Day" },
  { m: "October", work: 20, hol: 6, exam: "FA-2", event: "Dussehra" },
  { m: "November", work: 25, hol: 2, exam: "FA-2 Exam", event: "Cultural Fest" },
  { m: "December", work: 23, hol: 3, exam: "SA-1", event: "Sports Day" },
  { m: "January", work: 22, hol: 4, exam: "FA-3", event: "Sankranti" },
  { m: "February", work: 24, hol: 2, exam: "FA-4", event: "Annual Day" },
  { m: "March", work: 25, hol: 1, exam: "SA-2", event: "Revision" },
  { m: "April", work: 18, hol: 4, exam: "Results", event: "Prize Day" },
  { m: "May", work: 8, hol: 18, exam: "—", event: "Summer Camp" },
];

const DOWNLOADS = [
  { t: "Academic Calendar", sub: "Full-year schedule · PDF", size: "1.2 MB" },
  { t: "Holiday Calendar", sub: "National, religious & school holidays", size: "480 KB" },
  { t: "Examination Planner", sub: "FA & SA timeline · PDF", size: "760 KB" },
  { t: "Event Schedule", sub: "Annual events & celebrations", size: "640 KB" },
];

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-orange">
      <span className={`h-px w-5 ${light ? "bg-brand-orange/60" : "bg-brand-orange/50"}`} />
      {children}
    </span>
  );
}
function Heading({ eyebrow, title, sub, center, light }: { eyebrow: string; title: string; sub?: string; center?: boolean; light?: boolean }) {
  return (
    <div className={`mb-12 max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      <div className={center ? "flex justify-center" : ""}><Eyebrow light={light}>{eyebrow}</Eyebrow></div>
      <h2 className={`mt-4 text-3xl font-extrabold lg:text-4xl ${light ? "text-white" : "text-brand-ink"}`}>{title}</h2>
      {sub && <p className={`mt-3 text-[15px] leading-relaxed ${light ? "text-white/70" : "text-brand-muted"}`}>{sub}</p>}
    </div>
  );
}

/* ── Live values (computed after mount → no hydration mismatch) ───────────── */

interface Live {
  progress: number;
  term: string;
  nextExam: { title: string; date: string } | null;
  nextHoliday: { name: string; date: string } | null;
  nextEvent: { title: string; date: string } | null;
  countdowns: { icon: string; title: string; days: number }[];
}

function useLive(yearIndex: number): Live | null {
  const [live, setLive] = useState<Live | null>(null);
  useEffect(() => {
    const now = Date.now();
    const startYear = 2026 + yearIndex;
    const start = new Date(startYear, 5, 1).getTime(); // Jun 1
    const end = new Date(startYear + 1, 4, 31).getTime(); // May 31
    const progress = Math.round(Math.min(1, Math.max(0, (now - start) / (end - start))) * 100);

    const month = new Date(now).getMonth();
    const term = month >= 5 && month <= 8 ? "Term 1" : month >= 9 && month <= 11 ? "Term 2" : month >= 0 && month <= 2 ? "Term 3" : "Final Term";

    const nextOf = <T extends { date: string }>(arr: T[]) =>
      arr.map((x) => ({ ...x, t: new Date(x.date + "T09:00:00").getTime() })).filter((x) => x.t >= now).sort((a, b) => a.t - b.t)[0] ?? null;

    setLive({
      progress,
      term,
      nextExam: nextOf(EXAMS_DATED),
      nextHoliday: nextOf(HOLIDAYS),
      nextEvent: nextOf(EVENTS_DATED),
      countdowns: IMPORTANT.map((i) => ({ icon: i.icon, title: i.title, days: daysUntil(i.date, now) })).filter((i) => i.days >= 0).sort((a, b) => a.days - b.days),
    });
  }, [yearIndex]);
  return live;
}

/* ── Main ─────────────────────────────────────────────────────────────────── */

export function AcademicCalendar() {
  const [yearIndex, setYearIndex] = useState(0);
  const [openMonth, setOpenMonth] = useState(0);
  const [openExam, setOpenExam] = useState(0);
  const [hFilter, setHFilter] = useState<"All" | HCat>("All");
  const [openInsight, setOpenInsight] = useState<number | null>(null);
  const live = useLive(yearIndex);

  const holidays = hFilter === "All" ? HOLIDAYS : HOLIDAYS.filter((h) => h.cat === hFilter);

  return (
    <>
      {/* ── 1 · Immersive hero ── */}
      <section className="relative isolate overflow-hidden">
        <ImageFrame src={`${IMG}/hero.jpg`} tone="navy" rounded="rounded-none" overlay className="h-[460px] lg:h-[560px]" />
        <div className="absolute inset-0 bg-brand-navy/75" />
        {/* academic motion particles */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {[["12%", "20%", "0s"], ["80%", "30%", "1.2s"], ["25%", "70%", "0.6s"], ["65%", "75%", "1.8s"], ["90%", "55%", "0.9s"], ["45%", "15%", "1.5s"]].map(([l, t, d], i) => (
            <span key={i} className="absolute h-2 w-2 rounded-full bg-brand-orange/60 animate-bob" style={{ left: l, top: t, animationDelay: d }} />
          ))}
          <div className="absolute -right-20 top-10 h-80 w-80 rounded-full bg-brand-orange/15 blur-3xl" />
        </div>
        <div className="absolute inset-0 flex items-center">
          <Container className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-orange backdrop-blur">
              Academic Year {YEARS[yearIndex]}
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] text-white lg:text-6xl">
              Academic Calendar
            </h1>
            <p className="mt-3 text-xl font-bold text-brand-orange lg:text-2xl">Plan. Learn. Achieve.</p>
            <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-white/80 lg:text-[17px]">
              Track examinations, holidays, school events, academic milestones and important
              announcements throughout the year.
            </p>
          </Container>
        </div>
      </section>

      {/* ── Year switcher (segmented control) ── */}
      <section className="sticky top-20 z-30 border-b border-slate-100 bg-white/95 backdrop-blur lg:top-[100px]">
        <Container className="py-3">
          <div className="mx-auto flex w-full max-w-xl gap-1 overflow-x-auto rounded-full bg-slate-100 p-1" style={{ scrollbarWidth: "none" }}>
            {YEARS.map((y, i) => (
              <button key={y} onClick={() => setYearIndex(i)} className={`flex-1 whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-bold transition-colors ${i === yearIndex ? "bg-brand-navy text-white shadow-sm" : "text-slate-500 hover:text-brand-navy"}`}>{y}</button>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 2 · Academic journey roadmap ── */}
      <section className="bg-white py-16 lg:py-24">
        <Container>
          <Heading eyebrow="The Year Ahead" title="Academic Journey Roadmap" sub="Follow the school year month by month — tap any milestone to see what's planned." />
          {/* Month rail */}
          <div className="flex gap-2 overflow-x-auto pb-3" style={{ scrollbarWidth: "none" }}>
            {ROADMAP.map((mo, i) => (
              <button key={mo.m} onClick={() => setOpenMonth(i)} className={`group flex shrink-0 flex-col items-center gap-1.5 rounded-2xl border px-5 py-3 transition-all ${i === openMonth ? "border-brand-orange bg-brand-orange/10" : "border-slate-100 bg-white hover:border-slate-200"}`}>
                <span className="text-xl">{mo.emoji}</span>
                <span className={`text-[12px] font-bold ${i === openMonth ? "text-brand-orange" : "text-brand-ink"}`}>{mo.m}</span>
              </button>
            ))}
          </div>
          {/* progress rail line */}
          <div className="relative mt-4 hidden h-1 rounded-full bg-slate-100 lg:block">
            <div className="h-full rounded-full bg-gradient-to-r from-brand-orange to-brand-navy transition-all duration-500" style={{ width: `${((openMonth + 1) / ROADMAP.length) * 100}%` }} />
          </div>
          {/* Expanded month */}
          <div className="mt-6 rounded-3xl border border-slate-100 bg-[#f7f8fd] p-7 lg:p-10">
            <div className="mb-5 flex items-center gap-3">
              <span className="text-3xl">{ROADMAP[openMonth].emoji}</span>
              <h3 className="text-2xl font-extrabold text-brand-ink">{ROADMAP[openMonth].m}</h3>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {ROADMAP[openMonth].items.map((it) => (
                <div key={it.t} className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
                  <span className="text-xl">{it.e}</span>
                  <span className="text-[13.5px] font-semibold text-brand-ink">{it.t}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── 3 · Academic clock + status ── */}
      <section className="py-16 lg:py-24" style={{ background: "#060C8B" }}>
        <Container>
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Progress ring */}
            <div className="flex justify-center">
              <div className="relative h-64 w-64 lg:h-72 lg:w-72">
                <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
                  <circle cx="100" cy="100" r="86" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="14" />
                  <circle
                    cx="100" cy="100" r="86" fill="none" stroke="#F39200" strokeWidth="14" strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 86}
                    strokeDashoffset={live ? 2 * Math.PI * 86 * (1 - live.progress / 100) : 2 * Math.PI * 86}
                    style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.22,1,0.36,1)" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-extrabold text-white tabular-nums">{live ? live.progress : 0}%</span>
                  <span className="mt-1 text-[12px] font-semibold uppercase tracking-widest text-white/60">Year Completed</span>
                  <span className="mt-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-brand-orange">{live?.term ?? "—"}</span>
                </div>
              </div>
            </div>
            {/* Status chips */}
            <div>
              <Eyebrow light>Where We Are</Eyebrow>
              <h2 className="mt-4 text-3xl font-extrabold text-white lg:text-4xl">Your Academic Year at a Glance</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-white/70">A live snapshot of the {YEARS[yearIndex]} school year — no tables required.</p>
              <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  { l: "Next Exam", v: live?.nextExam ? `${live.nextExam.title}` : "—", s: live?.nextExam ? fmt(live.nextExam.date) : "", c: "#F39200" },
                  { l: "Next Holiday", v: live?.nextHoliday?.name ?? "—", s: live?.nextHoliday ? fmt(live.nextHoliday.date) : "", c: "#34d399" },
                  { l: "Next Event", v: live?.nextEvent?.title ?? "—", s: live?.nextEvent ? fmt(live.nextEvent.date) : "", c: "#60a5fa" },
                ].map((x) => (
                  <div key={x.l} className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur">
                    <span className="mb-2 block h-1.5 w-8 rounded-full" style={{ background: x.c }} />
                    <p className="text-[11px] font-bold uppercase tracking-wider text-white/50">{x.l}</p>
                    <p className="mt-1 text-[15px] font-extrabold leading-tight text-white">{x.v}</p>
                    {x.s && <p className="text-[12px] text-white/60">{x.s}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── 4 · Examination journey ── */}
      <section className="bg-white py-16 lg:py-24">
        <Container>
          <Heading eyebrow="Assessment Pathway" title="The Examination Journey" sub="A continuous path of formative and summative checkpoints across the year." center />
          <div className="mx-auto max-w-3xl">
            <div className="relative space-y-3 pl-8">
              <span className="absolute bottom-3 left-[11px] top-3 w-[2px] bg-slate-200" aria-hidden />
              {EXAM_JOURNEY.map((ex, i) => {
                const open = openExam === i;
                return (
                  <div key={ex.code} className="relative">
                    <span className={`absolute -left-8 top-4 z-10 h-6 w-6 rounded-full border-4 border-white shadow-card transition-colors ${open ? "bg-brand-orange" : "bg-brand-navy"}`} />
                    <button onClick={() => setOpenExam(open ? -1 : i)} className="flex w-full items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-5 text-left shadow-card transition-all hover:shadow-card-lg">
                      <div className="flex items-center gap-4">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-navy/6 text-[13px] font-extrabold text-brand-navy">{ex.code}</span>
                        <div>
                          <h3 className="text-[16px] font-bold text-brand-ink">{ex.title}</h3>
                          <p className="text-[12.5px] text-brand-orange">{ex.window}</p>
                        </div>
                      </div>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}><polyline points="6 9 12 15 18 9" /></svg>
                    </button>
                    <div className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                      <div className="overflow-hidden">
                        <ul className="mt-2 flex flex-wrap gap-2 pl-1">
                          {ex.points.map((p) => (
                            <li key={p} className="rounded-full bg-[#f7f8fd] px-3 py-1.5 text-[12.5px] font-medium text-brand-ink">{p}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* ── 5 · Holiday universe ── */}
      <section className="py-16 lg:py-24" style={{ background: "#f7f8fd" }}>
        <Container>
          <Heading eyebrow="Time to Recharge" title="Holiday Universe" sub="Every national, religious and school holiday across the year — filter to plan ahead." center />
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {(["All", "National", "Religious", "School"] as const).map((f) => (
              <button key={f} onClick={() => setHFilter(f)} className={`rounded-full px-4 py-2 text-[12.5px] font-semibold transition-colors ${hFilter === f ? "bg-brand-navy text-white shadow-card" : "bg-white text-slate-500 hover:bg-slate-100"}`}>{f}</button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {holidays.map((h) => {
              const meta = HCAT_META[h.cat];
              return (
                <div key={h.name} className="group flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-lg">
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 flex-col items-center justify-center rounded-xl text-center" style={{ background: meta.bg, color: meta.color }}>
                      <span className="text-[15px] font-extrabold leading-none">{new Date(h.date + "T00:00:00").getDate()}</span>
                      <span className="text-[8.5px] font-bold uppercase">{MON[new Date(h.date + "T00:00:00").getMonth()]}</span>
                    </span>
                    <span className="rounded-full px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wide" style={{ background: meta.bg, color: meta.color }}>{h.cat}</span>
                  </div>
                  <h3 className="text-[14px] font-bold text-brand-ink">{h.name}</h3>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ── 6 · Upcoming highlights (magazine) ── */}
      <section className="bg-white py-16 lg:py-24">
        <Container>
          <Heading eyebrow="Don't Miss" title="Upcoming Highlights" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Featured */}
            <article className="group relative overflow-hidden rounded-3xl shadow-card-lg">
              <ImageFrame src={HIGHLIGHTS.featured.img} tone="navy" rounded="rounded-none" className="h-[300px] lg:h-full lg:min-h-[440px]" overlay />
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <span className="mb-3 w-fit rounded-full bg-brand-orange px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">Featured · {fmt(HIGHLIGHTS.featured.date)}</span>
                <h3 className="text-2xl font-extrabold text-white lg:text-3xl">{HIGHLIGHTS.featured.title}</h3>
                <p className="mt-2 max-w-md text-[14px] leading-relaxed text-white/85">{HIGHLIGHTS.featured.desc}</p>
              </div>
            </article>
            {/* Side list */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {HIGHLIGHTS.side.map((s) => (
                <article key={s.title} className="group flex items-center gap-4 overflow-hidden rounded-2xl border border-slate-100 bg-white p-3 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-lg">
                  <ImageFrame src={s.img} tone="lavender" rounded="rounded-xl" className="h-20 w-28 shrink-0" />
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-brand-orange">{fmt(s.date)}</p>
                    <h3 className="mt-0.5 text-[15px] font-bold text-brand-ink">{s.title}</h3>
                  </div>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="ml-auto h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-orange"><polyline points="9 6 15 12 9 18" /></svg>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── 7 · Important dates dashboard (countdowns) ── */}
      <section className="py-16 lg:py-24" style={{ background: "#ECEAFB" }}>
        <Container>
          <Heading eyebrow="On the Horizon" title="Coming Up Next" center />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(live?.countdowns ?? IMPORTANT.map((i) => ({ ...i, days: 0 }))).slice(0, 4).map((c) => (
              <div key={c.title} className="relative overflow-hidden rounded-2xl bg-white p-6 text-center shadow-card">
                <span className="text-3xl">{c.icon}</span>
                <p className="mt-3 text-[14px] font-bold text-brand-ink">{c.title}</p>
                <div className="mt-3">
                  <span className="text-3xl font-extrabold text-brand-orange tabular-nums">{live ? c.days : "—"}</span>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-muted">Days Remaining</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 8 · Parent & Teacher planner (split) ── */}
      <section className="bg-white py-16 lg:py-24">
        <Container>
          <Heading eyebrow="Stay Organised" title="Parent & Teacher Planner" center />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {[{ tag: "For Parents", color: "#F39200", items: PARENTS }, { tag: "For Teachers", color: "#060C8B", items: TEACHERS }].map((col) => (
              <div key={col.tag} className="rounded-3xl border border-slate-100 bg-[#f7f8fd] p-7 lg:p-9">
                <span className="inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white" style={{ background: col.color }}>{col.tag}</span>
                <ol className="mt-6 space-y-5">
                  {col.items.map((it, i) => (
                    <li key={it.t} className="relative flex gap-4 pl-4">
                      {i < col.items.length - 1 && <span className="absolute left-[7px] top-7 h-full w-px bg-slate-200" />}
                      <span className="mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full ring-4 ring-[#f7f8fd]" style={{ background: col.color }} />
                      <div>
                        <p className="flex items-center gap-2 text-[14.5px] font-bold text-brand-ink"><span>{it.icon}</span>{it.t}</p>
                        <p className="mt-0.5 text-[12.5px] text-brand-muted">{it.d}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 9 · Monthly academic insights (accordion) ── */}
      <section className="py-16 lg:py-24" style={{ background: "#f7f8fd" }}>
        <Container>
          <Heading eyebrow="Month by Month" title="Monthly Academic Insights" sub="Expand any month for a quick infographic snapshot." center />
          <div className="mx-auto max-w-3xl space-y-2.5">
            {INSIGHTS.map((mo, i) => {
              const open = openInsight === i;
              return (
                <div key={mo.m} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card">
                  <button onClick={() => setOpenInsight(open ? null : i)} className="flex w-full items-center justify-between gap-4 p-5 text-left">
                    <span className="text-[16px] font-bold text-brand-ink">{mo.m}</span>
                    <div className="flex items-center gap-3">
                      <span className="hidden text-[12px] text-brand-muted sm:block">{mo.exam !== "—" ? mo.exam : mo.event}</span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`h-4 w-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}><polyline points="6 9 12 15 18 9" /></svg>
                    </div>
                  </button>
                  <div className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <div className="grid grid-cols-2 gap-3 border-t border-slate-100 p-5 sm:grid-cols-4">
                        {[{ n: mo.work, l: "Working Days", c: "#060C8B" }, { n: mo.hol, l: "Holidays", c: "#16a34a" }, { v: mo.exam, l: "Examination", c: "#F39200" }, { v: mo.event, l: "Key Event", c: "#9333ea" }].map((s) => (
                          <div key={s.l} className="rounded-xl bg-[#f7f8fd] p-4 text-center">
                            <div className="text-[18px] font-extrabold tabular-nums" style={{ color: s.c }}>{s.n ?? s.v}</div>
                            <div className="mt-1 text-[10.5px] font-semibold uppercase tracking-wide text-brand-muted">{s.l}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ── 10 · Download center ── */}
      <section className="bg-white py-16 lg:py-24">
        <Container>
          <Heading eyebrow="Take It With You" title="Download Center" center />
          <div className="mx-auto max-w-3xl divide-y divide-slate-100 overflow-hidden rounded-3xl border border-slate-100 shadow-card">
            {DOWNLOADS.map((d) => (
              <button key={d.t} className="group flex w-full items-center gap-4 p-5 text-left transition-colors hover:bg-[#f7f8fd]">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[14.5px] font-bold text-brand-ink">{d.t}</p>
                  <p className="text-[12px] text-brand-muted">{d.sub}</p>
                </div>
                <span className="hidden text-[11px] font-medium text-slate-400 sm:block">{d.size}</span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-brand-navy transition-colors group-hover:border-brand-orange group-hover:bg-brand-orange group-hover:text-white">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                </span>
              </button>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
