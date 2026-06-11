// src/components/ui/Card.tsx
import type { HTMLAttributes } from "react";
import { cn } from "~/lib/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Show the soft cream-orange wedge in the top-left corner. True on every
   * elevated card in the reference (USP, milestone, admission step).
   */
  cornerAccent?: boolean;
  /** Visual size of the card padding. Most sections use "md". */
  padding?: "sm" | "md" | "lg";
}

/**
 * Card
 * -----
 * The base elevated white surface used everywhere on the site. The
 * `cornerAccent` flag toggles the brand-cream wedge that sits behind the
 * top-left content of every feature/stage/milestone/step card.
 *
 * Composes with FeatureCard, StageCard, MilestoneCard, StepCard.
 */
export function Card({
  cornerAccent = true,
  padding = "md",
  className,
  children,
  ...props
}: CardProps) {
  const pads: Record<NonNullable<CardProps["padding"]>, string> = {
    sm: "p-4",
    md: "p-5 lg:p-6",
    lg: "p-6 lg:p-8",
  };

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden rounded-card bg-white shadow-card transition-shadow duration-300 hover:shadow-card-lg",
        cornerAccent && "card-corner-accent",
        pads[padding],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
