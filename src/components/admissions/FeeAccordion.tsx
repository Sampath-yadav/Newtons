"use client";

import { useState } from "react";

const ITEMS = [
  {
    title: "Fee Payment Policy",
    body: "Newton's High School collects school fees on an annual basis. Fee payment schedules and accepted payment methods are confirmed at the time of your child's admission. Parents are requested to ensure fees are paid by the due dates communicated by the school to avoid any disruption to their child's education. For any queries about fee payment timing or methods, please contact the Newton's school office directly on 098660 89343.",
  },
  {
    title: "Transportation Fee",
    body: "The annual bus fee of ₹13,000 applies only to students who choose to use Newton's school bus service. This fee is collected separately from the school tuition fee and is confirmed at the time of registration for the bus service. Specific bus route details, stops, and daily timings are communicated to registered families at the beginning of each academic year. Families who arrange their own transportation are not charged this fee.",
  },
  {
    title: "Uniforms and Textbooks",
    body: "School uniforms, prescribed textbooks, notebooks, and stationery items are not included in Newton's annual school fee. Families are responsible for purchasing these items separately. A complete list of required books and the school uniform specifications is provided to every family at the time of admission confirmation. The Newton's school office can advise parents on local suppliers for both uniform items and prescribed books.",
  },
  {
    title: "Student Activities",
    body: "Participation in Newton's standard school-wide activities and events — including Vana Mahotsavam, annual sports day, cultural celebrations, Teachers' Day, and inter-class competitions — is included within the school fee for all students. Families are not charged separately for these events. Should any optional external educational activity or special programme be organised during the academic year, full details and any associated costs will be communicated to parents clearly and in advance.",
  },
  {
    title: "Admission Guidelines",
    body: "Admission to Newton's High School is subject to seat availability in the relevant class at the time of application. We accept admission enquiries and applications throughout the academic year. Admission is confirmed upon successful completion of the admission process, submission of all required documents, and payment of the applicable school fee. For full guidance on the admission process and required documents, please speak directly with our admissions team or visit Newton's High School, Bodhan Road, Banswada.",
  },
  {
    title: "Refund Policy",
    body: "Fee refund requests are reviewed individually in accordance with Newton's school refund guidelines. Families seeking information about refund eligibility — for example, in the case of a student withdrawing during the academic year — should contact the school office directly. Applicable refund conditions and timelines are communicated clearly at the time of any such request. The school office will handle all refund enquiries promptly and with care.",
  },
  {
    title: "Fee Concessions and Benefits",
    body: "Newton's High School is committed to ensuring that financial circumstances do not prevent deserving students from accessing quality education in Banswada. Fee concession options may be available to eligible students in specific circumstances. Families who wish to enquire about concessions are encouraged to speak directly and confidentially with the school Principal or the admissions team. All concession requests are handled with genuine care, complete discretion, and respect for the family's privacy.",
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
