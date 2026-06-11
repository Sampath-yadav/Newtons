"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Container } from "../layout/Container";
import { TESTIMONIALS } from "~/data/testimonials";

export function WhatMakesGreat() {
  const [activeId, setActiveId] = useState(TESTIMONIALS[0].id);
  const activeIdx = TESTIMONIALS.findIndex((t) => t.id === activeId);
  const active = TESTIMONIALS[activeIdx] ?? TESTIMONIALS[0];

  function advance() {
    setActiveId(TESTIMONIALS[(activeIdx + 1) % TESTIMONIALS.length].id);
  }
  function retreat() {
    setActiveId(
      TESTIMONIALS[(activeIdx - 1 + TESTIMONIALS.length) % TESTIMONIALS.length].id
    );
  }

  return (
    <section
      className="relative overflow-hidden py-20 lg:py-32"
      style={{ background: "linear-gradient(180deg,#f8fbff 0%,#ffffff 100%)" }}
      aria-labelledby="what-makes-great-heading"
    >
      {/* Dot pattern — top-right */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-72 w-72 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle,#142f84 1px,transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />
      {/* Soft blob — left */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-brand-navy opacity-[0.04] blur-3xl"
      />

      <Container>
        {/* ── Heading ── */}
        <div className="mb-16 text-center">
          <h2
            id="what-makes-great-heading"
            className="text-[40px] font-extrabold leading-tight tracking-tight text-brand-ink sm:text-[52px] lg:text-[64px]"
          >
            What makes Newton&apos;s great?
          </h2>
          {/* Orange accent underline */}
          <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-brand-orange" />
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-brand-muted sm:text-xl">
            Hear how passionate educators guide every student to excel,{" "}
            <span className="font-semibold text-brand-orange">
              shaping confident leaders, academic achievers and future-ready minds.
            </span>
          </p>
        </div>

        {/* ── Featured testimonial ── */}
        <div className="relative mx-auto max-w-[920px] flex flex-col items-center gap-6 lg:flex-row lg:items-stretch lg:gap-0">

          {/* Prev arrow — desktop left */}
          <button
            type="button"
            aria-label="Previous testimonial"
            onClick={retreat}
            className="absolute left-0 top-1/2 z-20 hidden -translate-x-8 -translate-y-1/2 h-14 w-14 items-center justify-center rounded-full border border-slate-200 bg-white text-brand-navy shadow-sm transition hover:border-brand-navy hover:bg-brand-navy hover:text-white lg:flex"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <polyline points="15 6 9 12 15 18" />
            </svg>
          </button>

          {/* ── Portrait wrapper — badge sits OUTSIDE the circle ── */}
          <div className="relative shrink-0 self-center lg:self-auto" style={{ zIndex: 10 }}>

            {/* Orange quote badge */}
            <div
              aria-hidden
              className="absolute z-20 flex h-[64px] w-[64px] items-center justify-center rounded-full shadow-lg"
              style={{ top: "36px", left: "-18px", background: "#F39200" }}
            >
              <svg width="30" height="30" viewBox="0 0 36 36" fill="none" aria-hidden>
                <path
                  d="M10 22c-3.314 0-6-2.686-6-6 0-3.072 1.747-5.748 4.291-7.094L10 11c-2 1-3 2.5-3 4.5h3V22zm14 0c-3.314 0-6-2.686-6-6 0-3.072 1.747-5.748 4.291-7.094L24 11c-2 1-3 2.5-3 4.5h3V22z"
                  fill="white"
                />
              </svg>
            </div>

            {/* Circle portrait */}
            <div
              className="relative h-[268px] w-[268px] overflow-hidden rounded-full sm:h-[304px] sm:w-[304px] lg:h-[330px] lg:w-[330px]"
              style={{
                border: "4px solid #FCE5C2",
                boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
              }}
            >
              {/* Initials fallback — behind image */}
              <span
                aria-hidden
                className="absolute inset-0 z-0 flex items-center justify-center bg-brand-lavender text-6xl font-bold text-brand-navy"
              >
                {active.authorName.charAt(0)}
              </span>
              <Image
                src={active.imageSrc}
                alt={active.authorName}
                fill
                priority
                className="relative z-10 object-cover object-[center_15%]"
                sizes="(max-width:640px) 268px,(max-width:1024px) 304px,330px"
              />
            </div>
          </div>

          {/* ── Testimonial card — overlaps portrait on desktop ── */}
          <div
            className="relative w-full rounded-[28px] bg-white lg:-ml-[80px]"
            style={{
              boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
              zIndex: 0,
            }}
          >
            <div className="p-8 sm:p-10 lg:pb-10 lg:pl-[110px] lg:pr-16 lg:pt-10">

              {/* Decorative large closing-quote */}
              <span
                aria-hidden
                className="pointer-events-none absolute bottom-4 right-8 select-none font-serif text-[100px] leading-none"
                style={{ color: "rgba(243,146,0,0.09)" }}
              >
                &rdquo;
              </span>

              <blockquote>
                <p
                  className="font-bold leading-snug text-brand-ink"
                  style={{ fontSize: "clamp(1.15rem, 2.2vw, 1.75rem)" }}
                >
                  {active.quote}
                </p>
                <footer className="mt-7">
                  <span className="block text-xl font-bold text-brand-navy">
                    {active.authorName}
                  </span>
                  <span className="mt-1 block text-base text-brand-muted">
                    {active.authorRole}
                  </span>
                </footer>
              </blockquote>

              <Link
                href={active.href}
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-navy transition hover:text-brand-orange"
              >
                {active.linkLabel}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <polyline points="9 6 15 12 9 18" />
                </svg>
              </Link>

              {/* Mobile nav arrows */}
              <div className="mt-6 flex gap-3 lg:hidden">
                <button
                  type="button"
                  aria-label="Previous testimonial"
                  onClick={retreat}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-brand-navy transition hover:bg-brand-navy hover:text-white"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <polyline points="15 6 9 12 15 18" />
                  </svg>
                </button>
                <button
                  type="button"
                  aria-label="Next testimonial"
                  onClick={advance}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-navy text-white transition hover:opacity-90"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <polyline points="9 6 15 12 9 18" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Next arrow — desktop right */}
          <button
            type="button"
            aria-label="Next testimonial"
            onClick={advance}
            className="absolute right-0 top-1/2 z-20 hidden -translate-y-1/2 translate-x-8 h-14 w-14 items-center justify-center rounded-full bg-brand-navy text-white shadow-md transition hover:opacity-90 lg:flex"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <polyline points="9 6 15 12 9 18" />
            </svg>
          </button>
        </div>

        {/* ── Profile circles row ── */}
        <div className="mt-14 flex flex-wrap items-start justify-center gap-8">
          {TESTIMONIALS.map((t) => {
            const isActive = t.id === activeId;
            return (
              <button
                key={t.id}
                type="button"
                aria-label={`${t.authorName}, ${t.chipRole}`}
                aria-pressed={isActive}
                onClick={() => setActiveId(t.id)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  outline: "none",
                  transform: isActive ? "translateY(-4px)" : "translateY(0)",
                  transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                }}
              >
                {/* Circle — only visible element around the photo */}
                <div
                  style={{
                    position: "relative",
                    width: "120px",
                    height: "120px",
                    borderRadius: "9999px",
                    overflow: "hidden",
                    border: isActive ? "3px solid #F39200" : "3px solid #e2e8f0",
                    boxShadow: isActive
                      ? "0 6px 24px rgba(243,146,0,0.30)"
                      : "0 2px 10px rgba(0,0,0,0.10)",
                    transition: "border-color 0.25s, box-shadow 0.3s, transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                    transform: isActive ? "scale(1.10)" : "scale(1)",
                    filter: isActive ? "none" : "grayscale(30%)",
                    opacity: isActive ? 1 : 0.75,
                    flexShrink: 0,
                  }}
                >
                  {/* Initials fallback */}
                  <span
                    aria-hidden
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#e8edf5",
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      color: "#0f2b5b",
                      zIndex: 0,
                    }}
                  >
                    {t.authorName.charAt(0)}
                  </span>
                  <Image
                    src={t.imageSrc}
                    alt={t.authorName}
                    fill
                    sizes="120px"
                    className="object-cover object-[center_15%]"
                    style={{ zIndex: 1 }}
                  />
                </div>

                {/* Name */}
                <span
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: isActive ? "#1F2A66" : "#6B7280",
                    textAlign: "center",
                    lineHeight: 1.3,
                    transition: "color 0.25s",
                  }}
                >
                  {t.authorName}
                </span>

                {/* Role badge */}
                <span
                  style={{
                    padding: "4px 14px",
                    borderRadius: "9999px",
                    fontSize: "0.68rem",
                    fontWeight: 600,
                    background: isActive ? "#F39200" : "#f1f5f9",
                    color: isActive ? "#ffffff" : "#6B7280",
                    transition: "background 0.25s, color 0.25s",
                    whiteSpace: "nowrap",
                    marginTop: "-2px",
                  }}
                >
                  {t.chipRole}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Pagination dots ── */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {TESTIMONIALS.map((t) => {
            const isActive = t.id === activeId;
            return (
              <button
                key={t.id}
                type="button"
                aria-label={`Go to ${t.authorName}`}
                onClick={() => setActiveId(t.id)}
                style={{
                  width: isActive ? "28px" : "10px",
                  height: "10px",
                  borderRadius: "9999px",
                  background: isActive ? "#142f84" : "#d9d9d9",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              />
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export default WhatMakesGreat;
