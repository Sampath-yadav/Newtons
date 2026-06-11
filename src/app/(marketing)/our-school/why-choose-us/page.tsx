import type { ReactNode } from "react";
import Link from "next/link";
import { Button } from "~/components/ui/Button";
import { Container } from "~/components/layout/Container";
import { ImageFrame } from "~/components/ui/ImageFrame";
import { AccreditationsBanner } from "~/components/admissions/AccreditationsBanner";
import { StatsCounter } from "~/components/our-school/StatsCounter";

/* ── Icon set ─────────────────────────────────────────────────────────────── */

const I = {
  book: <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />,
  globe: <><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></>,
  star: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />,
  flask: <path d="M9 3h6M9 3v7L4 20h16L15 10V3" />,
  users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
  computer: <><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></>,
  trophy: <><polyline points="8 21 12 17 16 21" /><line x1="12" y1="17" x2="12" y2="11" /><path d="M7 4H4a2 2 0 0 0-2 2v1a5 5 0 0 0 5 5h10a5 5 0 0 0 5-5V6a2 2 0 0 0-2-2h-3" /><rect x="7" y="2" width="10" height="5" rx="1" /></>,
  palette: <><circle cx="13.5" cy="6.5" r=".5" /><circle cx="17.5" cy="10.5" r=".5" /><circle cx="8.5" cy="7.5" r=".5" /><circle cx="6.5" cy="12.5" r=".5" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" /></>,
  mic: <><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></>,
  leaf: <><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></>,
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  shieldCheck: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></>,
  bulb: <><line x1="9" y1="18" x2="15" y2="18" /><line x1="10" y1="22" x2="14" y2="22" /><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" /></>,
  heart: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />,
  check: <polyline points="20 6 9 17 4 12" />,
  puzzle: <path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 1.998 12c0-.617.236-1.234.706-1.704L4.23 8.77c.24-.24.581-.353.917-.303.515.077.877.528 1.073 1.01a2.5 2.5 0 1 0 3.259-3.259c-.482-.196-.933-.558-1.01-1.073-.05-.336.063-.676.303-.917l1.525-1.525A2.402 2.402 0 0 1 12 1.998c.617 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.237 3.237c-.464.18-.894.527-.967 1.02z" />,
  compass: <><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></>,
  clipboard: <><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" /><path d="m9 14 2 2 4-4" /></>,
  target: <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></>,
  bus: <><path d="M8 6v6M16 6v6M2 12h19.6M18 18h2a1 1 0 0 0 1-1V8a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v9a1 1 0 0 0 1 1h2" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></>,
  cctv: <><path d="M2 7 17 3l1 4-15 4z" /><path d="M3 11v4a2 2 0 0 0 2 2h7" /><path d="M14 9h7v4M17 17v4" /><circle cx="8" cy="9" r="0" /></>,
  message: <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z" />,
  lifebuoy: <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" /><line x1="4.93" y1="4.93" x2="9.17" y2="9.17" /><line x1="14.83" y1="14.83" x2="19.07" y2="19.07" /><line x1="14.83" y1="9.17" x2="19.07" y2="4.93" /><line x1="4.93" y1="19.07" x2="9.17" y2="14.83" /></>,
  spark: <path d="M12 3l1.9 5.2L19 10l-5.1 1.8L12 17l-1.9-5.2L5 10l5.1-1.8z" />,
  presentation: <><path d="M2 3h20M3 3v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3" /><path d="m12 16 4 5M12 16l-4 5" /></>,
} as const;

type IconKey = keyof typeof I;

function Icon({ name, className = "h-6 w-6" }: { name: IconKey; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {I[name]}
    </svg>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-orange">
      <span className="h-px w-5 bg-brand-orange/50" />
      {children}
    </span>
  );
}

/* ── Image paths (drop real files here later; placeholders show until then) ─── */
const IMG = "/images/sections/our-school";

/* ── Data ─────────────────────────────────────────────────────────────────── */

const TRUST = [
  { value: "Telangana SSC", label: "Affiliated Board" },
  { value: "15+ Years", label: "Of Excellence" },
  { value: "1:20", label: "Teacher Ratio" },
  { value: "95%+", label: "Board Pass Rate" },
];

