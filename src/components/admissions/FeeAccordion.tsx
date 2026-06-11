"use client";

import { useState } from "react";

const ITEMS = [
  {
    title: "Fee Payment Policy",
    body: "Annual school fees can be paid as a single lump sum or in two equal installments at the start of each term. All fees must be cleared before the commencement of the academic term. Late payment may attract additional administrative charges.",
  },
  {
    title: "Transportation Fee",
    body: "The school bus facility is available at ₹13,000 per academic year, billed separately from the academic fee. Transportation routes cover key localities in and around the school's service area. Students using the bus facility are required to maintain punctuality and conduct.",
  },
  {
    title: "Uniforms & Textbooks",
    body: "School uniforms, textbooks, notebooks, and stationery are not included in the annual academic fee and must be purchased separately. A comprehensive list of required items will be provided at the time of admission and at the start of each academic year.",
  },
  {
    title: "Student Activities",
    body: "Participation in sports, cultural programs, annual day celebrations, science exhibitions, and inter-school competitions may involve nominal additional charges depending on the activity and the level of participation. Parents will be informed well in advance.",
  },
  {
    title: "Admission Guidelines",
    body: "Admission to all classes is subject to seat availability and fulfilment of the prescribed age and academic criteria. Fresh admissions require a completed application form, previous school records, and a personal interaction with the admissions team at Newton's High School.",
  },
  {
    title: "Refund Policy",
    body: "The registration and admission fees are non-refundable once processed. Annual academic fees are refundable on a pro-rata basis only if a withdrawal request is submitted before the commencement of the academic term. No refunds will be processed after the academic term has begun.",
  },
  {
    title: "Fee Benefits & Concessions",
    body: "Sibling discounts, merit-based scholarships, and need-based fee concessions are available for eligible students. Parents seeking fee benefits are requested to contact the admissions office with supporting documentation. All concessions are subject to availability and management approval.",
  },
];

export function FeeAccordion() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200">
      {ITEMS.map((item, i) => (
        <div key={i}>
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            className="flex w-full items-center justify-between bg-white px-6 py-5 text-left transition-colors duration-150 hover:bg-slate-50"
          >
            <span className="text-[15px] font-semibold text-brand-ink">{item.title}</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`ml-4 h-5 w-5 flex-shrink-0 text-brand-muted transition-transform duration-200 ${open === i ? "rotate-180" : ""}`}
              aria-hidden
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          <div
            className={`overflow-hidden transition-all duration-200 ${open === i ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"}`}
          >
            <div className="border-t border-slate-100 bg-slate-50/60 px-6 py-5">
              <p className="text-[14px] leading-relaxed text-brand-muted">{item.body}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
