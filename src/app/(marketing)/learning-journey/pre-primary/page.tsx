import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/Button";
import { Container } from "~/components/layout/Container";
import { StageNav } from "~/components/learning-journey/StageNav";
import { CurriculumTabs } from "~/components/learning-journey/CurriculumTabs";
import type { CurriculumTab } from "~/components/learning-journey/CurriculumTabs";

/* ── Page data ─────────────────────────────────────────────────────────── */

const FEATURES = [
  {
    title: "Play-Based Early Learning",
    body: "Building strong cognitive and motor skills through structured play, discovery-based activities, and meaningful exploration rooted in the Telangana SSC foundational framework.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    title: "Trilingual Foundation",
    body: "Children develop confidence in Telugu, Hindi, and English through immersive storytelling, songs, and daily communication activities designed for young language learners.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    title: "Life Skills for Tomorrow",
    body: "Social-emotional skills, mindfulness, self-regulation, and independence are woven into every part of the school day, nurturing the whole child for lifelong confidence.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
];

const CURRICULUM_TABS: CurriculumTab[] = [
  {
    id: "cognitive",
    label: "Cognitive Development",
    heading: "Exploring early Maths skills through play, discovery and collaboration",
    body: "At our pre-primary school in Hyderabad, children build early mathematical understanding by engaging with the world around them. Through playful exploration, hands-on activities and meaningful conversations, they begin to notice patterns, compare quantities and solve problems.",
    points: [
      "Number recognition and early counting activities",
      "Pattern-making, sorting and classifying games",
      "Spatial reasoning through building and construction",
      "Problem-solving through everyday classroom challenges",
    ],
    image: "/images/sections/learning-journey/pre-primary/academic-achievement.png",
  },
  {
    id: "language",
    label: "Language & Literacy",
    heading: "Nurturing a love for reading, writing and spoken language",
    body: "Language development is at the heart of our programme. Children explore stories, poetry, and conversations in Telugu, English, and Hindi, building vocabulary and communication skills naturally through a language-rich classroom environment.",
    points: [
      "Daily storytime and interactive read-aloud sessions",
      "Early phonics awareness and letter recognition",
      "Trilingual communication in Telugu, English, and Hindi",
      "Expressive language through puppet shows and drama",
    ],
    image: "/images/sections/learning-journey/pre-primary/multilingualism.png",
  },
  {
    id: "arts",
    label: "Fine Arts",
    heading: "Expressing ideas and emotions through art, craft and music",
    body: "Creative arts help children express themselves freely and build confidence. Through painting, clay work, craft, and movement, children develop their imagination, fine motor skills, and an early aesthetic sensibility.",
    points: [
      "Painting, sketching, and collage-making sessions",
      "Clay modelling and three-dimensional sculpture",
      "Music, rhythm, percussion and movement activities",
      "Performance, storytelling and puppet theatre",
    ],
    image: "/images/sections/learning-journey/pre-primary/holistic-development.png",
  },
  {
    id: "physical",
    label: "Physical Education",
    heading: "Growing strong bodies through movement and outdoor play",
    body: "Physical development is fundamental at this age. Our structured PE sessions and free play develop gross motor skills, coordination, spatial awareness, and a lifelong love of physical activity in a safe, encouraging environment.",
    points: [
      "Structured yoga, stretching and breathing routines",
      "Outdoor games, team activities and cooperative play",
      "Balance, coordination and locomotor movement skills",
      "Sensory play and fine motor development through crafts",
    ],
    image: "/images/sections/learning-journey/pre-primary/sports-activities.png",
  },
  {
    id: "social",
    label: "Social & Emotional",
    heading: "Building friendships, empathy and emotional resilience",
    body: "Social-emotional learning is woven into every aspect of school life. Children learn to identify emotions, resolve conflicts peacefully, and build meaningful friendships in a caring, inclusive, and nurturing classroom community.",
    points: [
      "Circle time, mindfulness and gratitude practices",
      "Guided conflict resolution and peer collaboration",
      "Self-regulation strategies and emotional vocabulary",
      "Community responsibility and care for the environment",
    ],
    image: "/images/sections/learning-journey/pre-primary/life-competencies.png",
  },
];

const TYPICAL_DAY = [
  {
    time: "7:30 AM",
    title: "Start of school",
    body: "A warm and inviting start, where staff greet children and parents at the school gate.",
    color: "#FFF5E5",
    accent: "#F39200",
  },
  {
    time: "8:00 AM",
    title: "Morning circle time",
    body: "Children share, sing together and set a positive intention for the learning day ahead.",
    color: "#EEF2FF",
    accent: "#060C8B",
  },
  {
    time: "9:00 AM",
    title: "Learning and discovering",
    body: "Structured activities across Maths, Language, and Life Skills spark curiosity and joy.",
    color: "#F0FDF4",
    accent: "#16a34a",
  },
  {
    time: "10:30 AM",
    title: "Breakfast break",
    body: "Children enjoy a calm meal to refuel their energy for the busy second half of the day.",
    color: "#FFF5E5",
    accent: "#F39200",
  },
  {
    time: "11:00 AM",
    title: "Creative arts & play",
    body: "Painting, craft, music and outdoor exploration bring imagination and laughter to life.",
    color: "#FDF4FF",
    accent: "#9333ea",
  },
  {
    time: "12:30 PM",
    title: "Story time & wind-down",
    body: "Read-aloud sessions build vocabulary and a lifelong love of books before the day ends.",
    color: "#EEF2FF",
    accent: "#060C8B",
  },
];

const PILLARS = [
  { label: "Academic Achievement", image: "/images/sections/learning-journey/pre-primary/academic-achievement.png" },
  { label: "Life Competencies", image: "/images/sections/learning-journey/pre-primary/life-competencies.png" },
  { label: "Multilingualism", image: "/images/sections/learning-journey/pre-primary/multilingualism.png" },
];

const RELATED_CARDS = [
  {
    label: "Primary School",
    ages: "Ages 6 – 11",
    href: "/learning-journey/primary",
    image: "/images/sections/learning-journey/_stage-cards/primary.png",
  },
  {
    label: "Upper Primary School",
    ages: "Ages 11 – 14",
    href: "/learning-journey/upper-primary",
    image: "/images/sections/learning-journey/_stage-cards/upper-primary.png",
  },
  {
    label: "Secondary School (SSC)",
    ages: "Ages 14 – 16",
    href: "/learning-journey/secondary-ssc",
    image: "/images/sections/learning-journey/_stage-cards/secondary.png",
  },
];

/* ── Page ──────────────────────────────────────────────────────────────── */

export default function PrePrimaryPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative h-[460px] lg:h-[560px] overflow-hidden">
        <Image
          src="/images/sections/learning-journey/pre-primary/hero.png"
          alt="Newton's Pre-Primary School — joyful young learners"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#060C8B]/90 via-[#060C8B]/60 to-transparent" />
        <div className="absolute inset-0 flex items-end lg:items-center pb-12 lg:pb-0">
          <Container>
            <div className="max-w-lg">
              <span className="mb-4 inline-block rounded-full border border-brand-orange/50 bg-brand-orange/15 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-brand-orange">
                Ages 3½ – 5½
              </span>
              <h1 className="text-4xl lg:text-6xl font-extrabold text-white leading-tight mb-5">
                Pre-Primary<br />School
              </h1>
              <p className="text-base lg:text-lg text-white/80 mb-8 leading-relaxed">
                A joyful foundation for curious, confident young learners rooted in the
                Telangana SSC curriculum.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button href="/admissions/enquire-now" size="lg">
                  Enquire Now
                </Button>
                <Button href="/admissions/tuition-fees" size="lg" variant="outline-light">
                  View Fees
                </Button>
              </div>
            </div>
          </Container>
        </div>
      </section>

      {/* ── Stage navigation ── */}
      <StageNav />

      {/* ── Breadcrumb ── */}
      <nav className="bg-white border-b border-slate-100 py-3">
        <Container>
          <ol className="flex items-center gap-1.5 text-sm text-brand-muted">
            <li>
              <Link href="/" className="transition hover:text-brand-navy">
                Home
              </Link>
            </li>
            <li className="text-slate-300">/</li>
            <li>
              <Link href="/learning-journey" className="transition hover:text-brand-navy">
                Learning Journey
              </Link>
            </li>
            <li className="text-slate-300">/</li>
            <li className="font-medium text-brand-navy">Pre-Primary School</li>
          </ol>
        </Container>
      </nav>

      {/* ── Introduction ── */}
      <section className="py-16 lg:py-24 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-14">
            <h2 className="text-3xl lg:text-[42px] font-extrabold text-brand-ink leading-tight mb-5">
              Pre-Primary School in Hyderabad
            </h2>
            <p className="text-[16px] text-brand-muted leading-relaxed">
              Our youngest learners begin their educational journey in an environment designed to
              spark curiosity and wonder. Children aged 3½ to 5½ years develop social-emotional,
              cognitive and language skills, while expressing themselves creatively through art —
              laying strong foundations for their future.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl bg-white border border-slate-100 shadow-card p-7 hover:shadow-card-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-colors duration-200">
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-brand-ink mb-2">{f.title}</h3>
                <p className="text-sm text-brand-muted leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Our Curriculum ── */}
      <section className="py-16 lg:py-24" style={{ background: "#f7f8fd" }}>
        <Container>
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-brand-ink mb-4">
              Our curriculum
            </h2>
            <p className="text-[15px] text-brand-muted leading-relaxed">
              Our foundational curriculum is designed to support the developmental needs of each age
              group, focusing on social-emotional learning, cognitive and speech development, and
              creative expression.
            </p>
          </div>
          <CurriculumTabs tabs={CURRICULUM_TABS} />
        </Container>
      </section>

      {/* ── A Typical Day ── */}
      <section className="py-16 lg:py-24 bg-white">
        <Container>
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-brand-ink mb-4">
              A typical day at school in our Pre-Primary
            </h2>
            <p className="text-[15px] text-brand-muted leading-relaxed">
              Each day at Newton&apos;s School is filled with discovery, curiosity and joyful learning.
              Here is a glimpse of what a typical day looks like in our Pre-Primary class.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TYPICAL_DAY.map((item) => (
              <div
                key={item.title}
                className="group rounded-2xl border border-slate-100 p-6 shadow-card hover:shadow-card-lg hover:-translate-y-1 transition-all duration-300"
                style={{ background: item.color }}
              >
                {/* Time badge */}
                <span
                  className="mb-4 inline-block rounded-full px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white"
                  style={{ background: item.accent }}
                >
                  {item.time}
                </span>
                <h3 className="text-base font-bold text-brand-ink mb-2">{item.title}</h3>
                <p className="text-sm text-brand-muted leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Core Learning Pillars ── */}
      <section className="py-16 lg:py-24" style={{ background: "#f7f8fd" }}>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: text */}
            <div>
              <span className="mb-3 inline-block text-[11px] font-bold uppercase tracking-widest text-brand-orange">
                Learning Philosophy
              </span>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-brand-ink mb-5 leading-tight">
                Core Learning Pillars
              </h2>
              <p className="text-[15px] text-brand-muted leading-relaxed mb-8">
                At our pre-primary school in Hyderabad, children develop key life skills such as
                problem-solving, empathy and self-regulation through hands-on activities. Our daily
                sessions, reflections and collaborative play foster cognitive skills, creativity and
                global awareness — laying the foundation for lifelong learning and growth.
              </p>
              <ul className="space-y-4">
                {[
                  "Play-based, discovery-led learning every day",
                  "Strong emphasis on social-emotional wellbeing",
                  "Trilingual environment — Telugu, Hindi, English",
                  "Creative arts integrated across all subjects",
                  "Outdoor learning and physical development",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3 text-[14.5px] text-brand-ink">
                    <span className="mt-[6px] h-2 w-2 shrink-0 rounded-full bg-brand-orange" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: image grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Large top image */}
              <div className="relative col-span-2 h-[220px] rounded-2xl overflow-hidden shadow-card-lg">
                <Image
                  src={PILLARS[0].image}
                  alt={PILLARS[0].label}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <span className="absolute bottom-3 left-4 text-sm font-semibold text-white">
                  {PILLARS[0].label}
                </span>
              </div>
              {/* Two smaller images */}
              {PILLARS.slice(1).map((p) => (
                <div key={p.label} className="relative h-[160px] rounded-2xl overflow-hidden shadow-card">
                  <Image
                    src={p.image}
                    alt={p.label}
                    fill
                    className="object-cover"
                    sizes="25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <span className="absolute bottom-3 left-3 text-xs font-semibold text-white">
                    {p.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── When to enrol ── */}
      <section className="py-16 lg:py-20 bg-white">
        <Container>
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-brand-ink mb-4">
              When to enrol
            </h2>
            <p className="text-[15px] text-brand-muted leading-relaxed mb-8">
              At Newton&apos;s School, we provide flexible enrolment options for our Pre-Primary
              programme throughout the year. Our admissions team is available to understand your
              needs and help choose the ideal start date for your child.
            </p>
            <Button href="/admissions/enquire-now" size="lg">
              Grow with confidence! Apply now
            </Button>
          </div>
        </Container>
      </section>

      {/* ── Related journey cards ── */}
      <section className="py-16 lg:py-20" style={{ background: "#f7f8fd" }}>
        <Container>
          <div className="mb-10 text-center">
            <h2 className="text-2xl lg:text-3xl font-extrabold text-brand-ink">
              Continue the learning journey
            </h2>
            <p className="mt-2 text-sm text-brand-muted">
              Explore the next stages at Newton&apos;s High School
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {RELATED_CARDS.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group relative h-[260px] rounded-2xl overflow-hidden shadow-card hover:shadow-card-lg transition-all duration-300 hover:-translate-y-1"
              >
                <Image
                  src={card.image}
                  alt={card.label}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                {/* Text */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-white/70 mb-1">
                    {card.ages}
                  </p>
                  <h3 className="text-base font-extrabold text-white leading-tight">{card.label}</h3>
                </div>
                {/* Arrow */}
                <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                    aria-hidden
                  >
                    <polyline points="9 6 15 12 9 18" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

    </>
  );
}