const COMMITMENT = [
  "Individual attention for every student",
  "SSC-aligned curriculum with board excellence",
  "Experienced, caring & qualified teachers",
  "Safe, secure and nurturing environment",
  "Affordable, transparent fee structure",
];

const METHODS: { icon: IconKey; title: string; body: string }[] = [
  { icon: "bulb", title: "Concept-Based Learning", body: "Deep understanding over rote memorisation — knowledge that lasts beyond the exam hall." },
  { icon: "puzzle", title: "Activity-Based Learning", body: "Hands-on tasks, group work and games that turn every lesson into an experience." },
  { icon: "compass", title: "Experiential Learning", body: "Real-world projects, field exposure and discovery that connect theory to life." },
  { icon: "clipboard", title: "Continuous Assessment", body: "Regular, low-pressure check-ins that track growth and guide each child forward." },
  { icon: "computer", title: "Digital Learning Support", body: "Smart boards and audio-visual content that make abstract ideas vivid and clear." },
  { icon: "target", title: "Individual Attention", body: "Small class sizes so no learner is left behind and every strength is nurtured." },
];

const JOURNEY: { title: string; body: string; accent: string }[] = [
  { title: "Strong Foundation", body: "Concept clarity across core SSC subjects from day one.", accent: "#F39200" },
  { title: "Classroom Learning", body: "Interactive, student-centred lessons that spark curiosity.", accent: "#2563eb" },
  { title: "Practical Activities", body: "Labs, projects and play that make learning tangible.", accent: "#16a34a" },
  { title: "Projects & Presentations", body: "Research, teamwork and confident public expression.", accent: "#9333ea" },
  { title: "Leadership Development", body: "Clubs, councils and events that build real responsibility.", accent: "#0284c7" },
  { title: "Future Readiness", body: "Board prep, career awareness and life skills for what's next.", accent: "#e11d48" },
];

const BEYOND = [
  { label: "Academic Excellence", img: `${IMG}/academic-excellence.png`, span: "lg:col-span-2 lg:row-span-2 h-[260px] lg:h-auto", tone: "navy" as const },
  { label: "Science Activities", img: `${IMG}/science-activities.jpg`, span: "h-[180px]", tone: "orange" as const },
  { label: "Reading Programs", img: `${IMG}/reading-programs.jpg`, span: "h-[180px]", tone: "lavender" as const },
  { label: "Sports", img: `${IMG}/sports-activities.png`, span: "h-[180px]", tone: "orange" as const },
  { label: "Art & Culture", img: `${IMG}/art-culture.jpg`, span: "h-[180px]", tone: "navy" as const },
  { label: "Student Leadership", img: `${IMG}/leadership.jpg`, span: "lg:col-span-2 h-[180px]", tone: "lavender" as const },
];

const FRAMEWORK = [
  { step: "01", title: "Academic Growth", body: "A strong foundation across all SSC subjects with structured lessons and regular assessment.", color: "#F39200" },
  { step: "02", title: "Communication Skills", body: "Confident speaking, clear writing and effective presentation abilities.", color: "#2563eb" },
  { step: "03", title: "Confidence Building", body: "Participation, public speaking and positive self-expression in every student.", color: "#16a34a" },
  { step: "04", title: "Teamwork & Leadership", body: "Leading clubs, events and councils builds real, lasting responsibility.", color: "#9333ea" },
  { step: "05", title: "Life Skills", body: "Problem-solving, empathy and resilience woven through everyday school life.", color: "#0284c7" },
  { step: "06", title: "Career Awareness", body: "Guidance on pathways, higher education and meaningful goal-setting.", color: "#e11d48" },
];

const STATS = [
  { target: 95, suffix: "%+", label: "SSC Board Pass Percentage" },
  { target: 90, suffix: "%+", label: "Students Achieving First Class" },
  { target: 20, suffix: "+", label: "Experienced Teaching Staff" },
  { target: 500, suffix: "+", label: "Successful Alumni" },
  { target: 15, suffix: "+", label: "Years of Excellence" },
  { target: 50, suffix: "+", label: "Annual Academic & Cultural Events" },
  { target: 100, suffix: "%", label: "Parent-Teacher Communication" },
  { target: 300, suffix: "+", label: "Students Nurtured Each Year" },
];

