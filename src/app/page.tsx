// src/app/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Homepage — all 8 sections assembled in order.
// ─────────────────────────────────────────────────────────────────────────────

import Hero from "~/components/sections/Hero";
import WelcomeFeatures from "~/components/sections/WelcomeFeatures";
import LearningJourney from "~/components/sections/LearningJourney";
import GrowingMinds from "~/components/sections/GrowingMinds";
import AdmissionsJourney from "~/components/sections/AdmissionsJourney";
import WhatMakesGreat from "~/components/sections/WhatMakesGreat";
import ConfidenceGrowsCTA from "~/components/sections/ConfidenceGrowsCTA";
import Accreditations from "~/components/sections/Accreditations";

export default function HomePage() {
  return (
    <main>
      {/* 1 ── Hero: full-screen campus image + headline */}
      <Hero />

      {/* 2 ── Welcome Features: card carousel with brand corner accents */}
      <WelcomeFeatures />

      {/* 3 ── Learning Journey: diagonal-cut stage cards + timeline */}
      <LearningJourney />

      {/* 4 ── Growing Minds: milestone cards + subway-style SVG connector */}
      <GrowingMinds />

      {/* 5 ── Admissions Journey: pill toggle (Indian/International) + step cards */}
      <AdmissionsJourney />

      {/* 6 ── What Makes Newton's Great: principal testimonial + avatar row */}
      <WhatMakesGreat />

      {/* 7 ── Confidence Grows CTA: navy split-banner + lab photo */}
      <ConfidenceGrowsCTA />

      {/* 8 ── Accreditations: white logo strip */}
      <Accreditations />
    </main>
  );
}