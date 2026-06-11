import type { ReactNode } from "react";
import Link from "next/link";
import { Button } from "~/components/ui/Button";
import { Container } from "~/components/layout/Container";
import { ImageFrame } from "~/components/ui/ImageFrame";
import { FaqExplorer } from "~/components/support/FaqExplorer";

const IMG = "/images/sections/support";

function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-orange">
      <span className={`h-px w-5 ${light ? "bg-brand-orange/60" : "bg-brand-orange/50"}`} />
      {children}
    </span>
  );
}

const TRANSPORT_INFO = ["Route Information", "Pickup & Drop Locations", "Bus Safety Guidelines", "Transport Contact Support", "Emergency Assistance"];
const TRANSPORT_STATS = [
  { v: "15+", l: "Routes" },
  { v: "GPS", l: "Enabled" },
  { v: "100%", l: "Safety First" },
  { v: "Trained", l: "Drivers" },
];
const CAREER_ROLES = ["Teaching Positions", "Administrative Roles", "Academic Coordinators", "Support Staff"];
const CAREER_VALUES = ["Growth", "Learning", "Innovation", "Community"];

export default function SupportPage() {
  return (
    <>
      {/* ── Layer 1 · Visual entry hero ── */}
      <section className="relative overflow-hidden bg-brand-navy">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-orange/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-[#3b46c4]/30 blur-3xl" />
        <Container className="relative grid grid-cols-1 items-center gap-12 py-14 lg:grid-cols-2 lg:py-20">
          <div>
            <Eyebrow light>Support &amp; Opportunities</Eyebrow>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] text-white lg:text-[3.3rem]">
              Everything You Need,<br /><span className="text-brand-orange">All in One Place</span>
            </h1>
            <p className="mt-5 max-w-md text-[16px] leading-relaxed text-white/75 lg:text-[17px]">
              Helping students, parents, educators and future team members navigate transport,
              careers and quick answers — one connected ecosystem.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="#transport" size="lg">Explore Transport</Button>
              <Button href="#careers" size="lg" variant="outline-light">Join Our Team</Button>
              <Button href="#faqs" size="lg" variant="ghost-light" arrow>Browse FAQs</Button>
            </div>
          </div>

          {/* Image collage — one consistent card style (rounded tile + floating label pill) */}
          <div className="relative hidden h-[440px] lg:block">
            {/* Card 1 · Transport (real photo) */}
            <div className="absolute left-0 top-1 h-60 w-72 rotate-[-3deg]">
              <ImageFrame src={`${IMG}/bus.jpg`} tone="orange" className="h-full w-full shadow-2xl ring-1 ring-white/15" />
              <span className="absolute -bottom-3 left-4 inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-[11px] font-bold text-brand-navy shadow-lg">
                🚌 Safe Transport
              </span>
            </div>

            {/* Card 2 · Careers (branded tile — awaiting photo) */}
            <div className="absolute right-0 top-10 h-64 w-56 rotate-[3deg]">
              <div className="flex h-full w-full items-center justify-center rounded-3xl bg-gradient-to-br from-[#0a1270] via-[#141c7a] to-[#060C8B] shadow-2xl ring-1 ring-white/15">
                <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white/10 text-3xl ring-1 ring-white/15">👨‍🏫</span>
              </div>
              <span className="absolute -bottom-3 left-4 inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-[11px] font-bold text-brand-navy shadow-lg">
                🎓 Teaching Careers
              </span>
            </div>

            {/* Card 3 · FAQs (branded tile) */}
            <div className="absolute bottom-1 left-14 h-52 w-64 rotate-[2deg]">
              <div className="flex h-full w-full items-center justify-center rounded-3xl bg-gradient-to-br from-[#F39200] via-[#f7a838] to-[#d97b00] shadow-2xl ring-1 ring-white/15">
                <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white/15 text-3xl ring-1 ring-white/20">❓</span>
              </div>
              <span className="absolute -bottom-3 left-4 inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-[11px] font-bold text-brand-navy shadow-lg">
                ❓ Quick Answers
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Layer 2 · Journey pathway ── */}
      <section className="border-b border-slate-100 bg-white py-10">
        <Container>
          <div className="relative flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-center sm:gap-0">
            {[
              { href: "#transport", icon: "🚌", t: "Transport", d: "Safe daily travel" },
              { href: "#careers", icon: "👨‍🏫", t: "Careers", d: "Shape future minds" },
              { href: "#faqs", icon: "❓", t: "FAQs", d: "Quick answers" },
            ].map((s, i, arr) => (
              <div key={s.t} className="flex items-center sm:flex-1">
                <Link href={s.href} className="group flex flex-1 items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:border-brand-orange/30 hover:shadow-card-lg">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-navy/6 text-2xl">{s.icon}</span>
                  <span>
                    <span className="block text-[15px] font-extrabold text-brand-ink">{s.t}</span>
                    <span className="block text-[12px] text-brand-muted">{s.d}</span>
                  </span>
                </Link>
                {i < arr.length - 1 && (
                  <span className="mx-3 hidden shrink-0 text-slate-300 sm:block">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5"><polyline points="9 6 15 12 9 18" /></svg>
                  </span>
                )}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Subsection 1 · Transport ── */}
      <section id="transport" className="scroll-mt-24 bg-white py-16 lg:py-24">
        <Container>
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="relative">
              <ImageFrame src={`${IMG}/transport.jpg`} label="School Bus" tone="orange" className="h-[360px] lg:h-[460px] shadow-card-lg" />
              {/* floating circular stats */}
              <div className="absolute -bottom-6 left-1/2 flex -translate-x-1/2 gap-3">
                {TRANSPORT_STATS.map((s) => (
                  <div key={s.l} className="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-white shadow-card-lg ring-1 ring-slate-100">
                    <span className="text-[15px] font-extrabold leading-none text-brand-orange">{s.v}</span>
                    <span className="mt-1 text-[9px] font-bold uppercase tracking-wide text-brand-muted">{s.l}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:pt-0 pt-8">
              <Eyebrow>Most Used by Parents</Eyebrow>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight text-brand-ink lg:text-[2.4rem]">Safe &amp; Reliable School Transport</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-brand-muted">
                Ensure safe daily travel with organised routes and closely monitored transportation
                services — so every child reaches school and home securely.
              </p>
              <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {TRANSPORT_INFO.map((t) => (
                  <li key={t} className="flex items-center gap-3 text-[14px] font-medium text-brand-ink">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-orange/15 text-brand-orange">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="h-3.5 w-3.5"><polyline points="20 6 9 17 4 12" /></svg>
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button href="/contact" size="lg" arrow>Check Routes</Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Storytelling transition: road ── */}
      <div aria-hidden className="bg-white">
        <Container>
          <svg viewBox="0 0 1200 60" className="h-12 w-full text-slate-200" fill="none" preserveAspectRatio="none">
            <path d="M0 30 H1200" stroke="currentColor" strokeWidth="3" strokeDasharray="18 14" />
          </svg>
        </Container>
      </div>

      {/* ── Subsection 2 · Careers ── */}
      <section id="careers" className="scroll-mt-24 py-16 lg:py-24" style={{ background: "#060C8B" }}>
        <Container>
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="relative order-2 lg:order-1">
              <ImageFrame src={`${IMG}/careers.jpg`} label="Our Educators" tone="orange" className="h-[360px] lg:h-[460px] shadow-2xl ring-1 ring-white/10" />
              {/* floating keywords */}
              {[
                { t: "Growth", c: "left-2 top-6" },
                { t: "Learning", c: "right-2 top-16" },
                { t: "Innovation", c: "left-4 bottom-10" },
                { t: "Community", c: "right-6 bottom-4" },
              ].map((k) => (
                <span key={k.t} className={`absolute rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold text-brand-navy shadow-lg ${k.c}`}>{k.t}</span>
              ))}
            </div>
            <div className="order-1 lg:order-2">
              <Eyebrow light>Careers</Eyebrow>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight text-white lg:text-[2.4rem]">Shape Future Minds</h2>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/75">
                Join Newton&apos;s High School and become part of a passionate educational community
                dedicated to nurturing confident, capable learners.
              </p>
              <div className="mt-7 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {CAREER_ROLES.map((r) => (
                  <div key={r} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-orange/20 text-brand-orange">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></svg>
                    </span>
                    <span className="text-[14px] font-semibold text-white">{r}</span>
                  </div>
                ))}
              </div>
              <p className="mt-6 flex flex-wrap gap-2">
                {CAREER_VALUES.map((v) => (
                  <span key={v} className="rounded-full border border-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white/70">{v}</span>
                ))}
              </p>
              <div className="mt-8">
                <Button href="/contact" size="lg" arrow>View Open Positions</Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Storytelling transition: bubbles ── */}
      <div aria-hidden className="relative bg-white py-6">
        <Container>
          <div className="flex items-center justify-center gap-2">
            <span className="h-2 w-2 rounded-full bg-slate-200" />
            <span className="h-3 w-3 rounded-full bg-slate-200" />
            <span className="h-4 w-4 rounded-full bg-slate-300" />
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange/15 text-brand-orange">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z" /></svg>
            </span>
          </div>
        </Container>
      </div>

      {/* ── Subsection 3 · FAQs ── */}
      <section id="faqs" className="scroll-mt-24 py-16 lg:py-24" style={{ background: "#f7f8fd" }}>
        <Container>
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <div className="flex justify-center"><Eyebrow>Quick Answers</Eyebrow></div>
            <h2 className="mt-4 text-3xl font-extrabold text-brand-ink lg:text-4xl">Answers for Parents &amp; Students</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-brand-muted">
              Search for a question or browse by category — find what you need in seconds.
            </p>
          </div>
          <FaqExplorer />
        </Container>
      </section>

      {/* ── Need more help ── */}
      <section className="bg-white py-16 lg:py-24">
        <Container>
          <div className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl bg-gradient-to-br from-brand-navy to-[#1b2378] px-8 py-12 text-center lg:py-16">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-orange/20 blur-3xl" />
            <h2 className="relative text-3xl font-extrabold text-white lg:text-4xl">Need More Help?</h2>
            <p className="relative mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-white/75">
              Our team is always ready to assist students, parents and visitors with anything you need.
            </p>
            <div className="relative mt-7 flex justify-center">
              <Button href="/contact" size="lg" arrow>Contact School Office</Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
