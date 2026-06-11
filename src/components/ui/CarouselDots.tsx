// src/components/ui/CarouselDots.tsx
import { cn } from "~/lib/cn";

interface CarouselDotsProps {
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
  className?: string;
}

/**
 * CarouselDots
 * -------------
 * Orange dot pagination strip — active dot is solid brand-orange and slightly
 * wider, inactive dots are pale orange circles. Used wherever the reference
 * shows a row of dots under a carousel.
 */
export function CarouselDots({
  count,
  activeIndex,
  onSelect,
  className,
}: CarouselDotsProps) {
  return (
    <div
      className={cn("flex items-center justify-center gap-2", className)}
      role="tablist"
      aria-label="Pagination"
    >
      {Array.from({ length: count }).map((_, i) => {
        const active = i === activeIndex;
        return (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={active}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => onSelect(i)}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              active
                ? "w-5 bg-brand-orange"
                : "w-2 bg-brand-orange/30 hover:bg-brand-orange/60",
            )}
          />
        );
      })}
    </div>
  );
}
