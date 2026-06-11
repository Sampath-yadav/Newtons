// src/components/ui/ImageFrame.tsx
import { cn } from "~/lib/cn";

type Tone = "navy" | "orange" | "lavender" | "slate";

const TONES: Record<Tone, { grad: string; icon: string; label: string }> = {
  navy: { grad: "from-[#0a1270] via-[#141c7a] to-[#060C8B]", icon: "text-white/35", label: "text-white/80" },
  orange: { grad: "from-[#F39200] via-[#f7a838] to-[#d97b00]", icon: "text-white/45", label: "text-white/90" },
  lavender: { grad: "from-[#ECEAFB] via-[#e0e1fb] to-[#cdd0f5]", icon: "text-brand-navy/25", label: "text-brand-navy/60" },
  slate: { grad: "from-slate-100 via-slate-200 to-slate-300", icon: "text-slate-400", label: "text-slate-500" },
};

/**
 * ImageFrame
 * ----------
 * A photo slot that looks intentional *before* a real image exists.
 *
 * - Shows a branded placeholder (gradient + camera icon + label).
 * - Layers the real photo on top via a CSS background, so the instant a file
 *   is dropped at `src` it appears — and if the file is missing there's NO
 *   broken-image icon (an empty CSS background simply renders nothing).
 * - Pass `caption` for a permanent bottom caption (used by gallery tiles).
 *
 * Size it with `className` (e.g. `h-[420px]`, `aspect-[4/3]`, `col-span-2`).
 */
export function ImageFrame({
  src,
  label,
  caption,
  tone = "navy",
  rounded = "rounded-3xl",
  className,
  overlay = false,
}: {
  src?: string;
  label?: string;
  caption?: string;
  tone?: Tone;
  rounded?: string;
  className?: string;
  overlay?: boolean;
}) {
  const t = TONES[tone];
  return (
    <div className={cn("group/frame relative overflow-hidden", rounded, className)}>
      {/* Placeholder underlay */}
      <div className={cn("absolute inset-0 bg-gradient-to-br", t.grad)} aria-hidden />
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{ backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)", backgroundSize: "20px 20px", color: tone === "lavender" ? "#060C8B" : "#ffffff" }}
        aria-hidden
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 px-4 text-center">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={cn("h-10 w-10", t.icon)} aria-hidden>
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
        </svg>
        {label && <span className={cn("text-[11px] font-semibold uppercase tracking-wider", t.label)}>{label}</span>}
      </div>

      {/* Real photo (appears automatically when the file exists) */}
      {src && (
        <div
          role="img"
          aria-label={label ?? caption ?? "Photo"}
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover/frame:scale-105"
          style={{ backgroundImage: `url('${src}')` }}
        />
      )}

      {/* Caption / legibility overlay */}
      {(caption || overlay) && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" aria-hidden />
      )}
      {caption && (
        <span className="absolute bottom-4 left-4 right-4 text-[14px] font-bold text-white drop-shadow-sm">
          {caption}
        </span>
      )}
    </div>
  );
}
