// src/components/sections/Accreditations.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Accreditations logo strip — white background, centred heading,
// a horizontal row of partner/accreditation logos that scrolls on mobile.
// Logos: Cambridge International Education, SAP (or similar), Unifrog.
// ─────────────────────────────────────────────────────────────────────────────

import Image from "next/image";

// ─── Data (move to src/data/accreditations.ts if you prefer) ─────────────────
const ACCREDITATIONS = [
  {
    id: "ssc-board",
    name: "Telangana State Board of Secondary Education",
    logo: "/images/accreditations/rte-compliance.png",
    width: 150,
    height: 150,
    caption: "Affiliated to the Telangana State Board, delivering the SSC curriculum from Kindergarten to Grade 10",
  },
  {
    id: "rte",
    name: "Right to Education (RTE) Act Compliance",
    logo: "/images/accreditations/telangana-government-recognition.png",
    width: 180,
    height: 180,
    caption: "Fully committed to inclusive, accessible education as mandated by the Right to Education Act of India",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export function Accreditations() {
  return (
    <section
      aria-labelledby="accreditations-heading"
      className="w-full bg-white py-14 md:py-20"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">

        {/* Section heading */}
        <p className="mb-2 text-center text-[12px] font-semibold uppercase tracking-[0.15em] text-brand-orange">
          Official Recognition
        </p>
        <h2
          id="accreditations-heading"
          className="text-center font-bold text-gray-800"
          style={{
            fontFamily: "var(--font-heading, 'Playfair Display', Georgia, serif)",
            fontSize: "clamp(1.35rem, 2.5vw, 1.875rem)",
          }}
        >
          Accreditations &amp; Recognitions
        </h2>
        <p className="mx-auto mb-10 mt-3 max-w-xl text-center text-[13px] leading-relaxed text-gray-500">
          Recognised by the School Education Department, Government of Telangana
          <span className="mx-1.5 text-gray-300">·</span>
          School Code 36150701951
        </p>

        {/* Logo strip */}
        <div
          className="
            flex flex-wrap items-center justify-center
            gap-x-10 gap-y-4 md:gap-16 lg:gap-20
          "
          role="list"
          aria-label="Accreditation logos"
        >
          {ACCREDITATIONS.map((item) => (
            <div
              key={item.id}
              role="listitem"
              className="flex flex-col items-center gap-2 group"
            >
              {/* Logo — fixed width, auto height so the box hugs the logo
                  (no vertical letterboxing for wide/short marks). */}
              <Image
                src={item.logo}
                alt={item.name}
                width={item.width}
                height={item.height}
                sizes={`${item.width}px`}
                className="h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                style={{ width: item.width }}
              />

              {/* Optional caption beneath logo */}
              {item.caption && (
                <p
                  className="text-center text-xs text-gray-500 max-w-[160px] leading-snug"
                >
                  {item.caption}
                </p>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Accreditations;