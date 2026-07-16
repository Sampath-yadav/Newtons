// src/components/sections/GrowingMinds.tsx
"use client";

import { CarouselArrows } from "../ui/CarouselArrows";
import { Container } from "../layout/Container";
import { MilestoneCard } from "../ui/MilestoneCard";
import { useCarousel } from "~/hooks/useCarousel";
import { GROWING_MILESTONES } from "~/data/growingMilestones";

/**
 * GrowingMinds
 * -------------
 * "Growing curious, confident minds" — left column holds the big navy
 * headline + body paragraph; right column holds the three milestone cards
 * sitting on a horizontal "station" timeline (navy dot + cream halo per
 * card). A next-arrow on the right rail navigates if more cards are added.
 *
 * The timeline is rendered as an absolutely-positioned strip BELOW the row
 * — `bg-white` section keeps the cream halos visible against the page.
 */
export function GrowingMinds() {
  const carousel = useCarousel({ total: GROWING_MILESTONES.length });

  return (
    <section
      className="bg-white py-20 lg:py-32"
      aria-labelledby="growing-minds-heading"
    >
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-12">
          {/* LEFT — headline + intro */}
          <div className="lg:pt-8">
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-brand-orange">
              <span className="inline-block h-px w-5 bg-brand-orange" />
              Our Educational Philosophy
            </p>
            <h2
              id="growing-minds-heading"
              className="text-3xl font-bold leading-tight text-brand-ink sm:text-[36px]"
            >
              Growing curious,
              <br />
              disciplined,
              <br />
              confident minds
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-brand-navy/85">
              We go beyond marks and textbooks. At Newton&apos;s, every child is
              guided to grow in knowledge, in character, and in readiness for the
              world ahead.
            </p>
          </div>

          {/* RIGHT — cards + connector + next arrow */}
          <div className="relative">
            <div className="flex items-stretch gap-4">
              <div
                ref={carousel.trackRef}
                className="flex flex-1 snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {GROWING_MILESTONES.map((m) => (
                  <div
                    key={m.id}
                    className="
                      shrink-0 snap-start
                      basis-[80%]
                      sm:basis-[calc((100%-1.25rem)/2)]
                      lg:basis-[calc((100%-2.5rem)/3)]
                    "
                  >
                    <MilestoneCard
                      imageSrc={m.imageSrc}
                      imageAlt={m.imageAlt}
                      title={m.title}
                      body={m.body}
                      href={m.href}
                    />
                  </div>
                ))}
              </div>

              {/* Right rail next arrow */}
              <div className="hidden self-center lg:flex">
                <CarouselArrows
                  canPrev={carousel.canPrev}
                  canNext={carousel.canNext}
                  onPrev={carousel.prev}
                  onNext={carousel.next}
                  layout="next-only"
                />
              </div>
            </div>

            {/* Timeline connector — a thin line with a "station" under each card */}
            <TimelineConnector count={GROWING_MILESTONES.length} />

            {/* Mobile arrows */}
            <div className="mt-6 flex justify-center lg:hidden">
              <CarouselArrows
                canPrev={carousel.canPrev}
                canNext={carousel.canNext}
                onPrev={carousel.prev}
                onNext={carousel.next}
                layout="both"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/**
 * TimelineConnector
 * ------------------
 * Horizontal navy line spanning the row, with a navy dot + cream halo at the
 * centre of each card slot. Rendered as a flex row so it scales with the
 * card count without any magic numbers.
 */
function TimelineConnector({ count }: { count: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none mt-8 hidden h-8 w-full items-center lg:flex"
    >
      <div className="relative h-px w-full bg-brand-navy/20">
        <div className="absolute inset-0 flex items-center justify-around">
          {Array.from({ length: count }).map((_, i) => (
            <Station key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Station() {
  return (
    <div className="relative flex h-0 w-0 items-center justify-center">
      {/* Cream halo — sits slightly above the line so it reads as a "lamp" */}
      <span
        className="absolute h-7 w-7 -translate-y-1 rounded-full"
        style={{ background: "rgba(252, 229, 194, 0.85)" }}
      />
      {/* Navy dot — sits on the line */}
      <span className="relative h-2 w-2 rounded-full bg-brand-navy" />
    </div>
  );
}

export default GrowingMinds;