const CAMPUS_GALLERY = [
  { label: "Main Building", img: `${IMG}/campus-1.jpg`, tone: "navy" as const },
  { label: "Activity Grounds", img: `${IMG}/campus-2.jpg`, tone: "orange" as const },
  { label: "Learning Spaces", img: `${IMG}/campus-3.jpg`, tone: "lavender" as const },
  { label: "Campus Life", img: `${IMG}/campus-4.jpg`, tone: "navy" as const },
];

const CAMPUS: { icon: IconKey; eyebrow: string; title: string; body: string; points: string[]; img: string; tone: "navy" | "orange" | "lavender" }[] = [
  {
    icon: "presentation", eyebrow: "Smart Classrooms", title: "Where lessons come to life",
    body: "Digitally-enabled classrooms blend traditional teaching with interactive technology, keeping every learner engaged.",
    points: ["Digital boards & teaching support", "Interactive, participative lessons", "Rich audio-visual content"],
    img: `${IMG}/smart-classrooms.jpg`, tone: "navy",
  },
  {
    icon: "book", eyebrow: "Library & Reading", title: "A culture of curiosity & reading",
    body: "Our library nurtures a lifelong love of reading with an ever-growing collection and guided reading programmes.",
    points: ["Story & picture books for every age", "Reference & subject resources", "Structured reading programmes"],
    img: `${IMG}/library.jpg`, tone: "orange",
  },
  {
    icon: "flask", eyebrow: "Science & Activity Labs", title: "Learning by doing",
    body: "Hands-on laboratories turn scientific concepts into discovery through demonstration and experimentation.",
    points: ["Live science demonstrations", "Hands-on experiments", "Activity-based exploration"],
    img: `${IMG}/science-lab.jpg`, tone: "lavender",
  },
  {
    icon: "trophy", eyebrow: "Sports & Physical Development", title: "Healthy body, sharp mind",
    body: "Sport builds fitness, teamwork and discipline through structured outdoor and indoor activity all year round.",
    points: ["Outdoor field games", "Indoor activities", "Annual sports events"],
    img: `${IMG}/sports.jpg`, tone: "navy",
  },
  {
    icon: "bus", eyebrow: "School Transport", title: "Safe travel, every day",
    body: "A reliable, well-maintained transport network brings students to school safely from across the locality.",
    points: ["Safe, reliable bus routes", "Trained, verified drivers", "Supervised pick-up & drop"],
    img: `${IMG}/transport.jpg`, tone: "orange",
  },
];

const SAFETY: { icon: IconKey; title: string; body: string }[] = [
  { icon: "cctv", title: "CCTV Surveillance", body: "Round-the-clock monitoring across the campus." },
  { icon: "shield", title: "Secure Campus", body: "Controlled entry with a gated, protected premises." },
  { icon: "users", title: "Trained Staff", body: "Caring, vetted staff trained in student safety." },
  { icon: "heart", title: "Health & Hygiene", body: "Clean facilities and attentive first-aid care." },
  { icon: "message", title: "Parent Communication", body: "Regular updates keep families fully informed." },
  { icon: "lifebuoy", title: "Student Support", body: "Guidance and pastoral care for every child." },
];

const WHY_CHOOSE: { icon: IconKey; title: string; body: string; accent: string; bg: string }[] = [
  { icon: "book", title: "SSC Curriculum Excellence", body: "A strong foundation aligned with Telangana SSC standards and consistent board success.", accent: "#F39200", bg: "#FFF1DD" },
  { icon: "users", title: "Experienced Faculty", body: "Dedicated teachers offering individual attention and personalised mentorship.", accent: "#060C8B", bg: "#E7E9FA" },
  { icon: "bulb", title: "Concept-Based Learning", body: "Deep understanding over memorisation — building knowledge that lasts.", accent: "#d97706", bg: "#FCEFD3" },
  { icon: "shieldCheck", title: "Student Safety", body: "Secure campus, CCTV, trained staff and safe transport for total peace of mind.", accent: "#7c3aed", bg: "#EDE6FE" },
  { icon: "trophy", title: "Sports Development", body: "Fitness, teamwork and discipline through regular structured sports.", accent: "#16a34a", bg: "#DDF3E4" },
  { icon: "palette", title: "Cultural Activities", body: "Creativity and confidence nurtured through cultural events and competitions.", accent: "#e11d48", bg: "#FCE3E7" },
  { icon: "star", title: "Leadership Opportunities", body: "Responsibility and communication built through real leadership roles.", accent: "#0284c7", bg: "#D9EEF8" },
  { icon: "leaf", title: "Affordable Quality", body: "Excellent education made accessible through a transparent fee structure.", accent: "#0d9488", bg: "#D6F0EC" },
];

