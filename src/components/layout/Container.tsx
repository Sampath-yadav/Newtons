// src/components/layout/Container.tsx
import type { HTMLAttributes } from "react";
import { cn } from "~/lib/cn";

/**
 * Container
 * ----------
 * Sets the page max-width and horizontal padding used everywhere on the site.
 * Wrap every section's inner content in this so margins stay consistent.
 */
export function Container({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("w-full px-4 sm:px-6 lg:px-8", className)}
      {...props}
    />
  );
}
