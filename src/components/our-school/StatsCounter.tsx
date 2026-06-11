"use client";

import { useEffect, useRef, useState } from "react";

export interface StatItem {
  target: number;
  suffix: string;
  prefix?: string;
  label: string;
}

function Counter({ target, suffix, prefix = "", label }: StatItem) {
  const [count, setCount] = useState(0);
  const elRef = useRef<HTMLDivElement>(null);
  const fired = useRef(false);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || fired.current) return;
        fired.current = true;
        observer.disconnect();

        const DURATION = 1800;
        const startTime = performance.now();

        function step(now: number) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / DURATION, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.round(eased * target));
          if (progress < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div
      ref={elRef}
      className="group rounded-2xl bg-white p-7 text-center shadow-card hover:shadow-card-lg hover:-translate-y-1 transition-all duration-300"
    >
      <div className="text-4xl lg:text-5xl font-extrabold text-brand-orange leading-none tabular-nums">
        {prefix}
        {count}
        {suffix}
      </div>
      <div className="mx-auto my-3 h-px w-8 rounded-full bg-slate-200" />
      <p className="text-[13px] text-brand-muted leading-relaxed">{label}</p>
    </div>
  );
}

export function StatsCounter({ stats }: { stats: StatItem[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 max-w-5xl mx-auto">
      {stats.map((stat, i) => (
        <Counter key={i} {...stat} />
      ))}
    </div>
  );
}
