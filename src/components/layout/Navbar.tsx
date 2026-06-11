// src/components/layout/Navbar.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Container } from "./Container";
import { Button } from "../ui/Button";
import {
  ChevronDownIcon,
  CloseIcon,
  MenuIcon,
  PinIcon,
  UserIcon,
} from "../icons";
import { MEGA_MENUS, COMMON_NAV_ITEMS, PORTAL_LINKS } from "~/data/navigation";

// ── Portal meta ───────────────────────────────────────────────────────────────

const PORTAL_META: Record<string, { desc: string; color: string; bg: string }> = {
  "Parent Portal": {
    desc: "View your child's exam results, attendance, and academic updates",
    color: "text-brand-navy",
    bg: "bg-[#EEF0FB]",
  },
  "Teacher Login": {
    desc: "Upload & submit mark sheets, manage examinations and student records",
    color: "text-brand-orange",
    bg: "bg-[#FFF4E3]",
  },
  "Admin Login": {
    desc: "Approve results, manage users, and oversee school operations",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
  },
};

// Short, scannable portal descriptions for the compact mobile cards.
const PORTAL_SHORT: Record<string, string> = {
  "Parent Portal": "Results, attendance & updates",
  "Teacher Login": "Mark sheets & student records",
  "Admin Login": "Manage users & operations",
};

