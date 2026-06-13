"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "~/components/layout/Container";
import { ImageFrame } from "~/components/ui/ImageFrame";
import { SITE } from "~/data/navigation";

const IMG = "/images/sections/contact";
const ADDRESS = `${SITE.address.line1} ${SITE.address.line2} ${SITE.address.line3}`;
const PHONE = SITE.phones[0];
const EMAIL = "info@newtonshighschool.edu";
// Embedded preview centred on the school in satellite view (matches the live link's 3D/satellite view).
const MAP_SRC = "https://maps.google.com/maps?q=18.3925982,77.8755254(Newton's+High+School)&t=k&z=16&output=embed";
// Full Google Maps destination — opened when the map is clicked.
const MAP_LINK = "https://www.google.com/maps/place/Newtons+High+School/@18.3926055,77.8729831,777m/data=!3m1!1e3!4m7!3m6!1s0x3bce80f347d483d5:0x3a8ca9669cac505a!4b1!8m2!3d18.3925982!4d77.8755254!16s%2Fg%2F11dxlb4qwp?entry=ttu";

/* ── Icons ────────────────────────────────────────────────────────────────── */
const ICON = {
  pin: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></>,
  phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />,
  mail: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 5L2 7" /></>,
  clock: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
  check: <polyline points="20 6 9 17 4 12" />,
};
function Ico({ name, className = "h-5 w-5" }: { name: keyof typeof ICON; className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>{ICON[name]}</svg>;
}
function Eyebrow({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-orange"><span className="h-px w-5 bg-brand-orange/50" />{children}</span>;
}

/* ── Data ─────────────────────────────────────────────────────────────────── */
const QUICK = [
  { icon: "phone" as const, label: "Call Us", value: PHONE, sub: "Mon–Sat, 8 AM – 4 PM", href: `tel:${PHONE.replace(/[^0-9+]/g, "")}` },
  { icon: "mail" as const, label: "Email Us", value: EMAIL, sub: "We reply within 24 hours", href: `mailto:${EMAIL}` },
  { icon: "pin" as const, label: "Visit Us", value: "Tellapur, Hyderabad", sub: "Sangareddy District, 502032", href: "#map" },
];

const USEFUL = [
  { t: "General Information", d: "For any general queries about the school, timings or visits.", phone: PHONE, email: EMAIL },
  { t: "Admission Team", d: "Admissions, eligibility, documents and fee structure.", phone: PHONE, email: "admissions@newtonshighschool.edu" },
  { t: "Careers", d: "Teaching and non-teaching opportunities at Newton's.", email: "careers@newtonshighschool.edu", link: { href: "/support#careers", label: "View open positions" } },
  { t: "Existing Parents", d: "Results, fees, transport and the Parent Portal.", phone: PHONE, link: { href: "/parent-portal/login", label: "Open Parent Portal" } },
  { t: "Transport", d: "Routes, registration and bus safety support.", phone: PHONE, link: { href: "/support#transport", label: "Transport details" } },
];

const AROUND = ["Neighbourhood & residential communities", "Family-friendly activities", "Nearby landmarks & services", "Getting around the area"];

/* ── Component ────────────────────────────────────────────────────────────── */

export function ContactExperience() {
  const [form, setForm] = useState({ first: "", last: "", email: "", mobile: "", address: "", children: "", consent: false });
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: k === "consent" ? (e.target as HTMLInputElement).checked : e.target.value });

  return (
    <>
      {/* ── Header ── */}
      <section className="border-b border-slate-100 bg-white pt-8">
        <Container>
          <ol className="flex items-center gap-1.5 text-sm text-brand-muted">
            <li><Link href="/" className="transition hover:text-brand-navy">Home</Link></li>
            <li className="text-slate-300">›</li>
            <li className="font-semibold text-brand-navy">Contact Us</li>
          </ol>
          <div className="py-10 text-center lg:py-12">
            <div className="flex justify-center"><Eyebrow>We&apos;re Here for You</Eyebrow></div>
            <h1 className="mt-4 text-4xl font-extrabold text-brand-ink lg:text-[3.2rem]">Get in Touch</h1>
            <p className="mt-3 flex items-center justify-center gap-2 text-[14px] text-brand-muted">
              <Ico name="pin" className="h-4 w-4 text-brand-orange" /> {ADDRESS}
            </p>
          </div>
        </Container>
      </section>

      {/* ── Quick contact methods ── */}
      <section className="bg-white py-12 lg:py-16">
        <Container>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {QUICK.map((q) => (
              <a key={q.label} href={q.href} className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-card transition-all hover:-translate-y-1 hover:border-brand-orange/30 hover:shadow-card-lg">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-navy/6 text-brand-navy transition-colors group-hover:bg-brand-navy group-hover:text-white">
                  <Ico name={q.icon} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-brand-orange">{q.label}</span>
                  <span className="block truncate text-[15px] font-bold text-brand-ink">{q.value}</span>
                  <span className="block text-[12px] text-brand-muted">{q.sub}</span>
                </span>
              </a>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Map + form ── */}
      <section id="map" className="scroll-mt-24 bg-white pb-16 lg:pb-24">
        <Container>
          <div className="grid grid-cols-1 overflow-hidden rounded-3xl border border-slate-100 shadow-card-lg lg:grid-cols-2">
            {/* Map — fully interactive (scroll, zoom & pan inside the page) */}
            <div className="relative min-h-[360px] lg:min-h-full">
              <iframe
                title="Newton's High School location"
                src={MAP_SRC}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full"
              />
              {/* Floating shortcut → opens the full Google Maps view in a new tab.
                  Sits above the map but only over its own area, so the rest of the
                  map stays draggable/zoomable. */}
              <a
                href={MAP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open Newton's High School on Google Maps"
                className="group absolute bottom-4 right-4 z-10 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-[13px] font-bold text-brand-navy shadow-lg ring-1 ring-black/5 transition hover:bg-brand-orange hover:text-white"
              >
                <Ico name="pin" className="h-4 w-4" />
                View on Google Maps
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden>
                  <path d="M7 17 17 7M9 7h8v8" />
                </svg>
              </a>
            </div>
            {/* Form */}
            <div className="bg-[#FFFBF5] p-7 sm:p-10">
              {sent ? (
                <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                  <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-orange text-white">
                    <Ico name="check" className="h-8 w-8" />
                  </span>
                  <h2 className="text-2xl font-extrabold text-brand-ink">Thank you, {form.first || "there"}!</h2>
                  <p className="mt-2 max-w-sm text-[14px] text-brand-muted">Your enquiry has reached our team. We&apos;ll be in touch within one working day.</p>
                  <button onClick={() => setSent(false)} className="mt-6 text-[13px] font-bold text-brand-orange hover:underline">Send another message</button>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-extrabold text-brand-ink">We&apos;re here for you</h2>
                    <p className="mt-1 text-[13px] text-brand-muted">Fill in the form and our team will reach out shortly.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="First Name" required><input required value={form.first} onChange={set("first")} placeholder="First name" className={inputCls} /></Field>
                    <Field label="Last Name" required><input required value={form.last} onChange={set("last")} placeholder="Last name" className={inputCls} /></Field>
                    <Field label="Email" required><input required type="email" value={form.email} onChange={set("email")} placeholder="you@email.com" className={inputCls} /></Field>
                    <Field label="Mobile Phone" required><input required type="tel" pattern="[0-9+ ]{7,15}" value={form.mobile} onChange={set("mobile")} placeholder="Phone number" className={inputCls} /></Field>
                  </div>
                  <Field label="Address" required><input required value={form.address} onChange={set("address")} placeholder="Your area / locality" className={inputCls} /></Field>
                  <Field label="Number of Children" required>
                    <select required value={form.children} onChange={set("children")} className={`${inputCls} appearance-none`}>
                      <option value="" disabled>Select…</option>
                      <option>1</option><option>2</option><option>3</option><option>4+</option>
                    </select>
                  </Field>
                  <label className="flex items-start gap-3 text-[12px] leading-relaxed text-brand-muted">
                    <input required type="checkbox" checked={form.consent} onChange={set("consent")} className="mt-0.5 h-4 w-4 shrink-0 accent-brand-orange" />
                    I acknowledge that I&apos;m sharing my contact information with Newton&apos;s High School and consent to being contacted via Phone, SMS, WhatsApp or Email.
                  </label>
                  <button type="submit" className="w-full rounded-xl bg-brand-orange px-5 py-3.5 text-[15px] font-bold text-white shadow-cta transition-colors hover:bg-[#e08500]">Submit Enquiry</button>
                  <p className="text-center text-[11px] text-slate-400">🔒 Your details are kept private and never shared.</p>
                </form>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* ── What's around here ── */}
      <section className="py-16 lg:py-24" style={{ background: "#f7f8fd" }}>
        <Container>
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <ImageFrame src={`${IMG}/neighbourhood.jpg`} label="Our Neighbourhood" tone="navy" className="h-[320px] lg:h-[420px] shadow-card-lg" />
            <div>
              <Eyebrow>The Area</Eyebrow>
              <h2 className="mt-4 text-3xl font-extrabold text-brand-ink lg:text-4xl">What&apos;s Around Here?</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-brand-muted">
                Located in Tellapur, a serene and rapidly developing suburb of Hyderabad, Newton&apos;s
                High School sits within a family-friendly community blending modern conveniences with
                green spaces, gated neighbourhoods and easy access to essential services.
              </p>
              <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {AROUND.map((a) => (
                  <li key={a} className="flex items-center gap-3 text-[14px] font-medium text-brand-ink">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-orange/15 text-brand-orange"><Ico name="check" className="h-3.5 w-3.5" /></span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Useful contacts accordion ── */}
      <section className="bg-white py-16 lg:py-24">
        <Container>
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="flex justify-center"><Eyebrow>Reach the Right Team</Eyebrow></div>
            <h2 className="mt-4 text-3xl font-extrabold text-brand-ink lg:text-4xl">Useful Contacts</h2>
          </div>
          <div className="mx-auto max-w-3xl space-y-3">
            {USEFUL.map((u, i) => {
              const open = openFaq === i;
              return (
                <div key={u.t} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card">
                  <button onClick={() => setOpenFaq(open ? null : i)} className="flex w-full items-center justify-between gap-4 p-5 text-left">
                    <span className="text-[16px] font-bold text-brand-ink">{u.t}</span>
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${open ? "bg-brand-orange text-white" : "bg-slate-100 text-brand-navy"}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className={`h-4 w-4 transition-transform ${open ? "rotate-45" : ""}`}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    </span>
                  </button>
                  <div className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <div className="space-y-3 border-t border-slate-100 p-5">
                        <p className="text-[13.5px] leading-relaxed text-brand-muted">{u.d}</p>
                        <div className="flex flex-wrap gap-2">
                          {u.phone && <a href={`tel:${u.phone.replace(/[^0-9+]/g, "")}`} className="inline-flex items-center gap-2 rounded-lg bg-brand-navy/5 px-3 py-2 text-[13px] font-semibold text-brand-navy hover:bg-brand-navy/10"><Ico name="phone" className="h-4 w-4" />{u.phone}</a>}
                          {u.email && <a href={`mailto:${u.email}`} className="inline-flex items-center gap-2 rounded-lg bg-brand-navy/5 px-3 py-2 text-[13px] font-semibold text-brand-navy hover:bg-brand-navy/10"><Ico name="mail" className="h-4 w-4" />{u.email}</a>}
                          {u.link && <Link href={u.link.href} className="inline-flex items-center gap-1.5 rounded-lg bg-brand-orange/10 px-3 py-2 text-[13px] font-semibold text-brand-orange hover:bg-brand-orange/20">{u.link.label}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="h-3 w-3"><polyline points="9 6 15 12 9 18" /></svg></Link>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ── See learning in action ── */}
      <section className="py-16 lg:py-24" style={{ background: "#ECEAFB" }}>
        <Container>
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold text-brand-ink lg:text-4xl">See Learning in Action</h2>
            <p className="mt-3 text-[15px] text-brand-muted">The best way to know Newton&apos;s is to experience it.</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {[
              { label: "Book a Tour", href: "/admissions/how-to-apply", img: `${IMG}/tour.jpg`, tone: "navy" as const },
              { label: "Enquire Now", href: "/admissions/enquire-now", img: `${IMG}/enquire.jpg`, tone: "orange" as const },
            ].map((c) => (
              <Link key={c.label} href={c.href} className="group relative overflow-hidden rounded-3xl shadow-card-lg">
                <ImageFrame src={c.img} tone={c.tone} rounded="rounded-3xl" className="h-[300px]" overlay />
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl bg-white px-5 py-4 shadow-card">
                  <span className="text-[16px] font-extrabold text-brand-ink">{c.label}</span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange transition-transform group-hover:translate-x-0.5">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="h-4 w-4"><polyline points="9 6 15 12 9 18" /></svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

const inputCls = "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[14px] text-brand-ink placeholder:text-slate-400 focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-semibold text-brand-ink">{label}{required && <span className="text-brand-orange"> *</span>}</span>
      {children}
    </label>
  );
}
