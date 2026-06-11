// src/components/ui/TestimonialCard.tsx
import Image from "next/image";
import Link from "next/link";

export interface TestimonialCardProps {
  quote: string;
  authorName: string;
  authorRole: string;
  imageSrc: string;
  linkLabel?: string;
  linkHref?: string;
}

/**
 * TestimonialCard
 * ----------------
 * White card with a bold quote, author details, an optional CTA link, and a
 * large decorative closing-quote mark in the bottom-right corner.
 */
export function TestimonialCard({
  quote,
  authorName,
  authorRole,
  imageSrc,
  linkLabel = "Meet our team",
  linkHref = "#",
}: TestimonialCardProps) {
  return (
    <div className="relative rounded-2xl border border-slate-100 bg-white p-7 shadow-card lg:p-9">
      {/* Decorative closing-quotes */}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-4 right-6 select-none font-serif text-7xl leading-none text-brand-orange/20"
      >
        &rdquo;
      </span>

      <blockquote>
        <p className="text-base font-bold leading-snug text-brand-ink sm:text-lg">
          {quote}
        </p>

        <footer className="mt-5 flex items-center gap-3">
          {/* Small avatar beside author details */}
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-brand-orange-soft">
            <Image
              src={imageSrc}
              alt={authorName}
              fill
              className="object-cover object-top"
              sizes="40px"
            />
            {/* Initials fallback */}
            <span
              aria-hidden
              className="absolute inset-0 flex items-center justify-center bg-brand-lavender text-sm font-bold text-brand-navy"
            >
              {authorName.charAt(0)}
            </span>
          </div>

          <div>
            <span className="block text-sm font-semibold text-brand-navy">
              {authorName}
            </span>
            <span className="block text-[13px] text-brand-muted">
              {authorRole}
            </span>
          </div>
        </footer>
      </blockquote>

      <Link
        href={linkHref}
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-navy transition hover:text-brand-orange"
      >
        {linkLabel}
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
          <polyline points="9 6 15 12 9 18" />
        </svg>
      </Link>
    </div>
  );
}
