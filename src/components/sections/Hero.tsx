// src/components/sections/Hero.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { Container } from "../layout/Container";
import { ExpandIcon } from "../icons";

interface HeroProps {
  /** Video path under /public. Place the file at public/videos/hero/campus.mp4 */
  videoSrc?: string;
  title?: string;
  subtitle?: string;
}

/**
 * Hero
 * -----
 * Full-bleed looping background video with a soft dark overlay, centered
 * headline and two CTAs. A scroll cue sits bottom-left and a corner-launcher
 * button bottom-right.
 */
export function Hero({
  videoSrc = "/videos/hero/campus.mp4",
  title = "Knowledge, Perseverance & Excellence",
  subtitle = "Growing the world's most curious, confident minds",
}: HeroProps) {
  // The hero video is large, so only load it on connections that can afford it.
  // Data-saver / 2G–3G visitors get the branded gradient hero instead — saving
  // their data AND the site's Vercel bandwidth budget. Default off so the heavy
  // request is never made during SSR / first paint.
  const [loadVideo, setLoadVideo] = useState(false);
  useEffect(() => {
    type NetInfo = { saveData?: boolean; effectiveType?: string };
    const conn = (navigator as Navigator & { connection?: NetInfo }).connection;
    const slow =
      !!conn &&
      (conn.saveData === true ||
        ["slow-2g", "2g", "3g"].includes(conn.effectiveType ?? ""));
    if (!slow) setLoadVideo(true);
  }, []);

  return (
    <section className="relative isolate overflow-hidden">
      {/* Background video — fills the viewport below the sticky navbar.
          Falls back to a solid brand-navy background when the video isn't loaded. */}
      <div className="relative h-[calc(100dvh-80px)] w-full bg-brand-navy lg:h-[calc(100vh-100px)]">
        {loadVideo && (
          <video
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        {/* Dark overlay for legibility */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/30 to-black/45"
        />
      </div>

      {/* Overlay content */}
      <Container className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
        <h1 className="font-display text-4xl font-bold leading-tight drop-shadow-md sm:text-5xl lg:text-[56px]">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-base text-white/90 sm:text-lg">
          {subtitle}
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Button href="/our-school/why-choose-us" size="lg">
            Why choose us
          </Button>
          <Button href="/contact#enquiry" variant="outline-light" size="lg">
            Book a tour
          </Button>
        </div>
      </Container>

      {/* Bottom-left scroll cue */}
      <button
        type="button"
        aria-label="Scroll to next section"
        onClick={() =>
          typeof window !== "undefined" &&
          window.scrollBy({ top: window.innerHeight * 0.7, behavior: "smooth" })
        }
        className="absolute bottom-5 left-5 z-10 grid h-9 w-9 place-items-center rounded-full border border-white/70 text-white backdrop-blur-sm transition hover:bg-white/15 sm:left-8"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="animate-bob" aria-hidden>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Bottom-right corner launcher */}
      <button
        type="button"
        aria-label="Open immersive view"
        className="absolute bottom-5 right-5 z-10 grid h-9 w-9 place-items-center rounded-full border border-white/70 text-white backdrop-blur-sm transition hover:bg-white/15 sm:right-8"
      >
        <ExpandIcon width={14} height={14} />
      </button>
    </section>
  );
}

export default Hero;
