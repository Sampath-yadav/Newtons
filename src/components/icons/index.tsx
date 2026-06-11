// src/components/icons/index.tsx
import type { ReactElement, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function PinIcon(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function ExpandIcon(props: IconProps) {
  // Bottom-right "corner launcher" icon on the hero
  return (
    <svg {...base} {...props} aria-hidden>
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  );
}

/* Social icons — minimal monoline set */

export function YoutubeIcon(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" stroke="none" />
    </svg>
  );
}
export function InstagramIcon(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
export function LinkedinIcon(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
export function XIcon(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden>
      <path d="M18 4 6 20" />
      <path d="M6 4l12 16" />
    </svg>
  );
}
export function FacebookIcon(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

/* --- Admissions step icons --- */

export function ClipboardIcon(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden>
      <rect x="9" y="2" width="6" height="4" rx="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <line x1="8" y1="16" x2="14" y2="16" />
    </svg>
  );
}

export function DocumentCheckIcon(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <polyline points="9 15 11 17 15 12" />
    </svg>
  );
}

export function HandshakeIcon(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden>
      <path d="M7 8h10" />
      <path d="M2 12h2l2 3h12l2-3h2" />
      <path d="M10 8V5a2 2 0 0 1 4 0v3" />
      <rect x="6" y="15" width="12" height="4" rx="1" />
    </svg>
  );
}

export function PaymentIcon(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
      <line x1="6" y1="15" x2="8" y2="15" />
      <line x1="10" y1="15" x2="14" y2="15" />
    </svg>
  );
}

export function SchoolBuildingIcon(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden>
      <rect x="3" y="9" width="18" height="12" rx="1" />
      <path d="M7 9V7a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2" />
      <line x1="12" y1="3" x2="12" y2="6" />
      <line x1="10" y1="6" x2="14" y2="6" />
      <rect x="9" y="14" width="6" height="7" />
    </svg>
  );
}

export const SOCIAL_ICONS: Record<string, (p: IconProps) => ReactElement> = {
  youtube: YoutubeIcon,
  instagram: InstagramIcon,
  linkedin: LinkedinIcon,
  x: XIcon,
  facebook: FacebookIcon,
};

/* --- USP icons used by WelcomeFeatures cards --- */

export function PeopleIcon(props: IconProps) {
  // Two figures on a baseline + small upward chart bars on the right —
  // matches the "Two distinct curricula" card icon in the reference.
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <circle cx="13" cy="14" r="4" />
      <path d="M7 30v-2a6 6 0 0 1 12 0v2" />
      <line x1="13" y1="30" x2="13" y2="40" />
      <circle cx="25" cy="14" r="4" />
      <path d="M19 30v-2a6 6 0 0 1 12 0v2" />
      <line x1="25" y1="30" x2="25" y2="40" />
      <line x1="35" y1="40" x2="35" y2="32" />
      <line x1="40" y1="40" x2="40" y2="28" />
      <line x1="45" y1="40" x2="45" y2="24" />
      <line x1="5" y1="40" x2="46" y2="40" />
    </svg>
  );
}

export function GraduationCapIcon(props: IconProps) {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M24 8 4 18l20 10 20-10z" />
      <path d="M12 23v8c0 2 5 5 12 5s12-3 12-5v-8" />
      <line x1="44" y1="18" x2="44" y2="30" />
      <circle cx="44" cy="32" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function GlobeBookIcon(props: IconProps) {
  // Open book with a small globe — matches the "Global top achievers" icon
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M6 12c4-2 11-2 16 1v25c-5-3-12-3-16-1z" />
      <path d="M42 12c-4-2-11-2-16 1v25c5-3 12-3 16-1z" />
      <circle cx="24" cy="20" r="6" />
      <line x1="18" y1="20" x2="30" y2="20" />
      <path d="M24 14c2 2 2 10 0 12" />
      <path d="M24 14c-2 2-2 10 0 12" />
    </svg>
  );
}

export function MentorIcon(props: IconProps) {
  // Teacher figure with pointer and student — Faculty & Mentorship card
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {/* Teacher */}
      <circle cx="15" cy="12" r="5" />
      <path d="M7 32v-3a8 8 0 0 1 16 0v3" />
      {/* Pointer / teaching stick */}
      <line x1="23" y1="18" x2="36" y2="10" />
      <circle cx="37" cy="9" r="1.5" fill="currentColor" />
      {/* Whiteboard */}
      <rect x="28" y="14" width="16" height="12" rx="1.5" />
      <line x1="31" y1="19" x2="41" y2="19" />
      <line x1="31" y1="22" x2="38" y2="22" />
      {/* Student figure (smaller) */}
      <circle cx="36" cy="34" r="3" />
      <path d="M30 44v-2a6 6 0 0 1 12 0v2" />
    </svg>
  );
}

export function TrophyIcon(props: IconProps) {
  // Trophy with star — Sports & Co-Curricular card
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {/* Trophy cup */}
      <path d="M14 6h20v14c0 6-4 10-10 10S14 26 14 20V6z" />
      {/* Left handle */}
      <path d="M14 10H9a3 3 0 0 0-3 3v2a5 5 0 0 0 5 5h3" />
      {/* Right handle */}
      <path d="M34 10h5a3 3 0 0 1 3 3v2a5 5 0 0 1-5 5h-3" />
      {/* Stem */}
      <line x1="24" y1="30" x2="24" y2="38" />
      {/* Base */}
      <path d="M16 38h16" />
      <rect x="18" y="38" width="12" height="3" rx="1" />
      {/* Star inside trophy */}
      <path d="M24 12l1.8 3.6 4 .6-2.9 2.8.7 4-3.6-1.9L20.4 23l.7-4-2.9-2.8 4-.6z" fill="currentColor" stroke="none" />
    </svg>
  );
}

