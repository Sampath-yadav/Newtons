"use client";

import { useEffect, useMemo, useState } from "react";
import { Container } from "~/components/layout/Container";
import { Button } from "~/components/ui/Button";
import { ImageFrame } from "~/components/ui/ImageFrame";

/* ── Category system ──────────────────────────────────────────────────────── */

const CATS = {
  News: { color: "#2563eb", bg: "#eff6ff" },
  Events: { color: "#F39200", bg: "#FFF5E5" },
  Academics: { color: "#4338ca", bg: "#eef2ff" },
  Sports: { color: "#16a34a", bg: "#f0fdf4" },
  Cultural: { color: "#9333ea", bg: "#faf5ff" },
  Achievements: { color: "#d97706", bg: "#fffbeb" },
  Announcements: { color: "#e11d48", bg: "#fff1f2" },
} as const;
type Cat = keyof typeof CATS;
const FILTERS: ("All" | Cat)[] = ["All", "News", "Events", "Academics", "Sports", "Cultural", "Achievements", "Announcements"];

const IMG = "/images/sections/whats-on";
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MON_FULL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function fmt(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return `${MON[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

/* ── Data ─────────────────────────────────────────────────────────────────── */

const STATS = [
  { value: "12", label: "Upcoming Events" },
  { value: "28", label: "Latest News" },
  { value: "9", label: "Competitions" },
  { value: "45", label: "Achievements" },
];

const FEATURED: { cat: Cat; date: string; title: string; desc: string; img: string }[] = [
  { cat: "Events", date: "2026-08-15", title: "Independence Day Celebrations", desc: "A morning of patriotism, march-past, cultural performances and flag hoisting across the campus.", img: `${IMG}/featured-independence.jpg` },
  { cat: "Academics", date: "2026-07-15", title: "Science Exhibition 2026", desc: "Young innovators present working models and experiments — open to parents and the community.", img: `${IMG}/featured-science.jpg` },
  { cat: "Announcements", date: "2026-06-01", title: "Admissions Open · 2026–27", desc: "Limited seats across all classes. Enquire now to secure your child's place at Newton's.", img: `${IMG}/featured-admissions.jpg` },
];

const UPDATES: { cat: Cat; date: string; title: string; desc: string; img: string }[] = [
  { cat: "Achievements", date: "2026-06-02", title: "Aarav Wins State Maths Olympiad", desc: "Grade 10 student bags gold at the Telangana State Mathematics Olympiad.", img: `${IMG}/u-olympiad.jpg` },
  { cat: "Academics", date: "2026-06-05", title: "FA-1 Results Published", desc: "Formative Assessment 1 results are now available on the Parent Portal.", img: `${IMG}/u-results.jpg` },
  { cat: "Sports", date: "2026-05-30", title: "U-14 Cricket Team Reaches Finals", desc: "Our young cricketers storm into the inter-school district finals.", img: `${IMG}/u-cricket.jpg` },
  { cat: "Cultural", date: "2026-05-22", title: "Telugu Language Day Celebrated", desc: "Students honoured our mother tongue with poetry, song and drama.", img: `${IMG}/u-telugu.jpg` },
  { cat: "Events", date: "2026-05-18", title: "Science Exhibition Concluded", desc: "Over 120 student projects showcased across physics, biology and robotics.", img: `${IMG}/u-exhibition.jpg` },
  { cat: "Announcements", date: "2026-05-15", title: "Summer Reading Challenge Launched", desc: "A library initiative to keep young minds reading through the break.", img: `${IMG}/u-reading.jpg` },
  { cat: "News", date: "2026-05-10", title: "New Smart Classrooms Inaugurated", desc: "Eight digitally-enabled classrooms now live across the upper-primary block.", img: `${IMG}/u-classrooms.jpg` },
];

const EVENTS: { date: string; title: string; location: string; cat: Cat }[] = [
  { date: "2026-06-21", title: "International Yoga Day", location: "School Ground", cat: "Cultural" },
  { date: "2026-06-26", title: "FA-1 Examinations Begin", location: "Classrooms", cat: "Academics" },
  { date: "2026-07-15", title: "Science Fair", location: "Main Campus", cat: "Events" },
  { date: "2026-07-20", title: "Parent-Teacher Meeting", location: "Auditorium", cat: "Announcements" },
  { date: "2026-07-26", title: "Inter-House Quiz", location: "Auditorium", cat: "Academics" },
  { date: "2026-08-15", title: "Independence Day", location: "School Ground", cat: "Cultural" },
  { date: "2026-08-22", title: "Annual Sports Meet", location: "Sports Ground", cat: "Sports" },
  { date: "2026-09-05", title: "Teachers' Day", location: "Auditorium", cat: "Events" },
];

const ACHIEVERS = [
  { name: "Aarav Sharma", achievement: "Gold · State Maths Olympiad", grade: "Grade 10", slug: "aarav" },
  { name: "Sneha Reddy", achievement: "100m Champion · District Athletics", grade: "Grade 8", slug: "sneha" },
  { name: "Karthik Rao", achievement: "Finalist · National Science Fair", grade: "Grade 9", slug: "karthik" },
  { name: "Priya Nair", achievement: "SSC Topper · 98.6%", grade: "Class X", slug: "priya" },
];

const ANNOUNCEMENTS: { title: string; date: string; priority: "high" | "normal"; file: boolean }[] = [
  { title: "Admissions Open 2026–27", date: "2026-06-01", priority: "high", file: true },
  { title: "FA-1 Results Published", date: "2026-06-05", priority: "high", file: false },
  { title: "Parent-Teacher Meeting Schedule", date: "2026-07-20", priority: "normal", file: true },
  { title: "Summer Holiday Notification", date: "2026-04-25", priority: "normal", file: true },
  { title: "Science Exhibition Registration Open", date: "2026-06-30", priority: "normal", file: true },
];

const GALLERY = [
  { label: "Sports Day", img: `${IMG}/g-sports.jpg`, tone: "navy" as const, span: "row-span-2 h-[300px]" },
  { label: "Annual Day", img: `${IMG}/g-annual.jpg`, tone: "orange" as const, span: "h-[145px]" },
  { label: "Yoga Activities", img: `${IMG}/g-yoga.jpg`, tone: "lavender" as const, span: "h-[145px]" },
  { label: "Classroom Activities", img: `${IMG}/g-classroom.jpg`, tone: "orange" as const, span: "h-[145px]" },
  { label: "Science Lab", img: `${IMG}/g-lab.jpg`, tone: "navy" as const, span: "h-[145px]" },
  { label: "Library Sessions", img: `${IMG}/g-library.jpg`, tone: "lavender" as const, span: "row-span-2 h-[300px]" },
  { label: "Cultural Programs", img: `${IMG}/g-cultural.jpg`, tone: "orange" as const, span: "h-[145px]" },
  { label: "Student Achievements", img: `${IMG}/g-achievements.jpg`, tone: "navy" as const, span: "h-[145px]" },
];

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
}

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-orange">
      <span className={`h-px w-5 ${light ? "bg-brand-orange/60" : "bg-brand-orange/50"}`} />
      {children}
    </span>
  );
}

function Badge({ cat }: { cat: Cat }) {
  return (
    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wide" style={{ background: CATS[cat].bg, color: CATS[cat].color }}>
      {cat}
    </span>
  );
}

/* ── Live countdown to the next upcoming event ────────────────────────────── */

function Countdown() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const next = useMemo(() => {
    if (now == null) return null;
    const upcoming = EVENTS.map((e) => ({ ...e, t: new Date(e.date + "T09:00:00").getTime() }))
      .filter((e) => e.t >= now)
      .sort((a, b) => a.t - b.t)[0];
    return upcoming ?? null;
  }, [now]);

  if (now == null || !next) {
    return <div className="h-[92px] animate-pulse rounded-2xl bg-white/10" />;
  }

  const diff = Math.max(0, next.t - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const units = [
    { v: d, l: "Days" },
    { v: h, l: "Hrs" },
    { v: m, l: "Min" },
    { v: s, l: "Sec" },
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur">
      <p className="text-[11px] font-bold uppercase tracking-widest text-brand-orange">Next up · {next.title}</p>
      <div className="mt-3 flex gap-2.5">
        {units.map((u) => (
          <div key={u.l} className="flex-1 rounded-xl bg-white/10 py-2.5 text-center">
            <div className="text-[22px] font-extrabold leading-none text-white tabular-nums">{String(u.v).padStart(2, "0")}</div>
            <div className="mt-1 text-[9px] font-semibold uppercase tracking-wider text-white/55">{u.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Interactive calendar ─────────────────────────────────────────────────── */

function Calendar() {
  const [y, setY] = useState(2026);
  const [m, setM] = useState(6); // July (0-indexed)
  const [view, setView] = useState<"month" | "week">("month");
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<"All" | Cat>("All");

  const byDate = useMemo(() => {
    const map = new Map<string, typeof EVENTS>();
    for (const e of EVENTS) {
      if (filter !== "All" && e.cat !== filter) continue;
      const arr = map.get(e.date) ?? [];
      arr.push(e);
      map.set(e.date, arr);
    }
    return map;
  }, [filter]);

  const key = (day: number) => `${y}-${String(m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const firstWd = new Date(y, m, 1).getDay();

  // Week view: the week containing the selected day (or the 1st of the month).
  const weekCells = useMemo(() => {
    const anchor = selected ? new Date(selected + "T00:00:00") : new Date(y, m, 1);
    const start = new Date(anchor);
    start.setDate(anchor.getDate() - anchor.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [selected, y, m]);

  function shiftMonth(dir: number) {
    let nm = m + dir, ny = y;
    if (nm < 0) { nm = 11; ny--; }
    if (nm > 11) { nm = 0; ny++; }
    setM(nm); setY(ny); setSelected(null);
  }

  const monthEvents = useMemo(
    () => [...byDate.entries()].filter(([k]) => k.startsWith(`${y}-${String(m + 1).padStart(2, "0")}`)).flatMap(([, v]) => v).sort((a, b) => a.date.localeCompare(b.date)),
    [byDate, y, m]
  );

  const selectedEvents = selected ? byDate.get(selected) ?? [] : [];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_0.7fr]">
      {/* Calendar panel */}
      <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-card sm:p-7">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button onClick={() => shiftMonth(-1)} aria-label="Previous month" className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 text-brand-navy transition-colors hover:border-brand-orange hover:text-brand-orange">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <h3 className="min-w-[150px] text-center text-[17px] font-extrabold text-brand-ink">{MON_FULL[m]} {y}</h3>
            <button onClick={() => shiftMonth(1)} aria-label="Next month" className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 text-brand-navy transition-colors hover:border-brand-orange hover:text-brand-orange">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><polyline points="9 6 15 12 9 18" /></svg>
            </button>
          </div>
          <div className="flex rounded-full bg-slate-100 p-1 text-[12px] font-bold">
            {(["month", "week"] as const).map((v) => (
              <button key={v} onClick={() => setView(v)} className={`rounded-full px-3.5 py-1.5 capitalize transition-colors ${view === v ? "bg-white text-brand-navy shadow-sm" : "text-slate-500"}`}>{v}</button>
            ))}
          </div>
        </div>

        {/* Weekday header */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {WD.map((d) => <div key={d} className="pb-2 text-[11px] font-bold uppercase tracking-wide text-slate-400">{d}</div>)}
        </div>

        {/* Grid */}
        {view === "month" ? (
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstWd }).map((_, i) => <div key={`b${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
              const k = key(day);
              const evs = byDate.get(k) ?? [];
              const isSel = selected === k;
              return (
                <button
                  key={day}
                  onClick={() => setSelected(isSel ? null : k)}
                  className={`relative flex aspect-square flex-col items-center justify-center rounded-xl text-[13px] transition-colors ${isSel ? "bg-brand-navy text-white" : evs.length ? "bg-brand-orange/10 font-bold text-brand-ink hover:bg-brand-orange/20" : "text-slate-500 hover:bg-slate-50"}`}
                >
                  {day}
                  {evs.length > 0 && (
                    <span className="mt-1 flex gap-0.5">
                      {evs.slice(0, 3).map((e, i) => <span key={i} className="h-1 w-1 rounded-full" style={{ background: isSel ? "#fff" : CATS[e.cat].color }} />)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-1">
            {weekCells.map((d) => {
              const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
              const evs = byDate.get(k) ?? [];
              const isSel = selected === k;
              const dim = d.getMonth() !== m;
              return (
                <button key={k} onClick={() => setSelected(isSel ? null : k)} className={`flex aspect-square flex-col items-center justify-center rounded-xl text-[13px] transition-colors ${isSel ? "bg-brand-navy text-white" : evs.length ? "bg-brand-orange/10 font-bold text-brand-ink" : dim ? "text-slate-300" : "text-slate-500 hover:bg-slate-50"}`}>
                  {d.getDate()}
                  {evs.length > 0 && <span className="mt-1 h-1 w-1 rounded-full" style={{ background: isSel ? "#fff" : CATS[evs[0].cat].color }} />}
                </button>
              );
            })}
          </div>
        )}

        {/* Filter chips */}
        <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
          {(["All", "Events", "Academics", "Sports", "Cultural", "Announcements"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`rounded-full px-3 py-1 text-[11.5px] font-semibold transition-colors ${filter === f ? "bg-brand-navy text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>{f}</button>
          ))}
        </div>
      </div>

      {/* Side list */}
      <div className="rounded-3xl bg-[#f7f8fd] p-5 sm:p-6">
        <h4 className="text-[13px] font-bold uppercase tracking-wide text-brand-navy">
          {selected ? fmt(selected) : `${MON_FULL[m]} events`}
        </h4>
        <div className="mt-4 space-y-3">
          {(selected ? selectedEvents : monthEvents).length === 0 ? (
            <p className="text-[13px] text-brand-muted">No events {selected ? "on this day" : "this month"}.</p>
          ) : (
            (selected ? selectedEvents : monthEvents).map((e) => (
              <div key={e.date + e.title} className="flex gap-3 rounded-xl bg-white p-3 shadow-sm">
                <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg text-center" style={{ background: CATS[e.cat].bg, color: CATS[e.cat].color }}>
                  <span className="text-[15px] font-extrabold leading-none">{new Date(e.date + "T00:00:00").getDate()}</span>
                  <span className="text-[9px] font-bold uppercase">{MON[new Date(e.date + "T00:00:00").getMonth()]}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-[13.5px] font-bold text-brand-ink">{e.title}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-[11.5px] text-brand-muted">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3 w-3" aria-hidden><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                    {e.location}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Featured highlight carousel ──────────────────────────────────────────── */

function Featured() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % FEATURED.length), 6000);
    return () => clearInterval(id);
  }, []);
  const f = FEATURED[i];
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-card-lg">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative min-h-[260px] lg:min-h-[420px]">
          <ImageFrame key={f.img} src={f.img} tone="navy" rounded="rounded-none" className="absolute inset-0 h-full w-full" overlay />
          <span className="absolute left-5 top-5"><Badge cat={f.cat} /></span>
        </div>
        <div className="flex flex-col justify-center p-8 lg:p-12">
          <p className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-brand-orange">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
            {fmt(f.date)}
          </p>
          <h3 className="mt-3 text-2xl font-extrabold leading-tight text-brand-ink lg:text-[2.1rem]">{f.title}</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-brand-muted">{f.desc}</p>
          <div className="mt-7 flex items-center gap-5">
            <Button href="/admissions/enquire-now" size="lg">Read More</Button>
            <div className="flex gap-1.5">
              {FEATURED.map((_, idx) => (
                <button key={idx} onClick={() => setI(idx)} aria-label={`Highlight ${idx + 1}`} className={`h-2 rounded-full transition-all ${idx === i ? "w-6 bg-brand-orange" : "w-2 bg-slate-300 hover:bg-slate-400"}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main ─────────────────────────────────────────────────────────────────── */

export function WhatsOnExperience() {
  const [filter, setFilter] = useState<"All" | Cat>("All");
  const [ticker, setTicker] = useState(0);
  const [sub, setSub] = useState({ name: "", email: "", mobile: "" });
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setTicker((p) => (p + 1) % UPDATES.length), 3500);
    return () => clearInterval(id);
  }, []);

  const shown = filter === "All" ? UPDATES : UPDATES.filter((u) => u.cat === filter);

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-brand-navy">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-orange/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-[#3b46c4]/30 blur-3xl" />
        <Container className="relative py-14 lg:py-20">
          <div className="max-w-3xl">
            <Eyebrow light>News &amp; Events</Eyebrow>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.08] text-white lg:text-[3.4rem]">
              What&apos;s On at <span className="text-brand-orange">Newton&apos;s</span>
            </h1>
            <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-white/75 lg:text-[17px]">
              Stay connected with everything happening across our campus — academic achievements,
              events, competitions, celebrations, announcements and important updates.
            </p>
            {/* Auto-updating latest ticker */}
            <div className="mt-6 inline-flex max-w-full items-center gap-3 overflow-hidden rounded-full border border-white/15 bg-white/[0.06] py-2 pl-2 pr-5 backdrop-blur">
              <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-brand-orange px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> Latest
              </span>
              <span key={ticker} className="truncate text-[13px] text-white/85">{UPDATES[ticker].title}</span>
            </div>
          </div>

          {/* Quick stats */}
          <dl className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur">
                <dt className="text-[28px] font-extrabold leading-none text-white">{s.value}</dt>
                <dd className="mt-1.5 text-[12px] font-medium text-white/60">{s.label}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* ── Featured highlight ── */}
      <section id="featured" className="scroll-mt-24 bg-white py-16 lg:py-20">
        <Container>
          <div className="mb-8 flex items-center justify-between">
            <Eyebrow>Featured Highlight</Eyebrow>
          </div>
          <Featured />
        </Container>
      </section>

      {/* ── Timeline with quick filters ── */}
      <section id="latest-updates" className="scroll-mt-24 py-16 lg:py-24" style={{ background: "#f7f8fd" }}>
        <Container>
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <div className="flex justify-center"><Eyebrow>Latest Updates</Eyebrow></div>
            <h2 className="mt-4 text-3xl font-extrabold text-brand-ink lg:text-4xl">A Timeline of School Life</h2>
          </div>

          {/* Quick filters */}
          <div className="mb-12 flex flex-wrap justify-center gap-2">
            {FILTERS.map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`rounded-full px-4 py-2 text-[12.5px] font-semibold transition-colors ${filter === f ? "bg-brand-navy text-white shadow-card" : "bg-white text-slate-500 hover:bg-slate-100"}`}>{f}</button>
            ))}
          </div>

          {/* Timeline */}
          <div className="relative mx-auto max-w-4xl">
            <div className="absolute left-[19px] top-2 bottom-2 w-[2px] bg-slate-200 lg:left-1/2 lg:-translate-x-1/2" />
            <div className="space-y-6">
              {shown.length === 0 && <p className="py-8 text-center text-[14px] text-brand-muted">No updates in this category yet.</p>}
              {shown.map((u, idx) => {
                const right = idx % 2 === 1;
                return (
                  <div key={u.title} className={`relative flex items-start gap-5 lg:w-1/2 ${right ? "lg:ml-auto lg:flex-row-reverse lg:pl-10 lg:text-right" : "lg:pr-10"}`}>
                    {/* node */}
                    <span className="relative z-10 mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-[#f7f8fd] lg:absolute lg:top-4" style={{ background: CATS[u.cat].color, ...(right ? { left: "-20px" } : { right: "-20px" }) }}>
                      <span className="h-2 w-2 rounded-full bg-white" />
                    </span>
                    <article className="flex-1 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-lg">
                      <ImageFrame src={u.img} tone="navy" rounded="rounded-none" className="h-36 w-full" />
                      <div className="p-5">
                        <div className={`flex items-center gap-2 ${right ? "lg:justify-end" : ""}`}>
                          <Badge cat={u.cat} />
                          <span className="text-[11.5px] text-brand-muted">{fmt(u.date)}</span>
                        </div>
                        <h3 className="mt-2.5 text-[16px] font-bold text-brand-ink">{u.title}</h3>
                        <p className="mt-1.5 text-[13px] leading-relaxed text-brand-muted">{u.desc}</p>
                        <button className={`mt-3 inline-flex items-center gap-1 text-[12px] font-bold uppercase tracking-wide text-brand-navy/70 transition-colors hover:text-brand-orange ${right ? "lg:flex-row-reverse" : ""}`}>
                          View Details
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="h-3 w-3"><polyline points="9 6 15 12 9 18" /></svg>
                        </button>
                      </div>
                    </article>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Calendar ── */}
      <section id="events-calendar" className="scroll-mt-24 bg-white py-16 lg:py-24">
        <Container>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
            <div>
              <Eyebrow>Upcoming Events</Eyebrow>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight text-brand-ink lg:text-4xl">Plan Ahead With Our Calendar</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-brand-muted">
                Browse by month or week, filter by category and never miss a moment that matters.
              </p>
              <div className="mt-6 rounded-3xl bg-brand-navy p-1.5">
                <Countdown />
              </div>
            </div>
            <Calendar />
          </div>
        </Container>
      </section>

      {/* ── Gallery (masonry) ── */}
      <section id="gallery" className="scroll-mt-24 py-16 lg:py-24" style={{ background: "#f7f8fd" }}>
        <Container>
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="flex justify-center"><Eyebrow>School Highlights</Eyebrow></div>
            <h2 className="mt-4 text-3xl font-extrabold text-brand-ink lg:text-4xl">Highlights Gallery</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {GALLERY.map((g) => <ImageFrame key={g.label} src={g.img} caption={g.label} tone={g.tone} className={g.span} />)}
          </div>
        </Container>
      </section>

      {/* ── Achievement spotlight ── */}
      <section id="achievements" className="scroll-mt-24 bg-white py-16 lg:py-24">
        <Container>
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="flex justify-center"><Eyebrow>Achievement Spotlight</Eyebrow></div>
            <h2 className="mt-4 text-3xl font-extrabold text-brand-ink lg:text-4xl">Celebrating Our Stars</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {ACHIEVERS.map((a) => (
              <div key={a.slug} className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-lg">
                <div className="relative h-44">
                  <ImageFrame src={`${IMG}/achiever-${a.slug}.jpg`} tone="navy" rounded="rounded-none" className="absolute inset-0 h-full w-full" />
                  <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-brand-orange text-white shadow-lg">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4"><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" /></svg>
                  </span>
                </div>
                <div className="p-5 text-center">
                  <span className="flex mx-auto -mt-12 mb-3 h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-brand-navy to-[#2b34a0] text-[16px] font-extrabold text-white shadow-card">{initials(a.name)}</span>
                  <h3 className="text-[15px] font-bold text-brand-ink">{a.name}</h3>
                  <p className="text-[11.5px] text-brand-muted">{a.grade}</p>
                  <p className="mt-2 rounded-lg bg-brand-orange/10 px-2 py-1.5 text-[12px] font-semibold text-brand-orange">{a.achievement}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Announcements board ── */}
      <section id="announcements" className="scroll-mt-24 py-16 lg:py-24" style={{ background: "#ECEAFB" }}>
        <Container>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-12">
            <div>
              <Eyebrow>Notice Board</Eyebrow>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight text-brand-ink lg:text-4xl">Latest Announcements</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-brand-muted">
                Official notices, circulars and downloadable documents — all in one place.
              </p>
            </div>
            <div className="divide-y divide-slate-200 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-card">
              {ANNOUNCEMENTS.map((a) => (
                <div key={a.title} className="flex items-center gap-4 p-5 transition-colors hover:bg-slate-50">
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[18px] ${a.priority === "high" ? "bg-red-50" : "bg-slate-100"}`}>📢</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-[14.5px] font-bold text-brand-ink">{a.title}</h3>
                      {a.priority === "high" && <span className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-red-600">Important</span>}
                    </div>
                    <p className="mt-0.5 text-[11.5px] text-brand-muted">{fmt(a.date)}</p>
                  </div>
                  {a.file && (
                    <button className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-[11.5px] font-semibold text-brand-navy transition-colors hover:border-brand-orange hover:text-brand-orange">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                      PDF
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Newsletter ── */}
      <section id="newsletter" className="scroll-mt-24 bg-white py-16 lg:py-24">
        <Container>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-navy to-[#1b2378] px-6 py-12 lg:px-16 lg:py-16">
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-orange/20 blur-3xl" />
            <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
              <div>
                <Eyebrow light>Stay in the Loop</Eyebrow>
                <h2 className="mt-4 text-3xl font-extrabold leading-tight text-white lg:text-4xl">Never Miss an Important School Update</h2>
                <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/70">
                  Subscribe to receive news, event reminders and announcements straight to your inbox.
                </p>
              </div>
              {subscribed ? (
                <div className="flex flex-col items-center justify-center rounded-2xl bg-white/[0.08] p-10 text-center backdrop-blur">
                  <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-brand-orange text-white">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="h-6 w-6"><polyline points="20 6 9 17 4 12" /></svg>
                  </span>
                  <p className="text-[16px] font-bold text-white">You&apos;re subscribed!</p>
                  <p className="mt-1 text-[13px] text-white/70">We&apos;ll keep you posted on everything happening at Newton&apos;s.</p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => { e.preventDefault(); setSubscribed(true); }}
                  className="space-y-3 rounded-2xl bg-white/[0.08] p-6 backdrop-blur"
                >
                  <input required value={sub.name} onChange={(e) => setSub({ ...sub, name: e.target.value })} placeholder="Your name" className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-[14px] text-white placeholder:text-white/45 focus:border-brand-orange focus:outline-none" />
                  <input required type="email" value={sub.email} onChange={(e) => setSub({ ...sub, email: e.target.value })} placeholder="Email address" className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-[14px] text-white placeholder:text-white/45 focus:border-brand-orange focus:outline-none" />
                  <input required type="tel" pattern="[0-9+ ]{7,15}" value={sub.mobile} onChange={(e) => setSub({ ...sub, mobile: e.target.value })} placeholder="Mobile number" className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-[14px] text-white placeholder:text-white/45 focus:border-brand-orange focus:outline-none" />
                  <button type="submit" className="w-full rounded-xl bg-brand-orange px-5 py-3.5 text-[15px] font-bold text-white shadow-cta transition-colors hover:bg-[#e08500]">Subscribe</button>
                  <p className="text-center text-[11px] text-white/50">We respect your privacy. Unsubscribe anytime.</p>
                </form>
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
