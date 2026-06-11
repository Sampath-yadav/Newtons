// src/components/ui/ToggleGroup.tsx
"use client";

import { cn } from "~/lib/cn";

export interface ToggleOption<V extends string> {
  value: V;
  label: string;
}

interface ToggleGroupProps<V extends string> {
  options: [ToggleOption<V>, ToggleOption<V>];
  value: V;
  onChange: (value: V) => void;
  className?: string;
}

/**
 * ToggleGroup
 * ------------
 * Two-state pill toggle. Left label · navy oval track with a white circular
 * thumb · right label. The thumb slides between the two states.
 *
 * Used on the Admissions journey to switch between Indian and International
 * student flows.
 */
export function ToggleGroup<V extends string>({
  options,
  value,
  onChange,
  className,
}: ToggleGroupProps<V>) {
  const [left, right] = options;
  const isLeft = value === left.value;

  return (
    <div
      role="tablist"
      aria-label="Toggle"
      className={cn("inline-flex items-center gap-3 select-none", className)}
    >
      <button
        type="button"
        role="tab"
        aria-selected={isLeft}
        onClick={() => onChange(left.value)}
        className={cn(
          "text-[12px] font-semibold uppercase tracking-[0.12em] transition-colors",
          isLeft ? "text-brand-navy" : "text-brand-muted hover:text-brand-navy/70",
        )}
      >
        {left.label}
      </button>

      <button
        type="button"
        role="switch"
        aria-checked={!isLeft}
        aria-label={`Toggle between ${left.label} and ${right.label}`}
        onClick={() => onChange(isLeft ? right.value : left.value)}
        className="relative grid h-6 w-12 place-items-center rounded-full bg-brand-navy"
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-300 ease-out",
            isLeft ? "left-0.5" : "left-[26px]",
          )}
        />
      </button>

      <button
        type="button"
        role="tab"
        aria-selected={!isLeft}
        onClick={() => onChange(right.value)}
        className={cn(
          "text-[12px] font-semibold uppercase tracking-[0.12em] transition-colors",
          !isLeft ? "text-brand-navy" : "text-brand-muted hover:text-brand-navy/70",
        )}
      >
        {right.label}
      </button>
    </div>
  );
}