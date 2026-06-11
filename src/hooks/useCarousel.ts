// src/hooks/useCarousel.ts
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";

export interface UseCarouselOptions {
  /** Number of items in the carousel. Drives dot count. */
  total: number;
  /** Step size in "items per page" — defaults to 1. */
  itemsPerPage?: number;
}

export interface UseCarouselReturn {
  /** Attach to the horizontally scrollable element. */
  trackRef: RefObject<HTMLDivElement | null>;
  /** Active "page" — drives the active dot. */
  activeIndex: number;
  /** Total number of pages (= ceil(total / itemsPerPage)). */
  pageCount: number;
  /** True/false based on current scroll position — for arrow disabled states. */
  canPrev: boolean;
  canNext: boolean;
  prev: () => void;
  next: () => void;
  /** Programmatically jump to a specific page. */
  goTo: (page: number) => void;
}

/**
 * Measure the width of a single card item including its share of the gap.
 * Falls back to the track's clientWidth if no children are found.
 */
function getItemScrollStep(track: HTMLElement): number {
  const children = track.children;
  if (children.length < 2) return track.clientWidth;

  // Distance between the start of the first child and the start of the
  // second child gives us one card width + gap.
  const first = children[0] as HTMLElement;
  const second = children[1] as HTMLElement;
  const step = second.offsetLeft - first.offsetLeft;

  return step > 0 ? step : track.clientWidth;
}

/**
 * Count how many full items are visible in the track at once.
 */
function getVisibleCount(track: HTMLElement): number {
  const step = getItemScrollStep(track);
  if (step <= 0) return 1;
  return Math.max(1, Math.round(track.clientWidth / step));
}

/**
 * useCarousel
 * ------------
 * Drives a horizontally-scrolling row of cards. Watches scroll position to
 * compute the active page (so trackpad / touch swipes keep the dots in
 * sync), and exposes prev/next that scroll exactly one card at a time.
 *
 * Page count is calculated as (total − visibleCount + 1) so dots reflect
 * actual scrollable "stops". On mobile (1 visible) with 5 items → 5 dots.
 * On desktop (3 visible) with 5 items → 3 dots.
 */
export function useCarousel({
  total,
  itemsPerPage = 1,
}: UseCarouselOptions): UseCarouselReturn {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [dynamicPageCount, setDynamicPageCount] = useState(
    Math.max(1, Math.ceil(total / itemsPerPage)),
  );

  // Recalculate page count based on actual visible items
  const recalcPageCount = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const visible = getVisibleCount(el);
    const pages = Math.max(1, total - visible + 1);
    setDynamicPageCount(pages);
  }, [total]);

  const pageCount = dynamicPageCount;

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScroll = Math.max(1, scrollWidth - clientWidth);
    const ratio = scrollLeft / maxScroll;
    setActiveIndex(Math.round(ratio * (pageCount - 1)));
    setCanPrev(scrollLeft > 4);
    setCanNext(scrollLeft < maxScroll - 4);
  }, [pageCount]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    // Initial calculation
    recalcPageCount();
    update();

    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", () => {
      recalcPageCount();
      update();
    });

    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update, recalcPageCount]);

  /** Scroll by exactly one card width in the given direction. */
  const scrollByOne = useCallback((dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const step = getItemScrollStep(el);
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }, []);

  const goTo = useCallback(
    (page: number) => {
      const el = trackRef.current;
      if (!el) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      const target = (page / Math.max(1, pageCount - 1)) * maxScroll;
      el.scrollTo({ left: target, behavior: "smooth" });
    },
    [pageCount],
  );

  return {
    trackRef,
    activeIndex,
    pageCount,
    canPrev,
    canNext,
    prev: () => scrollByOne(-1),
    next: () => scrollByOne(1),
    goTo,
  };
}
