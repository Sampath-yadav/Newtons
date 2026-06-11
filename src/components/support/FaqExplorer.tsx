"use client";

import { useMemo, useState } from "react";

type Cat = "Admissions" | "Transport" | "Academics" | "Examinations" | "General";
const CATEGORIES: Cat[] = ["Admissions", "Transport", "Academics", "Examinations", "General"];
const POPULAR = ["Admissions", "Fee Structure", "Transport", "Examinations", "School Timings", "Uniform"];

const FAQS: { cat: Cat; q: string; a: string }[] = [
  { cat: "Admissions", q: "When do admissions open?", a: "Admissions for 2026–27 open in April with limited seats across all classes. We recommend enquiring early to secure your child's place." },
  { cat: "Admissions", q: "What documents are required?", a: "Birth certificate, the previous report card, a transfer certificate (if applicable), Aadhaar and recent passport-size photographs." },
  { cat: "Admissions", q: "What is the fee structure?", a: "Fees vary by class and are payable quarterly. Please contact the school office for the current fee schedule and payment options." },
  { cat: "Transport", q: "Which areas does transport cover?", a: "We operate 15+ routes across key localities near the school. Check the routes information or contact transport support for your area." },
  { cat: "Transport", q: "Are the buses GPS tracked?", a: "Yes — every bus is GPS-enabled with a trained driver and an attendant on board for the safety of all students." },
  { cat: "Transport", q: "How do I register for transport?", a: "Complete transport registration at the school office during admission, or request it any time through the Parent Portal." },
  { cat: "Academics", q: "Which curriculum do you follow?", a: "The Telangana SSC curriculum, enriched with activity-based and concept-led learning for deeper understanding." },
  { cat: "Academics", q: "What are the school timings?", a: "School runs 8:00 AM to 3:30 PM, Monday to Saturday. Second Saturdays are holidays." },
  { cat: "Academics", q: "What is the medium of instruction?", a: "English is the medium of instruction, with Telugu and Hindi taught as language subjects." },
  { cat: "Examinations", q: "What is the examination pattern?", a: "Continuous assessment with four Formative (FA) and two Summative (SA) examinations across the academic year." },
  { cat: "Examinations", q: "How are results shared?", a: "Results are published on the Parent Portal after each examination, along with detailed subject-wise feedback." },
  { cat: "General", q: "What is the uniform policy?", a: "School uniform is mandatory. Details and approved vendors are shared with families at the time of admission." },
  { cat: "General", q: "Are there extracurricular activities?", a: "Absolutely — clubs, sports, cultural events and leadership programs are an integral part of school life." },
];

export function FaqExplorer() {
  const [cat, setCat] = useState<Cat>("Admissions");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const searching = query.trim().length > 0;
  const results = useMemo(() => {
    if (searching) {
      const q = query.toLowerCase();
      return FAQS.filter((f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q) || f.cat.toLowerCase().includes(q));
    }
    return FAQS.filter((f) => f.cat === cat);
  }, [searching, query, cat]);

  return (
    <div>
      {/* Search-first */}
      <div className="mx-auto max-w-2xl">
        <div className="relative">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a question…"
            className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-14 pr-5 text-[15px] shadow-card focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
          />
          {searching && (
            <button onClick={() => setQuery("")} aria-label="Clear" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-navy">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          )}
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className="text-[12px] font-semibold text-brand-muted">Popular:</span>
          {POPULAR.map((p) => (
            <button key={p} onClick={() => setQuery(p)} className="rounded-full bg-white px-3 py-1.5 text-[12px] font-medium text-brand-navy shadow-sm transition-colors hover:bg-brand-orange hover:text-white">{p}</button>
          ))}
        </div>
      </div>

      {/* Split-screen */}
      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[0.32fr_0.68fr]">
        {/* Categories */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="mb-3 px-1 text-[11px] font-bold uppercase tracking-widest text-brand-muted">{searching ? "Search" : "Categories"}</p>
          <div className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-1.5" style={{ scrollbarWidth: "none" }}>
            {searching ? (
              <div className="rounded-xl bg-brand-orange/10 px-4 py-3 text-[14px] font-bold text-brand-orange">
                {results.length} result{results.length === 1 ? "" : "s"} for “{query}”
              </div>
            ) : (
              CATEGORIES.map((c) => (
                <button key={c} onClick={() => { setCat(c); setOpen(null); }} className={`flex shrink-0 items-center justify-between rounded-xl px-4 py-3 text-left text-[14px] font-semibold transition-colors lg:w-full ${cat === c ? "bg-brand-navy text-white shadow-card" : "bg-white text-brand-ink hover:bg-slate-50"}`}>
                  {c}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={`ml-2 hidden h-3.5 w-3.5 lg:block ${cat === c ? "opacity-100" : "opacity-0"}`}><polyline points="9 6 15 12 9 18" /></svg>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Answers */}
        <div className="space-y-3">
          {results.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
              <p className="text-[15px] font-bold text-brand-ink">No matches found</p>
              <p className="mt-1 text-[13px] text-brand-muted">Try a different keyword, or contact the school office.</p>
            </div>
          ) : (
            results.map((f) => {
              const isOpen = open === f.q;
              return (
                <div key={f.q} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card">
                  <button onClick={() => setOpen(isOpen ? null : f.q)} className="flex w-full items-center justify-between gap-4 p-5 text-left">
                    <span className="flex items-center gap-3">
                      {searching && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-brand-muted">{f.cat}</span>}
                      <span className="text-[15px] font-bold text-brand-ink">{f.q}</span>
                    </span>
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors ${isOpen ? "bg-brand-orange text-white" : "bg-slate-100 text-brand-navy"}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-45" : ""}`}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    </span>
                  </button>
                  <div className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <p className="border-t border-slate-100 p-5 text-[14px] leading-relaxed text-brand-muted">{f.a}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
