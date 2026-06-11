// src/components/ui/MilestoneCard.tsx
import Image from "next/image";
import Link from "next/link";
import { Card } from "./Card";

interface MilestoneCardProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  body: string;
  href: string;
}

/**
 * MilestoneCard
 * --------------
 * "Growing curious, confident minds" card — photo on top, title + body below,
 * and a small orange "›" arrow button anchored to the bottom-right. Used in
 * the right column of the GrowingMinds section.
 *
 * Unlike StageCard, the photo is rectangular (no diagonal clip), and there's
 * no "Discover more" text — just the arrow.
 */
export function MilestoneCard({
  imageSrc,
  imageAlt,
  title,
  body,
  href,
}: MilestoneCardProps) {
  return (
    <Card
      padding="sm"
      cornerAccent={false}
      className="flex h-full flex-col overflow-hidden p-0"
    >
      <div className="relative aspect-[5/3] w-full overflow-hidden">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(min-width: 1024px) 22vw, (min-width: 640px) 40vw, 90vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-[16px] font-bold leading-snug text-brand-ink">
          {title}
        </h3>
        <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-brand-navy/85">
          {body}
        </p>

        <div className="mt-4 flex justify-end">
          <Link
            href={href}
            aria-label={`Read more about ${title}`}
            className="grid h-8 w-8 place-items-center rounded-full text-brand-orange transition-colors hover:bg-brand-orange/10"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="13 6 19 12 13 18" />
            </svg>
          </Link>
        </div>
      </div>
    </Card>
  );
}
