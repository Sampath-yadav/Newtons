// src/components/ui/FeatureCard.tsx
"use client";

import type { ComponentType, ReactNode, SVGProps } from "react";
import Image from "next/image";
import Link from "next/link";
import type { FeatureTheme } from "~/data/welcomeFeatures";

/* ─── Feature Card ──────────────────────────────────────────────────────── */

interface FeatureCardProps {
  /** Unique feature id. */
  id: string;
  /** Icon component rendered inside the floating circle. */
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  /** Body copy — supports inline JSX. */
  body: ReactNode;
  /** Theme colors for the card. */
  theme: FeatureTheme;
  /** Background photo for the card header. */
  imageSrc: string;
  /** "Learn more" destination. */
  href: string;
}

/**
 * FeatureCard (Premium)
 * ─────────────────────
 * Two-zone card matching the reference design:
 *   • Top: Pastel header with floating icon circle + large decorative
 *          background illustration (line-art style, semi-transparent).
 *   • Bottom: White content — bold title, short accent divider line,
 *             body copy, and a "Learn more →" link at the bottom.
 */
export function FeatureCard({
  icon: Icon,
  title,
  body,
  theme,
  imageSrc,
  href,
}: FeatureCardProps) {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-[16px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_12px_32px_-12px_rgba(0,0,0,0.10)] transition-shadow duration-300 hover:shadow-[0_2px_4px_rgba(0,0,0,0.06),0_20px_48px_-16px_rgba(0,0,0,0.16)]">
      {/* ── Header / image banner ──────────────────────────────────────────
          Fixed-height banner so every card is uniform. The whole image is
          shown via object-contain (never cropped); a blurred, zoomed copy of
          the same image fills the empty space edge-to-edge for a premium look
          that works for any aspect ratio. */}
      <div className="relative h-[185px] shrink-0 overflow-hidden sm:h-[200px]">
        {/* Blurred backdrop — same image, scaled & blurred to fill the frame */}
        <Image
          src={imageSrc}
          alt=""
          aria-hidden
          fill
          className="scale-125 object-cover blur-2xl"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
        />
        {/* Soft light scrim so the sharp image and icon stay crisp */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/55 via-white/15 to-white/25" />
        {/* Sharp, fully-visible image */}
        <Image
          src={imageSrc}
          alt=""
          fill
          className="object-contain object-center drop-shadow-[0_6px_16px_rgba(0,0,0,0.14)]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
        />
      </div>

      {/* ── Content zone ───────────────────────────────────────────────── */}
      <div className="relative flex flex-1 flex-col px-5 pb-5 sm:px-6 sm:pb-6">
        {/* Floating icon circle — straddles the image / content boundary */}
        <div
          className="relative z-10 -mt-7 mb-4 flex h-14 w-14 shrink-0 items-center justify-center rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.12)] ring-4 ring-white"
          style={{ backgroundColor: theme.iconBg }}
        >
          <Icon
            width={28}
            height={28}
            style={{ color: theme.iconColor, stroke: theme.iconColor }}
          />
        </div>

        {/* Title */}
        <h3 className="text-[17px] font-bold leading-snug text-brand-ink sm:text-lg">
          {title}
        </h3>

        {/* Accent divider line */}
        <div
          className="mt-2.5 h-[3px] w-8 rounded-full"
          style={{ backgroundColor: theme.accent }}
        />

        {/* Body copy */}
        <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-brand-muted sm:text-sm">
          {body}
        </p>

        {/* Learn more link */}
        <div
          className="mt-5 border-t pt-4"
          style={{ borderColor: "rgba(0,0,0,0.06)" }}
        >
          <Link
            href={href}
            className="inline-flex items-center gap-2 text-sm font-semibold transition-colors duration-200"
            style={{ color: theme.accent }}
          >
            Learn more
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
