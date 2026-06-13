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
    id: "telangana",
    name: "Government of Telangana — School Education Department",
    logo: "/images/accreditations/rte-compliance.png",
    width: 150,
    height: 150,
    caption: "Recognized by the School Education Department, Government of Telangana",
  },
  {
    id: "rte",
    name: "Right to Education (RTE) Compliance",
    logo: "/images/accreditations/telangana-government-recognition.png",
    width: 180,
    height: 180,
    caption: "Committed to the principles of the Right to Education Act",
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
        <h2
          id="accreditations-heading"
          className="text-center font-bold mb-10 text-gray-800"
          style={{
            fontFamily: "var(--font-heading, 'Playfair Display', Georgia, serif)",
            fontSize: "clamp(1.35rem, 2.5vw, 1.875rem)",
          }}
        >
          Accreditations
        </h2>

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