const PORTAL_FEATURES = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    title: "Secure Access",
    desc: "Your data is always safe with us",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: "24/7 Availability",
    desc: "Access information anytime, anywhere",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
    title: "Instant Updates",
    desc: "Stay informed with real-time notifications",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: "Need Help?",
    desc: "Contact our support team anytime",
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export function Navbar() {
  const [openKey, setOpenKey] = useState<string | null>(null);
  // Mobile nav drawer (hamburger) — `open` controls DOM presence, `shown`
  // drives the enter/exit transition.
  const [navOpen, setNavOpen] = useState(false);
  const [navShown, setNavShown] = useState(false);
  // Mobile portals sheet (person icon, top-right).
  const [portalOpen, setPortalOpen] = useState(false);
  const [portalShown, setPortalShown] = useState(false);

  // Drill-down sub-panel inside the nav drawer (`subKey` = content,
  // `subShown` = slide state so it animates both ways).
  const [subKey, setSubKey] = useState<string | null>(null);
  const [subShown, setSubShown] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const navTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const subTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const portalTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function openNav() {
    if (navTimer.current) clearTimeout(navTimer.current);
    setOpenKey(null);
    closePortal();
    setSubShown(false);
    setSubKey(null);
    setNavOpen(true);
    requestAnimationFrame(() => setNavShown(true));
  }
  function closeNav() {
    setNavShown(false);
    navTimer.current = setTimeout(() => {
      setNavOpen(false);
      setSubShown(false);
      setSubKey(null);
    }, 300);
  }
  function openSub(key: string) {
    if (subTimer.current) clearTimeout(subTimer.current);
    setSubKey(key);
    requestAnimationFrame(() => setSubShown(true));
  }
  function closeSub() {
    setSubShown(false);
    subTimer.current = setTimeout(() => setSubKey(null), 300);
  }
  function openPortal() {
    if (portalTimer.current) clearTimeout(portalTimer.current);
    setOpenKey(null);
    setPortalOpen(true);
    requestAnimationFrame(() => setPortalShown(true));
  }
  function closePortal() {
    setPortalShown(false);
    portalTimer.current = setTimeout(() => setPortalOpen(false), 300);
  }

  // Close desktop mega-menus when clicking outside the header.
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenKey(null);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  // Close mobile overlays on resize-to-desktop.
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) {
        setNavShown(false);
        setNavOpen(false);
        setPortalShown(false);
        setPortalOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // While any mobile overlay is open: lock body scroll + allow Escape to close.
  useEffect(() => {
    if (!navOpen && !portalOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closePortal();
        closeNav();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [navOpen, portalOpen]);

  const activeMenu = MEGA_MENUS.find((m) => m.key === openKey) ?? null;
  const portalsOpen = openKey === "portals";

  function toggle(key: string) {
    setOpenKey((prev) => (prev === key ? null : key));
    setNavShown(false);
    setNavOpen(false);
    setPortalShown(false);
    setPortalOpen(false);
  }

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-50 border-b border-slate-200/70 bg-white"
      >
        {/* ── Mobile top bar: logo left · name centre · person icon right ── */}
        <Container className="relative flex h-16 items-center justify-between px-4 lg:hidden">
          <Link href="/" aria-label="Newton's High School home" className="flex items-center">
            <BrandNewtons />
          </Link>

          <Link
            href="/"
            aria-label="Newton's High School home"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <BrandNameLogo />
          </Link>

          <button
            type="button"
            aria-label="Portals — access your account"
            aria-expanded={portalOpen}
            onClick={() => (portalOpen ? closePortal() : openPortal())}
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full text-brand-navy transition-colors hover:bg-slate-100 active:bg-slate-200"
          >
            <UserIcon width={26} height={26} />
          </button>
        </Container>

        {/* ── Desktop bar ── */}
        <Container className="hidden h-[80px] items-center px-6 lg:flex">
          {/* Left: logos */}
          <div className="flex shrink-0 items-center">
            <Link href="/" className="flex items-center gap-1" aria-label="Newton's High School home">
              <BrandNewtons />
              <BrandNameLogo />
            </Link>
          </div>

          <span className="mx-6 h-10 w-px shrink-0 bg-slate-200" />

          {/* Desktop nav */}
          <nav className="flex flex-1 items-center justify-center gap-20" aria-label="Primary">
            {MEGA_MENUS.map((item) => {
              const isOpen = openKey === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => toggle(item.key)}
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  className="group relative flex items-center justify-center py-3 focus-visible:outline-none"
                >
                  <span
                    className={`whitespace-nowrap text-[15px] font-semibold transition-all duration-200 ease-out group-hover:-translate-y-[9px] group-hover:text-brand-orange ${isOpen ? "-translate-y-[9px] text-brand-orange" : "text-brand-navy"
                      }`}
                  >
                    {item.label}
                  </span>
                  <span
                    className={`pointer-events-none absolute top-1/2 mt-1 whitespace-nowrap text-[12px] text-brand-muted transition-all duration-200 ease-out group-hover:translate-y-0 group-hover:opacity-100 ${isOpen ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
                      }`}
                  >
                    {item.subtitle}
                  </span>
                </button>
              );
            })}
          </nav>

          <span className="mx-6 h-10 w-px shrink-0 bg-slate-200" />

          {/* Right: CTA + icons */}
          <div className="flex shrink-0 items-center gap-3">
            <Button href="/admissions" size="sm">
              Enquire now
            </Button>
            <button
              type="button"
              aria-label="Choose location"
              className="inline-flex h-9 items-center gap-1 rounded-full px-2 text-brand-navy hover:bg-slate-100"
            >
              <PinIcon />
              <ChevronDownIcon width={12} height={12} />
            </button>
            <button
              type="button"
              aria-label="Portals"
              aria-expanded={portalsOpen}
              aria-haspopup="true"
              onClick={() => toggle("portals")}
              className={`relative inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors ${portalsOpen ? "bg-brand-navy text-white" : "text-brand-navy hover:bg-slate-100"
                }`}
            >
              <UserIcon />
            </button>
          </div>
        </Container>

        {/* ── Standard mega-menu panel (desktop) ── */}
        {activeMenu && (
          <div className="hidden border-t border-slate-200/60 lg:block" style={{ background: "#f8f9fb" }}>
            {/* Smooth curved edge for the mega-menu image (objectBoundingBox = scales with the element) */}
            <svg width="0" height="0" className="absolute" aria-hidden focusable="false">
              <defs>
                <clipPath id="megaImageCurve" clipPathUnits="objectBoundingBox">
                  <path d="M0,0 L0.80,0 C0.965,0.20 0.965,0.80 0.80,1 L0,1 Z" />
                </clipPath>
              </defs>
            </svg>
            <div className="relative flex" style={{ minHeight: "340px", maxHeight: "420px" }}>
              <div
                className="relative shrink-0 overflow-hidden"
                style={{
                  width: "40%",
                  clipPath: "url(#megaImageCurve)",
                  WebkitClipPath: "url(#megaImageCurve)",
                }}
              >
                <Image
                  src={activeMenu.imageSrc}
                  alt={activeMenu.label}
                  fill
                  className="object-cover object-center"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />
              </div>

              <div className="flex flex-1 flex-col justify-center px-10 py-8">
                <Link
                  href={activeMenu.href}
                  onClick={() => setOpenKey(null)}
                  className="group/title inline-block"
                >
                  <h3 className="text-2xl font-extrabold text-brand-navy underline decoration-brand-navy/0 transition hover:decoration-brand-orange group-hover/title:text-brand-orange">
                    {activeMenu.label}
                  </h3>
                </Link>
                <p className="mb-7 mt-1 text-sm text-brand-muted">{activeMenu.description}</p>
                <ul className="space-y-4">
                  {activeMenu.items.map((sub) => (
                    <li key={sub.href}>
                      <Link
                        href={sub.href}
                        onClick={() => setOpenKey(null)}
                        className="group/link flex items-center gap-3 text-[15px] font-medium text-brand-navy transition hover:text-brand-orange"
                      >
                        <span
                          className="block h-[1.5px] shrink-0 rounded-full bg-slate-300 transition-all duration-200 group-hover/link:w-7 group-hover/link:bg-brand-orange"
                          style={{ width: "20px" }}
                        />
                        {sub.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className="flex flex-col justify-center border-l border-slate-200/70 px-8 py-8"
                style={{ width: "210px", flexShrink: 0 }}
              >
                <ul className="space-y-3.5">
                  {COMMON_NAV_ITEMS.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setOpenKey(null)}
                        className="text-[13.5px] text-slate-600 transition hover:text-brand-orange"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ── Portals mega-menu panel (desktop) ── */}
        {portalsOpen && (
          <div className="hidden border-t border-slate-200/60 bg-white lg:block">
            <div className="flex" style={{ minHeight: "300px" }}>
              <div
                className="flex flex-col justify-center bg-[#f8f9fb] px-12 py-10"
                style={{ width: "34%", flexShrink: 0 }}
              >
                <span className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-brand-orange">
                  Portals
                </span>
                <h2 className="text-[28px] font-extrabold leading-tight text-brand-navy">
                  Access your<br />account
                </h2>
                <p className="mt-4 max-w-[220px] text-[13.5px] leading-relaxed text-slate-500">
                  Choose the portal that suits you to access information quickly and easily.
                </p>
              </div>

              <div className="flex flex-1 flex-col divide-y divide-slate-100">
                {PORTAL_LINKS.map((p) => {
                  const meta = PORTAL_META[p.label];
                  return (
                    <Link
                      key={p.label}
                      href={p.href}
                      onClick={() => setOpenKey(null)}
                      className="group flex flex-1 items-center gap-5 px-10 py-0 transition-colors hover:bg-slate-50"
                    >
                      <span
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${meta.bg} transition-transform duration-200 group-hover:scale-110`}
                      >
                        <span className={meta.color}>
                          <PortalIcon type={p.icon} size={20} />
                        </span>
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className={`block text-[15px] font-bold leading-snug transition-colors group-hover:opacity-80 ${meta.color}`}>
                          {p.label}
                        </span>
                        <span className="mt-0.5 block text-[13px] leading-snug text-slate-500">
                          {meta.desc}
                        </span>
                      </span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`shrink-0 transition-all duration-200 group-hover:translate-x-1 ${meta.color} opacity-40 group-hover:opacity-100`}
                        aria-hidden
                      >
                        <polyline points="9 6 15 12 9 18" />
                      </svg>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-slate-100 bg-[#f8f9fb]">
              <div className="mx-auto grid max-w-[66%] grid-cols-4 divide-x divide-slate-200/80 py-0" style={{ marginLeft: "34%" }}>
                {PORTAL_FEATURES.map((f) => (
                  <div key={f.title} className="flex items-center gap-3 px-6 py-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EEF0FB] text-brand-navy">
                      {f.icon}
                    </span>
                    <span>
                      <span className="block text-[12.5px] font-bold text-brand-navy">{f.title}</span>
                      <span className="block text-[11px] leading-tight text-slate-500">{f.desc}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ── Mobile nav drawer (white) — sits between top header and bottom bar ── */}
      {navOpen && (
        <div
          className="fixed inset-x-0 top-20 bottom-[64px] z-40 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div
            className={`flex h-full flex-col bg-white transition-all duration-300 ease-out ${navShown ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
              }`}
          >
            {/* Sliding track: pane 1 = top-level list, pane 2 = sub-items */}
            <div className="flex-1 overflow-hidden">
              <div
                className={`flex h-full w-[200%] transition-transform duration-300 ease-out ${subShown ? "-translate-x-1/2" : "translate-x-0"
                  }`}
              >
                {/* ── Pane 1: top-level navigation ── */}
                <div className="h-full w-1/2 overflow-y-auto overscroll-contain">
                  <nav aria-label="Primary mobile" className="px-5 pt-2">
                    <ul>
                      {MEGA_MENUS.map((item) => (
                        <li key={item.key} className="border-b border-slate-100 last:border-0">
                          <button
                            type="button"
                            onClick={() => openSub(item.key)}
                            aria-haspopup="true"
                            aria-expanded={subKey === item.key}
                            className="flex w-full items-center justify-between gap-3 py-4 text-left transition-opacity active:opacity-70"
                          >
                            <span className="min-w-0">
                              <span className="block text-[18px] font-bold text-brand-navy">{item.label}</span>
                              <span className="mt-0.5 block text-[13px] text-brand-muted">{item.subtitle}</span>
                            </span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-brand-navy" aria-hidden>
                              <polyline points="9 6 15 12 9 18" />
                            </svg>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </nav>

                  {/* Quick links — light-grey footer block */}
                  <div className="mt-2 bg-slate-50 px-5 py-6">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3.5">
                      {COMMON_NAV_ITEMS.map((l) => (
                        <Link
                          key={l.href}
                          href={l.href}
                          onClick={closeNav}
                          className="text-[14px] font-medium text-brand-navy underline decoration-slate-300 underline-offset-4 hover:decoration-brand-orange"
                        >
                          {l.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── Pane 2: drilled-in sub-section ── */}
                <div className="h-full w-1/2 overflow-y-auto overscroll-contain">
                  {(() => {
                    const sub = MEGA_MENUS.find((m) => m.key === subKey);
                    if (!sub) return null;
                    return (
                      <div className="flex min-h-full flex-col">
                        {/* Back + section title */}
                        <div className="px-5 pt-3">
                          <button
                            type="button"
                            onClick={closeSub}
                            className="-ml-1 mb-2 inline-flex items-center gap-1.5 rounded-lg py-1 pr-2 text-[13px] font-semibold text-brand-orange active:opacity-70"
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                              <polyline points="15 18 9 12 15 6" />
                            </svg>
                            Back
                          </button>
                          <Link
                            href={sub.href}
                            onClick={closeNav}
                            className="inline-block text-[20px] font-extrabold text-brand-navy underline decoration-brand-orange/40 underline-offset-4 hover:decoration-brand-orange"
                          >
                            {sub.label}
                          </Link>
                          <p className="mt-0.5 text-[13px] text-brand-muted">{sub.subtitle}</p>
                        </div>

                        {/* Sub-item links */}
                        <ul className="mt-3 px-5">
                          {sub.items.map((s) => (
                            <li key={s.href} className="border-b border-slate-100 last:border-0">
                              <Link
                                href={s.href}
                                onClick={closeNav}
                                className="group flex items-center gap-3 py-3.5 active:opacity-70"
                              >
                                <span className="block h-[2px] w-4 shrink-0 rounded-full bg-slate-300 transition-all duration-200 group-hover:w-6 group-hover:bg-brand-orange" />
                                <span className="text-[15px] font-medium text-brand-navy">{s.label}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>

                        {/* Contextual image */}
                        <div className="relative mt-6 min-h-[170px] flex-1 overflow-hidden">
                          <Image
                            src={sub.imageSrc}
                            alt={sub.label}
                            fill
                            className="object-cover object-center"
                            style={{
                              clipPath: "polygon(0 14%, 100% 0, 100% 100%, 0 100%)",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile portals sheet (white) — opened by the top-right person icon ── */}
      {portalOpen && (
        <div className="fixed inset-0 z-[55] lg:hidden" role="dialog" aria-modal="true" aria-label="Portals">
          <button
            type="button"
            aria-label="Close portals"
            onClick={closePortal}
            className={`absolute inset-0 cursor-default bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 ${portalShown ? "opacity-100" : "opacity-0"
              }`}
          />
          <div
            className={`absolute inset-x-0 bottom-0 rounded-t-3xl bg-white p-5 shadow-2xl transition-transform duration-300 ease-out ${portalShown ? "translate-y-0" : "translate-y-full"
              }`}
            style={{ paddingBottom: "calc(72px + env(safe-area-inset-bottom))" }}
          >
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-slate-200" />
            <div className="mb-1 flex items-center justify-between">
              <h3 className="text-[16px] font-extrabold text-brand-navy">Access your account</h3>
              <button
                type="button"
                aria-label="Close"
                onClick={closePortal}
                className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <CloseIcon width={16} height={16} />
              </button>
            </div>
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.15em] text-brand-orange">
              Portals
            </p>
            <div className="space-y-2.5">
              {PORTAL_LINKS.map((p) => {
                const meta = PORTAL_META[p.label];
                return (
                  <Link
                    key={p.label}
                    href={p.href}
                    onClick={closePortal}
                    className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm transition-transform active:scale-[0.99]"
                  >
                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${meta.bg} ${meta.color}`}>
                      <PortalIcon type={p.icon} size={18} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] font-bold text-brand-navy">{p.label}</span>
                      <span className="block truncate text-[11.5px] text-slate-500">
                        {PORTAL_SHORT[p.label] ?? meta.desc}
                      </span>
                    </span>
                    <span className="shrink-0 rounded-lg bg-brand-orange px-3.5 py-1.5 text-[12px] font-bold text-white transition-colors group-hover:bg-[#e08500]">
                      Login
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile bottom action bar (fixed) ── */}
      <div
        className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto flex max-w-md items-center justify-between gap-3 px-5 py-2.5">
          <Link
            href="/contact"
            aria-label="Find us"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-navy text-white shadow-sm transition-colors hover:bg-brand-navy-deep"
          >
            <PinIcon />
          </Link>

          <Link
            href="/admissions"
            className="flex h-11 max-w-[220px] flex-1 items-center justify-center rounded-full bg-brand-orange px-6 text-[14px] font-bold text-white shadow-cta transition-colors hover:bg-[#e08500]"
          >
            Enquire now
          </Link>

          <button
            type="button"
            aria-label={navOpen ? "Close menu" : "Open menu"}
            aria-expanded={navOpen}
            onClick={() => (navOpen ? closeNav() : openNav())}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-navy text-white shadow-sm transition-colors hover:bg-brand-navy-deep"
          >
            {navOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
    </>
  );
}

/* ── Brand marks ─────────────────────────────────────────────────────────── */

function BrandNewtons() {
  return (
    <div className="relative h-12 w-12 shrink-0 sm:h-[52px] sm:w-[52px] lg:h-[64px] lg:w-[64px]">
      <Image
        src="/images/school_logo/Newtons_logo.png"
        alt="Newton's High School badge"
        fill
        className="object-contain object-left lg:object-right"
        priority
      />
    </div>
  );
}

function BrandNameLogo({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/images/school_logo/Name_logo.png"
      alt="Newton's High School"
      height={96}
      width={300}
      className={`h-[44px] w-auto self-center object-contain object-center sm:h-[52px] lg:h-[62px] lg:object-left ${className}`}
    />
  );
}

function PortalIcon({ type, size = 15 }: { type: "parent" | "teacher" | "admin"; size?: number }) {
  if (type === "teacher")
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    );
  if (type === "admin")
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    );
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
