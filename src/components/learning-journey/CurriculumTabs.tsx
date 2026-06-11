"use client";

import Image from "next/image";
import { useState } from "react";

export interface CurriculumTab {
  id: string;
  label: string;
  heading: string;
  body: string;
  points: string[];
  image: string;
}

export function CurriculumTabs({ tabs }: { tabs: CurriculumTab[] }) {
  const [activeId, setActiveId] = useState(tabs[0]?.id ?? "");
  const active = tabs.find((t) => t.id === activeId) ?? tabs[0];
  if (!active) return null;

  return (
    <div>
      {/* Tab bar */}
      <div
        className="flex overflow-x-auto border-b border-slate-200"
        style={{ scrollbarWidth: "none" }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveId(tab.id)}
            className={`flex-shrink-0 px-5 py-3.5 text-sm font-medium transition-all duration-200 border-b-2 -mb-px whitespace-nowrap ${
              activeId === tab.id
                ? "text-brand-orange border-brand-orange"
                : "text-slate-600 border-transparent hover:text-brand-navy hover:border-slate-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Image — first on mobile, second on desktop */}
        <div className="relative h-[260px] lg:h-[360px] rounded-2xl overflow-hidden shadow-card-lg order-first lg:order-last">
          <Image
            src={active.image}
            alt={active.heading}
            fill
            className="object-cover transition-all duration-500"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* Text */}
        <div>
          <h3 className="text-xl lg:text-2xl font-extrabold text-brand-ink mb-4 leading-snug">
            {active.heading}
          </h3>
          <p className="text-brand-muted text-[15px] leading-relaxed mb-6">{active.body}</p>
          <ul className="space-y-3">
            {active.points.map((pt, i) => (
              <li key={i} className="flex items-start gap-3 text-[14.5px] text-brand-ink">
                <span className="mt-[6px] h-[7px] w-[7px] shrink-0 rounded-full bg-brand-orange" />
                {pt}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
