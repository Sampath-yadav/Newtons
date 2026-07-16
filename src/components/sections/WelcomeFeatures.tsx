// src/components/sections/WelcomeFeatures.tsx
"use client";

import { Container } from "../layout/Container";
import { SectionHeading } from "../layout/SectionHeading";
import { CarouselArrows } from "../ui/CarouselArrows";
import { CarouselDots } from "../ui/CarouselDots";
import { FeatureCard } from "../ui/FeatureCard";
import { useCarousel } from "~/hooks/useCarousel";
import { WELCOME_FEATURES } from "~/data/welcomeFeatures";

/**
 * WelcomeFeatures
 * ----------------
 * "Welcome to Newton's High School" — five premium USP cards in a horizontal
 * carousel with dot pagination and prev/next arrows.
 *
 * Mobile: cards become a snap-scrolling row (one card per page).
 * Desktop: three cards fit in a single page; arrow navigation lets users
 * browse all five cards smoothly.
 */
export function WelcomeFeatures() {
  const total = WELCOME_FEATURES.length;
  const carousel = useCarousel({ total });

  return (
    <section className="bg-white py-16 lg:py-28" aria-labelledby="welcome-heading">
      <Container>
        {/* Section label + heading + subtitle — matches reference layout */}
        <div className="mb-10 max-w-2xl lg:mb-14">
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-brand-orange">
            <span className="inline-block h-px w-5 bg-brand-orange" />
            Why Families Choose Us
          </p>
          <SectionHeading
            title="Five Reasons Newton's High School Stands Apart"
            intro="We do not just teach subjects. We build character, confidence, and competence in every child who walks through our doors."
            align="left"
          />
        </div>

        {/* Track + arrows on both sides */}
        <div className="flex items-center gap-3 lg:gap-4">
          {/* Prev arrow on the left — desktop only */}
          <div className="hidden self-center lg:flex">
            <CarouselArrows
              canPrev={carousel.canPrev}
              canNext={carousel.canNext}
              onPrev={carousel.prev}
              onNext={carousel.next}
              layout="prev-only"
            />
          </div>

          {/* Scrollable track */}
          <div
            ref={carousel.trackRef}
            className="flex flex-1 snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {WELCOME_FEATURES.map((f) => (
              <div
                key={f.id}
                className="
                  shrink-0 snap-start
                  basis-[85%]
                  sm:basis-[calc((100%-1.25rem)/2)]
                  lg:basis-[calc((100%-2.5rem)/3)]
                "
              >
                <FeatureCard
                  id={f.id}
                  icon={f.icon}
                  title={f.title}
                  body={f.body}
                  theme={f.theme}
                  imageSrc={f.imageSrc}
                  href={f.href}
                />
              </div>
            ))}
          </div>

          {/* Next arrow on the right — desktop only */}
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

        {/* Dot pagination */}
        <CarouselDots
          count={carousel.pageCount}
          activeIndex={carousel.activeIndex}
          onSelect={carousel.goTo}
          className="mt-8"
        />

        {/* Mobile: both arrows centered under the dots */}
        <div className="mt-4 flex justify-center lg:hidden">
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

export default WelcomeFeatures;
