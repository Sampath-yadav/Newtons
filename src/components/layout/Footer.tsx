// src/components/layout/Footer.tsx
import Image from "next/image";
import Link from "next/link";
import { Container } from "./Container";
import { Button } from "../ui/Button";
import { FOOTER_COLUMNS, SITE } from "~/data/navigation";
import { SOCIAL_ICONS } from "../icons";

/**
 * Footer
 * -------
 * Navy background, content columns at top, social pills + copyright /
 * recognition line at the bottom.
 */
export function Footer() {
  return (
    <footer className="bg-brand-navy text-white">
      <Container className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5 lg:gap-10 lg:py-16">
        {/* Column 1 – brand */}
        <div>
          <BrandLockup />
          <p className="mt-6 text-sm text-white/85">{SITE.name}</p>
          <p className="mt-1 text-sm text-white/85">{SITE.tagline}</p>
        </div>

        {/* Columns 2 & 3 – link groups */}
        {FOOTER_COLUMNS.map((col) => (
          <div key={col.heading}>
            <h4 className="mb-5 text-[15px] font-semibold text-white">
              {col.heading}
            </h4>
            <ul className="space-y-3">
              {col.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/85 transition-colors hover:text-brand-orange"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Column 4 – contact */}
        <div>
          <h4 className="mb-5 text-[15px] font-semibold text-white">Contact info</h4>
          <address className="not-italic text-sm leading-relaxed text-white/85">
            {SITE.address.line1}
            <br />
            {SITE.address.line2}
            <br />
            {SITE.address.line3}
          </address>
          <p className="mt-4 text-sm text-white/85">
            {SITE.phones.join(" / ")}
          </p>

          <Link
            href="/contact"
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-white hover:text-brand-orange"
          >
            Contact us
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <polyline points="9 6 15 12 9 18" />
            </svg>
          </Link>

          <div className="mt-4">
            <Button href="/book-a-tour" size="md">
              Book a tour
            </Button>
          </div>
        </div>
      </Container>

      {/* Bottom strip */}
      <Container className="flex flex-col items-start justify-between gap-6 border-t border-white/10 py-6 md:flex-row md:items-center">
        {/* Social */}
        <ul className="flex items-center gap-3">
          {SITE.social.map((s) => {
            const Icon = SOCIAL_ICONS[s.id];
            if (!Icon) return null;
            return (
              <li key={s.id}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={s.id}
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/30 text-white/90 transition hover:border-white hover:bg-white/10 hover:text-white"
                >
                  <Icon width={15} height={15} />
                </a>
              </li>
            );
          })}
        </ul>

        {/* Copyright + official recognition */}
        <p className="text-xs leading-relaxed text-white/60 md:text-right">
          © {new Date().getFullYear()} {SITE.name}, Banswada. All rights reserved.
          <br className="hidden md:block" />{" "}
          School Code: {SITE.schoolCode} · Recognised by the School Education
          Department, Government of Telangana
        </p>
      </Container>
    </footer>
  );
}

function BrandLockup() {
  return (
    // Clip the "NEWTON'S HIGH SCHOOL" text at the bottom of the badge PNG
    <div className="relative h-[54px] w-[60px] shrink-0 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[140%]">
        <Image
          src="/images/school_logo/Newtons_logo.png"
          alt="Newton's High School badge"
          fill
          className="object-contain object-top"
        />
      </div>
    </div>
  );
}
