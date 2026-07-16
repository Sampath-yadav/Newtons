// src/components/sections/LearningJourney.tsx
"use client";

import { Button } from "../ui/Button";
import { CarouselArrows } from "../ui/CarouselArrows";
import { CarouselDots } from "../ui/CarouselDots";
import { Container } from "../layout/Container";
import { SectionHeading } from "../layout/SectionHeading";
import { StageCard } from "../ui/StageCard";
import { useCarousel } from "~/hooks/useCarousel";
import { LEARNING_STAGES } from "~/data/learningStages";

/**
 * LearningJourney
 * ----------------
 * "Learning journey" — five stage cards in a horizontal carousel on a
 * lavender background. Two CTAs sit centered below the carousel; the dot
 * pagination floats on the right edge, matching the reference exactly.
 *
 * The cards have a diagonal-cut photo on top (clip-path on the StageCard)
 * that lets the lavender section background bleed through the corner.
 */
export function LearningJourney() {
  const carousel = useCarousel({ total: LEARNING_STAGES.length });

  return (
    <section
      className="bg-brand-lavender py-20 lg:py-32"
      aria-labelledby="learning-journey-heading"
    >
      <Container>
        <SectionHeading
          title="Every Stage of Learning, Handled with Care"
          intro="At Newton's High School, a child's educational journey is carefully designed at every stage — from their very first day of school to the moment they walk out with their SSC results."
          align="center"
          className="mb-10 lg:mb-12"
        />

        {/* Track + right-side next arrow */}
        <div className="flex items-stretch gap-4">
          <div
            ref={carousel.trackRef}
            className="flex flex-1 snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {LEARNING_STAGES.map((s) => (
              <div
                key={s.id}
                className="
                  shrink-0 snap-start
                  basis-[78%]
                  sm:basis-[calc((100%-1.25rem)/2)]
                  lg:basis-[calc((100%-3.75rem)/4)]
                "
              >
                <StageCard
                  imageSrc={s.imageSrc}
                  imageAlt={s.imageAlt}
                  title={s.title}
                  ageRange={s.ageRange}
                  body={s.body}
                  href={s.href}
                />
              </div>
            ))}
          </div>

          {/* Next arrow on the right — vertically centered with the cards */}
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

        {/* Bottom row — CTAs centered, dots on the right rail */}
        <div className="mt-10 grid grid-cols-1 items-center gap-6 lg:grid-cols-[1fr_auto_1fr]">
          {/* Spacer keeps CTAs visually centered while dots sit far-right */}
          <div className="hidden lg:block" />

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button href="/learning-journey" variant="outline-navy" size="md">
              Discover all our educational stages
            </Button>
            <Button href="/admissions/fees" size="md">
              More about our fees
            </Button>
          </div>

          <div className="flex justify-center lg:justify-end">
            <CarouselDots
              count={carousel.pageCount}
              activeIndex={carousel.activeIndex}
              onSelect={carousel.goTo}
            />
          </div>
        </div>

        {/* Mobile-only arrow controls */}
        <div className="mt-6 flex justify-center lg:hidden">
          <CarouselArrows
            canPrev={carousel.canPrev}
            canNext={carousel.canNext}
            onPrev={carousel.prev}
            onNext={carousel.next}
            layout="both"
          />
        </div>
      </Container>
    </section>
  );
}

export default LearningJourney;
