// src/components/sections/ConfidenceGrowsCTA.tsx
import Image from "next/image";
import Link from "next/link";

/**
 * ConfidenceGrowsCTA
 * -------------------
 * Full-width navy split banner with an SVG arc divider between the left
 * content and the right photo — matching the reference exactly.
 *
 * Arc implementation:
 *   • SVG <clipPath> with clipPathUnits="objectBoundingBox" (coordinates are
 *     fractions of the element, so it scales to any size with no magic numbers).
 *   • A cubic bezier bows the left edge of the photo outward (+5% past the
 *     photo boundary in the middle), creating the smooth convex arc that
 *     separates content from image.
 *
 * Place photo at: public/images/cta-banner/students.jpg
 */
export default function ConfidenceGrowsCTA() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="relative w-full overflow-hidden bg-brand-navy"
    >
      <div className="grid grid-cols-1 md:min-h-[70vh] md:grid-cols-2">

        {/* ── LEFT: Text content ── */}
        <div className="flex flex-col justify-center gap-5 px-6 pb-8 pt-12 sm:px-12 md:gap-6 md:py-14 lg:px-16 xl:px-20">

          {/* Label pill */}
          <span className="inline-block w-fit rounded-full border border-brand-orange/40 bg-white/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-brand-orange sm:px-4 sm:text-xs">
            Newton&apos;s High School
          </span>

          {/* Heading */}
          <h2
            id="cta-heading"
            className="text-[28px] font-bold leading-[1.15] text-white sm:text-4xl lg:text-[2.6rem]"
          >
            Where confidence grows
          </h2>

          {/* Body */}
          <p className="max-w-md text-[15px] leading-relaxed text-white/75 sm:text-base">
            Discover how Newton&apos;s High School empowers students to lead
            their learning through Cambridge and SSC programmes, build skills
            and access top universities around the world.
          </p>

          {/* CTA */}
          <div className="mt-1">
            <Link
              href="/admissions/enquire-now"
              className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-7 py-3 text-sm font-semibold text-white shadow-cta transition-all duration-200 hover:brightness-110 hover:scale-[1.03] active:scale-95"
            >
              Enquire now
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path
                  fillRule="evenodd"
                  d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* ── RIGHT: Photo with perfect circular arc on left edge ──
            ellipse(): horizontal-radius vertical-radius at center-x center-y
            • 65% horizontal radius ≈ matches section height → near-perfect circle arc
            • 100% vertical radius covers full height with no top/bottom clipping
            • Center at (93%, 50%) keeps most of the photo visible
        */}
        <div
          className="relative h-[230px] w-full sm:h-[300px] md:h-auto md:min-h-0
                     md:[clip-path:ellipse(65%_100%_at_93%_50%)]"
        >
          <Image
            src="/images/cta-banner/students.jpg"
            alt="Newton's High School students in the school ground"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center"
          />
          {/* Dark placeholder shown until image is added */}
          <div className="absolute inset-0 -z-10 bg-brand-navy-deep" />
        </div>

      </div>
    </section>
  );
}

export { ConfidenceGrowsCTA };
