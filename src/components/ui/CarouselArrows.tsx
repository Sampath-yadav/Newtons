// src/components/ui/CarouselArrows.tsx
import { cn } from "~/lib/cn";

interface CarouselArrowsProps {
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  /** Both arrows together vs only one (e.g. when one sits outside the section). */
  layout?: "both" | "next-only" | "prev-only";
  className?: string;
}

/**
 * CarouselArrows
 * ---------------
 * Circular outlined arrow buttons. The reference shows a single › arrow on
 * the right of each carousel; we default to "next-only" and let sections
 * opt into "both" if they want left+right.
 */
export function CarouselArrows({
  canPrev,
  canNext,
  onPrev,
  onNext,
  layout = "next-only",
  className,
}: CarouselArrowsProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {layout !== "next-only" && (
        <ArrowButton dir="prev" disabled={!canPrev} onClick={onPrev} />
      )}
      {layout !== "prev-only" && (
        <ArrowButton dir="next" disabled={!canNext} onClick={onNext} />
      )}
    </div>
  );
}

function ArrowButton({
  dir,
  disabled,
  onClick,
}: {
  dir: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={dir === "next" ? "Next" : "Previous"}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "grid h-10 w-10 place-items-center rounded-full border border-brand-navy/25 bg-white text-brand-navy transition-all duration-200",
        "hover:border-brand-navy hover:bg-brand-navy hover:text-white",
        "disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-300 disabled:hover:bg-slate-50 disabled:hover:text-slate-300",
      )}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        {dir === "next" ? (
          <polyline points="9 6 15 12 9 18" />
        ) : (
          <polyline points="15 6 9 12 15 18" />
        )}
      </svg>
    </button>
  );
}
