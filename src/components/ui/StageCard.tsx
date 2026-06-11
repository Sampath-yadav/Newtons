// src/components/ui/StageCard.tsx
import Image from "next/image";
import Link from "next/link";
import { Card } from "./Card";

interface StageCardProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  /** e.g. "Ages 3.5 - 5.5" */
  ageRange: string;
  body: string;
  /** Destination of the "Discover more" link. */
  href: string;
}

/**
 * StageCard
 * ----------
 * Learning-journey stage card. Photo on top with a diagonal cut on the
 * bottom-right that lets the lavender section background bleed in, then a
 * white body below with navy title + age label + body copy + orange
 * "Discover more" link.
 *
 * The diagonal is achieved with a CSS clip-path on the image wrapper — no
 * extra SVG masks needed.
 */
export function StageCard({
  imageSrc,
  imageAlt,
  title,
  ageRange,
  body,
  href,
}: StageCardProps) {
  return (
    <Card
      padding="sm"
      cornerAccent={false}
      className="flex h-full flex-col overflow-hidden p-0"
    >
      {/* Photo with diagonal-cut bottom-right */}
      <div
        className="relative aspect-[4/3] w-full overflow-hidden"
        // The clip-path leaves a 14% triangle cut from the bottom-right corner
        style={{
          clipPath: "polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%)",
        }}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
          className="object-cover"
        />
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5 pt-4">
        <h3 className="text-[17px] font-bold leading-snug text-brand-ink">
          {title}
        </h3>
        <p className="mt-3 text-[12px] font-semibold uppercase tracking-[0.06em] text-brand-navy/70">
          {ageRange}
        </p>
        <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-brand-navy/85">
          {body}
        </p>
        <Link
          href={href}
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange transition-colors hover:text-[#D67E00]"
        >
          Discover more
          <svg
            width="13"
            height="13"
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
    </Card>
  );
}
