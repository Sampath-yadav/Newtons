"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const STAGES = [
  { label: "Pre-Primary School", href: "/learning-journey/pre-primary", ages: "Ages 3½ – 5½" },
  { label: "Primary School", href: "/learning-journey/primary", ages: "Ages 6 – 11" },
  { label: "Upper Primary School", href: "/learning-journey/upper-primary", ages: "Ages 11 – 14" },
  { label: "Secondary School (SSC)", href: "/learning-journey/secondary-ssc", ages: "Ages 14 – 16" },
];

export function StageNav() {
  const pathname = usePathname();

  return (
    <div className="sticky top-20 z-40 bg-white shadow-sm">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="flex overflow-x-auto border-b border-slate-200"
          style={{ scrollbarWidth: "none" }}
        >
          {STAGES.map((s) => {
            const isActive = pathname === s.href;
            return (
              <Link
                key={s.href}
                href={s.href}
                className={`group relative flex-shrink-0 flex flex-col items-start px-6 py-4 -mb-px border-b-2 transition-all duration-200 ${
                  isActive
                    ? "border-brand-orange"
                    : "border-transparent hover:border-brand-orange/40"
                }`}
              >
                <span
                  className={`whitespace-nowrap text-[13.5px] font-semibold transition-colors ${
                    isActive
                      ? "text-brand-orange"
                      : "text-brand-navy group-hover:text-brand-orange"
                  }`}
                >
                  {s.label}
                </span>
                <span
                  className={`text-xs mt-0.5 transition-colors ${
                    isActive ? "text-brand-orange/70" : "text-brand-muted"
                  }`}
                >
                  {s.ages}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
