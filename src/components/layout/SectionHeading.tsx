// src/components/layout/SectionHeading.tsx
import type { ReactNode } from "react";
import { cn } from "~/lib/cn";

interface SectionHeadingProps {
  /** Main heading text. */
  title: string;
  /** Optional intro paragraph shown under the title. */
  intro?: ReactNode;
  /** Layout: "left" (Welcome to Manthan School), "center" (Learning journey, etc.) */
  align?: "left" | "center";
  className?: string;
}

/**
 * SectionHeading
 * ---------------
 * Reusable title block. "Welcome to Manthan School" uses align="left" with no
 * intro; "Learning journey", "Admissions journey", "What makes Manthan great?"
 * use align="center" with a paragraph below.
 */
export function SectionHeading({
  title,
  intro,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        align === "center" ? "mx-auto max-w-2xl text-center" : "text-left",
        className,
      )}
    >
      <h2 className="text-2xl font-bold text-brand-ink sm:text-3xl">{title}</h2>
      {intro && (
        <p className="mt-3 text-[15px] leading-relaxed text-brand-navy/80">
          {intro}
        </p>
      )}
    </div>
  );
}
