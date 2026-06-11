// src/components/ui/Button.tsx
import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "~/lib/cn";

type Variant = "primary" | "outline-light" | "ghost-light" | "outline-navy";
type Size = "sm" | "md" | "lg";

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  /** Append a trailing ">" arrow – used by footer "Contact us" etc. */
  arrow?: boolean;
}

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string };

/**
 * Button
 * -------
 * Variants:
 *   - primary       – orange pill, white text. Default CTA.
 *   - outline-light – transparent with white border, used on hero photo.
 *   - outline-navy  – transparent with navy border, used on light surfaces.
 *   - ghost-light   – text-only link with optional arrow, used in footer.
 */
export function Button(props: ButtonAsButton | ButtonAsLink) {
  const {
    variant = "primary",
    size = "md",
    className,
    children,
    arrow,
    ...rest
  } = props;

  const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/40 focus-visible:ring-offset-2";

  const sizes: Record<Size, string> = {
    sm: "px-4 py-1.5 text-[13px]",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-[15px]",
  };

  const variants: Record<Variant, string> = {
    primary:
      "bg-brand-orange text-white shadow-cta hover:bg-[#E58300] active:translate-y-px",
    "outline-light":
      "border border-white/80 bg-white/10 text-white backdrop-blur hover:bg-white hover:text-brand-navy",
    "outline-navy":
      "border border-brand-navy/30 text-brand-navy hover:border-brand-navy hover:bg-brand-navy/5",
    "ghost-light":
      "text-white hover:text-brand-orange",
  };

  const content = (
    <>
      <span>{children}</span>
      {arrow && (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <polyline points="9 6 15 12 9 18" />
        </svg>
      )}
    </>
  );

  const cls = cn(base, sizes[size], variants[variant], className);

  if ("href" in props && props.href) {
    const { href, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <Link href={href as string} className={cls} {...anchorRest}>
        {content}
      </Link>
    );
  }

  return (
    <button className={cls} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {content}
    </button>
  );
}