const VALUES = [
  { icon: "shield" as IconKey, title: "Integrity", body: "Honesty, responsibility and ethical behaviour in every part of school life.", accent: "#7c3aed", bg: "#ede9fe" },
  { icon: "star" as IconKey, title: "Excellence", body: "Encouraging every student to strive for their personal best — always.", accent: "#d97706", bg: "#fef3c7" },
  { icon: "heart" as IconKey, title: "Respect", body: "Empathy and genuine respect for peers, teachers and community.", accent: "#e11d48", bg: "#ffe4e6" },
  { icon: "spark" as IconKey, title: "Growth Mindset", body: "Embracing challenges as opportunities for continuous growth.", accent: "#16a34a", bg: "#dcfce7" },
];

const TESTIMONIALS = [
  { quote: "Newton's has helped my child grow academically and personally. The teachers provide excellent guidance, and the school genuinely focuses on both education and strong values.", name: "Mrs. Lakshmi Reddy", role: "Parent of Grade 8 Student" },
  { quote: "The individual attention my daughter receives from every teacher is remarkable. Newton's has given her confidence, discipline and a true love for learning.", name: "Mr. Ravi Kumar", role: "Parent of Grade 6 Student" },
  { quote: "Safe, caring and academically strong. As working parents, the regular communication and secure campus give us complete peace of mind every single day.", name: "Mrs. Anitha Rao", role: "Parent of Grade 9 Student" },
];

const FACILITIES: { icon: IconKey; title: string }[] = [
  { icon: "computer", title: "Smart Classrooms" },
  { icon: "book", title: "Library" },
  { icon: "flask", title: "Science Lab" },
  { icon: "mic", title: "Computer Lab" },
  { icon: "trophy", title: "Sports Facilities" },
  { icon: "bus", title: "School Transport" },
  { icon: "palette", title: "Activity Rooms" },
  { icon: "shield", title: "Safe Campus" },
];

const MASONRY = [
  { img: `${IMG}/gallery-1.jpg`, span: "row-span-2 h-[300px]", tone: "navy" as const, label: "Campus" },
  { img: `${IMG}/gallery-2.jpg`, span: "h-[145px]", tone: "orange" as const, label: "Events" },
  { img: `${IMG}/gallery-3.jpg`, span: "h-[145px]", tone: "lavender" as const, label: "Classrooms" },
  { img: `${IMG}/gallery-4.jpg`, span: "h-[145px]", tone: "orange" as const, label: "Sports" },
  { img: `${IMG}/gallery-5.jpg`, span: "row-span-2 h-[300px]", tone: "navy" as const, label: "Activities" },
  { img: `${IMG}/gallery-6.jpg`, span: "h-[145px]", tone: "lavender" as const, label: "Celebrations" },
];

function initials(name: string) {
  return name.replace(/^(Mr|Mrs|Ms|Dr)\.?\s+/i, "").trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
}

/* ── Page ─────────────────────────────────────────────────────────────────── */

