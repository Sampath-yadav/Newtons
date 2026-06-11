// src/data/navigation.ts

// ── Types ────────────────────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  subtitle: string;
  href: string;
}

export interface MegaSubItem {
  label: string;
  href: string;
}

export interface MegaMenuConfig {
  key: string;
  label: string;
  subtitle: string;
  href: string;
  description: string;
  imageSrc: string;
  items: MegaSubItem[];
}

// ── Mega-menu panels ─────────────────────────────────────────────────────────

export const MEGA_MENUS: MegaMenuConfig[] = [
  {
    key: "learning-journey",
    label: "Learning journey",
    subtitle: "Ages 3 to 18",
    href: "/learning-journey",
    description:
      "Explore the academic journey of students from foundational learning to SSC success.",
    imageSrc: "/images/sections/learning-journey/_stage-cards/primary.png",
    items: [
      { label: "Pre-Primary School", href: "/learning-journey/pre-primary" },
      { label: "Primary School", href: "/learning-journey/primary" },
      { label: "Upper Primary School", href: "/learning-journey/upper-primary" },
      { label: "Secondary School (SSC)", href: "/learning-journey/secondary-ssc" },
    ],
  },
  {
    key: "admissions",
    label: "Admissions",
    subtitle: "Enrol with ease",
    href: "/admissions",
    description:
      "Everything parents need to know about joining Newton's High School.",
    imageSrc: "/images/Features/Academic%20Excellence.png",
    items: [
      { label: "Tuition Fees", href: "/admissions/tuition-fees" },
      { label: "Enquire Now", href: "/admissions/enquire-now" },
    ],
  },
  {
    key: "our-school",
    label: "Our school",
    subtitle: "Discover us & the campus",
    href: "/our-school",
    description:
      "Discover Newton's High School — our values, campus, and educational approach.",
    imageSrc: "/images/people/Principal.png",
    items: [
      { label: "Why Choose Us", href: "/our-school/why-choose-us" },
      { label: "Our Team", href: "/our-school/our-team" },
    ],
  },
  {
    key: "school-life",
    label: "School life",
    subtitle: "Where confidence grows",
    href: "/school-life",
    description:
      "Explore the experiences, opportunities, and activities that shape student life.",
    imageSrc: "/images/growing-minds/Life%20competencies.png",
    items: [
      { label: "Clubs, Sports & Opportunities", href: "/school-life#life-beyond" },
      { label: "Caring and Inclusivity", href: "/school-life#caring" },
      { label: "School Reviews", href: "/school-life#voices" },
    ],
  },
  {
    key: "whats-on",
    label: "What's on",
    subtitle: "Discover what's happening",
    href: "/whats-on",
    description:
      "Stay updated with the latest news, events, and happenings at Newton's High School.",
    imageSrc: "/images/growing-minds/Academic%20achievement.png",
    items: [
      { label: "News", href: "/whats-on#latest-updates" },
      { label: "Events", href: "/whats-on#events-calendar" },
    ],
  },
];

// ── Common right-column utility links (appear in every mega-menu) ─────────────

export const COMMON_NAV_ITEMS: MegaSubItem[] = [
  { label: "Calendar", href: "/calendar" },
  { label: "Transport", href: "/support#transport" },
  { label: "Careers", href: "/support#careers" },
  { label: "FAQs", href: "/support#faqs" },
  { label: "Downloads & policies", href: "/downloads" },
  { label: "Contact us", href: "/contact" },
];

// ── Portal links (parent, teacher, admin) ─────────────────────────────────────

export const PORTAL_LINKS: (MegaSubItem & { icon: "parent" | "teacher" | "admin" })[] = [
  { label: "Parent Portal",  href: "/parent-portal/login", icon: "parent"  },
  { label: "Teacher Login",  href: "/teacher",        icon: "teacher" },
  { label: "Admin Login",    href: "/admin",          icon: "admin"   },
];

// ── Legacy NAV_ITEMS (keep for any remaining imports) ────────────────────────

export const NAV_ITEMS: NavItem[] = MEGA_MENUS.map(({ label, subtitle, href }) => ({
  label,
  subtitle,
  href,
}));

// ── Footer ───────────────────────────────────────────────────────────────────

export const FOOTER_COLUMNS: { heading: string; items: NavItem[] }[] = [
  {
    heading: "Newton's High School",
    items: MEGA_MENUS.map(({ label, href }) => ({ label, subtitle: "", href })),
  },
  {
    heading: "Service",
    items: [
      ...COMMON_NAV_ITEMS.map(({ label, href }) => ({ label, subtitle: "", href })),
      { label: "Privacy settings", subtitle: "", href: "/privacy" },
    ],
  },
  {
    heading: "Portals",
    items: PORTAL_LINKS.map(({ label, href }) => ({ label, subtitle: "", href })),
  },
];

export const SITE = {
  name: "Newton's High School",
  tagline: "Where Confidence Grows",
  address: {
    line1: "9VVG+26J, Banswada - Bodhan Rd, Gouse Nagar,",
    line2: "Buswatarag Nagar, Bodhan, Banswada,",
    line3: "Telangana 503187",
  },
  phones: ["098660 89343"],
  social: [
    { id: "youtube", href: "https://youtube.com" },
    { id: "instagram", href: "https://instagram.com" },
    { id: "linkedin", href: "https://linkedin.com" },
    { id: "x", href: "https://x.com" },
    { id: "facebook", href: "https://facebook.com" },
  ],
};