export default function WhyChooseUsPage() {
  return (
    <>
      {/* ── 1 · Hero (split) ── */}
      <section className="relative overflow-hidden bg-brand-navy">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-orange/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-[#3b46c4]/30 blur-3xl" />
        <Container className="relative grid grid-cols-1 items-center gap-10 py-14 lg:grid-cols-2 lg:gap-16 lg:py-24">
          <div>
            <Eyebrow>Our School · Why Choose Us</Eyebrow>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] text-white lg:text-[3.5rem]">
              Why Choose<br />
              <span className="text-brand-orange">Newton&apos;s High School</span>
            </h1>
            <p className="mt-5 max-w-md text-[16px] leading-relaxed text-white/75 lg:text-[17px]">
              Quality SSC education through academic excellence, strong values, experienced
              teachers and a safe environment where every child grows confidently.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/admissions/enquire-now" size="lg">Enquire Now</Button>
              <Button href="/admissions/how-to-apply" size="lg" variant="outline-light">Book a Campus Tour</Button>
            </div>
          </div>
          <ImageFrame
            src={`${IMG}/hero.jpg`}
            label="Hero Image"
            tone="orange"
            className="h-[300px] w-full shadow-2xl shadow-black/30 ring-1 ring-white/10 lg:h-[440px]"
          />
        </Container>
      </section>

      {/* ── Trust strip ── */}
      <section className="border-b border-slate-100 bg-white">
        <Container>
          <dl className="grid grid-cols-2 divide-x divide-slate-100 lg:grid-cols-4">
            {TRUST.map((t) => (
              <div key={t.label} className="px-4 py-6 text-center">
                <dt className="text-[19px] font-extrabold text-brand-navy lg:text-[22px]">{t.value}</dt>
                <dd className="mt-1 text-[12px] font-medium uppercase tracking-wider text-brand-muted">{t.label}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* ── Breadcrumb ── */}
      <nav className="bg-white pt-8">
        <Container>
          <ol className="flex items-center gap-1.5 text-sm text-brand-muted">
            <li><Link href="/" className="transition hover:text-brand-navy">Home</Link></li>
            <li className="text-slate-300">›</li>
            <li><Link href="/our-school" className="transition hover:text-brand-navy">Our School</Link></li>
            <li className="text-slate-300">›</li>
            <li className="font-semibold text-brand-navy">Why Choose Us</li>
          </ol>
        </Container>
      </nav>

      {/* ── 2 · Our Commitment ── */}
      <section className="bg-white py-16 lg:py-24">
        <Container>
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="relative order-2 lg:order-1">
              <ImageFrame src={`${IMG}/commitment.jpg`} label="Commitment Image" tone="navy" className="h-[400px] lg:h-[480px] shadow-card-lg" />
              <div className="absolute -bottom-6 left-6 right-6 rounded-2xl bg-white px-5 py-4 shadow-card-lg lg:left-auto lg:right-8 lg:w-64">
                <p className="text-[11px] font-bold uppercase tracking-widest text-brand-orange">Telangana SSC Board</p>
                <p className="mt-1 text-[15px] font-extrabold text-brand-ink">Affiliated & Recognised</p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <Eyebrow>Our Commitment</Eyebrow>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight text-brand-ink lg:text-[2.6rem]">
                A School That Puts Every Child First
              </h2>
              <p className="mt-5 text-[16px] leading-relaxed text-brand-muted">
                We believe every child deserves quality education, strong values and the
                opportunity to reach their full potential. Following the Telangana SSC
                curriculum, we balance academic excellence with character and holistic growth.
              </p>
              <ul className="mt-7 space-y-3">
                {COMMITMENT.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-[14.5px] font-medium text-brand-ink">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-orange/15 text-brand-orange">
                      <Icon name="check" className="h-3.5 w-3.5" />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* ── 3 · Our Learning Philosophy (How We Learn) ── */}
      <section className="py-16 lg:py-24" style={{ background: "#f7f8fd" }}>
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            {/* Sticky intro + image */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <Eyebrow>How We Learn</Eyebrow>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight text-brand-ink lg:text-4xl">
                Our Learning Philosophy
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-brand-muted">
                Learning at Newton&apos;s is active, joyful and built around the child. Six
                principles shape how every lesson is planned and taught.
              </p>
              <ImageFrame src={`${IMG}/classroom-learning.jpg`} label="Classroom Learning" tone="navy" className="mt-7 hidden h-[280px] lg:block shadow-card-lg" />
            </div>

            {/* Methods — numbered, accent-bordered (distinct from card grids) */}
            <ol className="space-y-3">
              {METHODS.map((m, i) => (
                <li
                  key={m.title}
                  className="group flex gap-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-card transition-all duration-300 hover:border-brand-orange/30 hover:shadow-card-lg sm:p-6"
                >
                  <div className="flex flex-col items-center">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-navy/6 text-brand-navy transition-colors duration-300 group-hover:bg-brand-navy group-hover:text-white">
                      <Icon name={m.icon} className="h-5 w-5" />
                    </span>
                    <span className="mt-2 text-[11px] font-extrabold text-slate-300">0{i + 1}</span>
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-brand-ink">{m.title}</h3>
                    <p className="mt-1 text-[13.5px] leading-relaxed text-brand-muted">{m.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* ── 4 · Student Learning Journey (horizontal stepper) ── */}
      <section className="bg-white py-16 lg:py-24">
        <Container>
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <div className="flex justify-center"><Eyebrow>The Path Forward</Eyebrow></div>
            <h2 className="mt-4 text-3xl font-extrabold text-brand-ink lg:text-4xl">Student Learning Journey</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-brand-muted">
              Six connected stages that take a child from first concepts to a confident, future-ready young adult.
            </p>
          </div>

          {/* Desktop: connected horizontal rail */}
          <div className="relative hidden lg:block">
            <div className="absolute left-[8%] right-[8%] top-7 h-[2px] bg-gradient-to-r from-brand-orange/30 via-slate-200 to-[#e11d48]/30" />
            <div className="grid grid-cols-6 gap-4">
              {JOURNEY.map((s, i) => (
                <div key={s.title} className="group flex flex-col items-center text-center">
                  <div
                    className="relative z-10 mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border-4 border-white text-[15px] font-extrabold text-white shadow-card transition-transform duration-300 group-hover:-translate-y-1"
                    style={{ background: s.accent }}
                  >
                    {i + 1}
                  </div>
                  <h3 className="text-[14px] font-bold leading-snug text-brand-ink">{s.title}</h3>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-brand-muted">{s.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: vertical spine */}
          <div className="relative space-y-4 lg:hidden">
            <div className="absolute bottom-4 left-7 top-4 w-[2px] bg-slate-200" />
            {JOURNEY.map((s, i) => (
              <div key={s.title} className="flex items-start gap-5">
                <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-4 border-white text-[15px] font-extrabold text-white shadow-card" style={{ background: s.accent }}>
                  {i + 1}
                </div>
                <div className="pt-1">
                  <h3 className="text-[16px] font-bold text-brand-ink">{s.title}</h3>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-brand-muted">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 5 · Education Beyond Textbooks (bento gallery) ── */}
      <section className="py-16 lg:py-24" style={{ background: "#060C8B" }}>
        <Container>
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="flex justify-center"><Eyebrow>Practical Learning</Eyebrow></div>
            <h2 className="mt-4 text-3xl font-extrabold text-white lg:text-4xl">Education Beyond Textbooks</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-white/70">
              Learning happens everywhere — in labs, on playgrounds, in studios and on stage.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {BEYOND.map((b) => (
              <ImageFrame key={b.label} src={b.img} caption={b.label} tone={b.tone} className={b.span} />
            ))}
          </div>
        </Container>
      </section>

      {/* ── 6 · Student Development Framework (vertical spine) ── */}
      <section className="bg-white py-16 lg:py-24">
        <Container>
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <div className="flex justify-center"><Eyebrow>Our Methodology</Eyebrow></div>
            <h2 className="mt-4 text-3xl font-extrabold text-brand-ink lg:text-4xl">Student Development Framework</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-brand-muted">
              Six dimensions we deliberately grow in every student, year after year.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FRAMEWORK.map((f) => (
              <div key={f.step} className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-lg">
                <span className="pointer-events-none absolute -right-2 -top-4 select-none text-[80px] font-extrabold leading-none opacity-[0.06]" style={{ color: f.color }} aria-hidden>{f.step}</span>
                <div className="mb-4 h-1.5 w-10 rounded-full" style={{ background: f.color }} />
                <h3 className="text-[17px] font-extrabold text-brand-ink">{f.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-brand-muted">{f.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 7 · Stats ── */}
      <section className="py-16 lg:py-24" style={{ background: "#ECEAFB" }}>
        <Container>
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="flex justify-center"><Eyebrow>Our Track Record</Eyebrow></div>
            <h2 className="mt-4 text-3xl font-extrabold text-brand-ink lg:text-4xl">Results That Speak for Themselves</h2>
          </div>
          <StatsCounter stats={STATS} />
        </Container>
      </section>

      {/* ── 8 · Explore Our Campus (gallery) ── */}
      <section className="bg-white py-16 lg:py-24">
        <Container>
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="flex justify-center"><Eyebrow>Our Campus</Eyebrow></div>
            <h2 className="mt-4 text-3xl font-extrabold text-brand-ink lg:text-4xl">Explore Our Campus</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-brand-muted">
              A safe, vibrant and well-equipped environment designed for learning and growth.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {CAMPUS_GALLERY.map((c) => (
              <ImageFrame key={c.label} src={c.img} caption={c.label} tone={c.tone} className="h-[200px] lg:h-[300px]" />
            ))}
          </div>
        </Container>
      </section>

      {/* ── 9 · Campus deep-dives (alternating zig-zag) ── */}
      <section className="py-16 lg:py-24" style={{ background: "#f7f8fd" }}>
        <Container>
          <div className="space-y-14 lg:space-y-24">
            {CAMPUS.map((c, i) => {
              const flip = i % 2 === 1;
              return (
                <div key={c.title} className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16">
                  <ImageFrame
                    src={c.img}
                    label={c.eyebrow}
                    tone={c.tone}
                    className={`h-[280px] lg:h-[400px] shadow-card-lg ${flip ? "lg:order-2" : ""}`}
                  />
                  <div className={flip ? "lg:order-1" : ""}>
                    <span className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-brand-navy shadow-card">
                      <Icon name={c.icon} className="h-4 w-4 text-brand-orange" />
                      {c.eyebrow}
                    </span>
                    <h3 className="mt-4 text-2xl font-extrabold leading-tight text-brand-ink lg:text-[2rem]">{c.title}</h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-brand-muted">{c.body}</p>
                    <ul className="mt-6 space-y-3">
                      {c.points.map((p) => (
                        <li key={p} className="flex items-center gap-3 text-[14.5px] font-medium text-brand-ink">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-orange/15 text-brand-orange">
                            <Icon name="check" className="h-3.5 w-3.5" />
                          </span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ── 10 · Safety & Wellbeing (navy band) ── */}
      <section className="relative overflow-hidden bg-brand-navy py-16 lg:py-24">
        <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-brand-orange/15 blur-3xl" />
        <Container className="relative">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <div>
              <Eyebrow>Safety & Student Wellbeing</Eyebrow>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight text-white lg:text-4xl">
                A Campus Where Parents Feel at Ease
              </h2>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/70">
                Your child&apos;s safety is the foundation of everything. From secure premises to
                attentive care, we protect every learner so they can focus on growing.
              </p>
              <ImageFrame src={`${IMG}/safety.jpg`} label="Campus Safety" tone="orange" className="mt-7 hidden h-[220px] lg:block ring-1 ring-white/10" />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {SAFETY.map((s) => (
                <div key={s.title} className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur transition-colors hover:bg-white/10">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange/20 text-brand-orange">
                    <Icon name={s.icon} className="h-5 w-5" />
                  </div>
                  <h3 className="text-[14.5px] font-bold text-white">{s.title}</h3>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-white/60">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── 11 · Why Families Trust Newton's ── */}
      <section className="bg-white py-16 lg:py-24">
        <Container>
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <div className="flex justify-center"><Eyebrow>Top Reasons</Eyebrow></div>
            <h2 className="mt-4 text-3xl font-extrabold text-brand-ink lg:text-4xl">Why Families Trust Newton&apos;s</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-brand-muted">
              Eight reasons parents across our community choose Newton&apos;s for their children.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_CHOOSE.map((w) => (
              <div key={w.title} className="group rounded-2xl border border-slate-100 bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-lg">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110" style={{ background: w.bg, color: w.accent }}>
                  <Icon name={w.icon} />
                </div>
                <h3 className="text-[15px] font-bold leading-snug text-brand-ink">{w.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-brand-muted">{w.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 12 · Core Values ── */}
      <section className="py-16 lg:py-24" style={{ background: "#f7f8fd" }}>
        <Container>
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <div className="flex justify-center"><Eyebrow>What We Stand For</Eyebrow></div>
            <h2 className="mt-4 text-3xl font-extrabold text-brand-ink lg:text-4xl">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div key={v.title} className="group overflow-hidden rounded-2xl bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-lg">
                <div className="h-1.5 w-full" style={{ background: v.accent }} />
                <div className="p-7">
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: v.bg, color: v.accent }}>
                    <Icon name={v.icon} />
                  </div>
                  <h3 className="text-[17px] font-extrabold text-brand-ink">{v.title}</h3>
                  <p className="mt-2.5 text-[13.5px] leading-relaxed text-brand-muted">{v.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 13 · Parent Testimonials ── */}
      <section className="bg-white py-16 lg:py-24">
        <Container>
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <div className="flex justify-center"><Eyebrow>Parent Voices</Eyebrow></div>
            <h2 className="mt-4 text-3xl font-extrabold text-brand-ink lg:text-4xl">What Parents Say</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="group relative flex flex-col rounded-3xl border border-slate-100 bg-white p-8 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-lg">
                <svg viewBox="0 0 24 24" fill="currentColor" className="mb-5 h-8 w-8 text-brand-orange/30" aria-hidden>
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <blockquote className="flex-1 text-[14.5px] leading-relaxed text-brand-ink">{t.quote}</blockquote>
                <figcaption className="mt-6 flex items-center gap-4 border-t border-slate-100 pt-5">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-navy to-[#2b34a0] text-[14px] font-extrabold text-white">
                    {initials(t.name)}
                  </span>
                  <span>
                    <span className="block text-[14px] font-bold text-brand-ink">{t.name}</span>
                    <span className="block text-[12px] text-brand-muted">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 14 · Facilities at a glance ── */}
      <section className="py-16 lg:py-24" style={{ background: "#f7f8fd" }}>
        <Container>
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="flex justify-center"><Eyebrow>At a Glance</Eyebrow></div>
            <h2 className="mt-4 text-3xl font-extrabold text-brand-ink lg:text-4xl">School Facilities</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {FACILITIES.map((f) => (
              <div key={f.title} className="group flex flex-col items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-7 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-lg">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-navy/6 text-brand-navy transition-colors duration-300 group-hover:bg-brand-navy group-hover:text-white">
                  <Icon name={f.icon} />
                </span>
                <h3 className="text-[13.5px] font-bold text-brand-ink">{f.title}</h3>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 15 · Image Gallery (masonry) ── */}
      <section className="bg-white py-16 lg:py-24">
        <Container>
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="flex justify-center"><Eyebrow>Life at Newton&apos;s</Eyebrow></div>
            <h2 className="mt-4 text-3xl font-extrabold text-brand-ink lg:text-4xl">Moments From Our School</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-brand-muted">
              A glimpse of everyday life — placeholders ready for your photographs.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {MASONRY.map((m, i) => (
              <ImageFrame key={i} src={m.img} caption={m.label} tone={m.tone} className={m.span} />
            ))}
          </div>
        </Container>
      </section>

      {/* ── 16 · Admissions CTA ── */}
      <section className="relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr]">
          <div className="relative z-10 flex flex-col justify-center bg-brand-navy px-8 py-14 lg:px-14 lg:py-20">
            <Eyebrow>Admissions Open</Eyebrow>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-white lg:text-4xl">
              Give Your Child the Best Start for Success
            </h2>
            <p className="mb-8 mt-4 max-w-sm text-[15px] leading-relaxed text-white/70">
              Join a learning community that nurtures academic excellence, strong character and future-ready skills.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button href="/admissions/enquire-now" size="lg">Enquire Now</Button>
              <Button href="/admissions/how-to-apply" size="lg" variant="outline-light">Apply Now</Button>
              <Button href="/admissions/how-to-apply" size="lg" variant="ghost-light" arrow>Book a Tour</Button>
            </div>
          </div>
          <ImageFrame src={`${IMG}/admission-cta.jpg`} label="Admissions Image" tone="orange" rounded="rounded-none" className="h-[300px] min-h-[300px] lg:h-auto" />
        </div>
      </section>

      {/* ── Accreditations ── */}
      <AccreditationsBanner />
    </>
  );
}
