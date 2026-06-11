import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/Button";
import { Container } from "~/components/layout/Container";
import { AdmissionsSubNav } from "~/components/admissions/AdmissionsSubNav";
import { AccreditationsBanner } from "~/components/admissions/AccreditationsBanner";
import { FeeAccordion } from "~/components/admissions/FeeAccordion";

/* ── Data ────────────────────────────────────────────────────────────────── */

const FEE_SECTIONS = [
  {
    id: "pre-primary",
    stage: "Pre-Primary School",
    ageGroup: "Age Group: 3 – 5 Years",
    description:
      "Young learners develop foundational literacy, numeracy, communication, and social skills through play-based learning and engaging classroom experiences.",
    rows: [
      {
        cls: "Nursery, LKG, UKG",
        schoolFee: "₹13,000",
        busFee: "₹13,000",
        total: "₹26,000",
      },
    ],
    ctaLabel: "Discover more about Pre-Primary School",
    ctaHref: "/learning-journey/pre-primary",
  },
  {
    id: "primary",
    stage: "Primary School",
    ageGroup: "Grades 1 – 5",
    description:
      "Students build strong academic foundations while developing creativity, confidence, communication skills, and discipline through structured learning.",
    rows: [
      {
        cls: "Grade 1 – Grade 5",
        schoolFee: "₹15,000",
        busFee: "₹13,000",
        total: "₹28,000",
      },
    ],
    ctaLabel: "Discover more about Primary School",
    ctaHref: "/learning-journey/primary",
  },
  {
    id: "upper-primary",
    stage: "Upper Primary School",
    ageGroup: "Grades 6 – 8",
    description:
      "Students strengthen subject knowledge, critical thinking, leadership qualities, and participation in co-curricular and extracurricular activities.",
    rows: [
      {
        cls: "Grade 6 – Grade 8",
        schoolFee: "₹22,000",
        busFee: "₹13,000",
        total: "₹35,000",
      },
    ],
    ctaLabel: "Discover more about Upper Primary School",
    ctaHref: "/learning-journey/upper-primary",
  },
  {
    id: "secondary-ssc",
    stage: "Secondary School (SSC)",
    ageGroup: "Grades 9 – 10",
    description:
      "Students receive focused SSC Board preparation, concept-based learning, regular assessments, career awareness guidance, and personalised academic support.",
    rows: [
      {
        cls: "Grade 9 – Grade 10",
        schoolFee: "₹30,000",
        busFee: "₹13,000",
        total: "₹43,000",
      },
    ],
    ctaLabel: "Discover more about Secondary School",
    ctaHref: "/learning-journey/secondary-ssc",
  },
] as const;

const ADDITIONAL_SERVICES = [
  {
    title: "School Transportation",
    body: "Safe and secure school bus facility for daily commute across key locations near the school.",
    image: "/images/sections/admissions/students-campus.jpg",
  },
  {
    title: "Student Activities",
    body: "Participation in sports, cultural programs, annual celebrations, and inter-school competitions.",
    image: "/images/sections/admissions/sports-activities.png",
  },
  {
    title: "Uniforms & Textbooks",
    body: "Uniforms, books, notebooks, and stationery are purchased separately and are not included in the annual fee.",
    image: "/images/sections/admissions/quality-ssc-education.png",
  },
  {
    title: "Academic Support",
    body: "Additional academic guidance and student support programs provided throughout the academic year.",
    image: "/images/sections/admissions/faculty-mentorship.png",
  },
];

/* ── Fee Table ───────────────────────────────────────────────────────────── */

function FeeTable({
  rows,
}: {
  rows: readonly { cls: string; schoolFee: string; busFee: string; total: string }[];
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-brand-navy">
            <th
              scope="col"
              className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-white/80"
            >
              Class
            </th>
            <th
              scope="col"
              className="px-5 py-4 text-center text-[11px] font-bold uppercase tracking-wide text-white/80"
            >
              School Fee
              <div className="text-[10px] font-normal normal-case opacity-70">
                per year
              </div>
            </th>
            <th
              scope="col"
              className="px-5 py-4 text-center text-[11px] font-bold uppercase tracking-wide text-white/80"
            >
              Bus Fee
              <div className="text-[10px] font-normal normal-case opacity-70">
                per year
              </div>
            </th>
            <th
              scope="col"
              className="px-5 py-4 text-center text-[11px] font-bold uppercase tracking-wide text-white"
            >
              Total Annual Fee
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, j) => (
            <tr
              key={row.cls}
              className={`border-b border-slate-100 last:border-0 ${
                j % 2 === 0 ? "bg-white" : "bg-slate-50/50"
              }`}
            >
              <td className="px-5 py-4 font-semibold text-brand-ink">
                {row.cls}
              </td>
              <td className="px-5 py-4 text-center text-brand-muted">
                {row.schoolFee}
              </td>
              <td className="px-5 py-4 text-center text-brand-muted">
                {row.busFee}
              </td>
              <td className="px-5 py-4 text-center text-[15px] font-extrabold text-brand-orange">
                {row.total}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────── */

export default function TuitionFeesPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative h-[280px] lg:h-[340px] overflow-hidden">
        <Image
          src="/images/sections/admissions/students-campus.jpg"
          alt="Newton's High School students"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-brand-navy/40" />
      </section>

      {/* ── Admissions sub-nav ── */}
      <AdmissionsSubNav />

      {/* ── Breadcrumb ── */}
      <nav className="border-b border-slate-100 bg-white py-3">
        <Container>
          <ol className="flex items-center gap-1.5 text-sm text-brand-muted">
            <li>
              <Link href="/" className="transition hover:text-brand-navy" aria-label="Home">
                <svg viewBox="0 0 20 20" fill="currentColor" className="inline h-4 w-4 -mt-0.5" aria-hidden>
                  <path d="M10.707 2.293a1 1 0 0 0-1.414 0l-7 7A1 1 0 0 0 3 11h1v6a1 1 0 0 0 1 1h4v-5h2v5h4a1 1 0 0 0 1-1v-6h1a1 1 0 0 0 .707-1.707l-7-7z" />
                </svg>
              </Link>
            </li>
            <li className="text-slate-300">›</li>
            <li>
              <Link href="/admissions" className="transition hover:text-brand-navy">
                Admissions
              </Link>
            </li>
            <li className="text-slate-300">›</li>
            <li className="font-semibold text-brand-navy">Tuition fees</li>
          </ol>
        </Container>
      </nav>

      {/* ── Page header ── */}
      <section className="border-b border-slate-100 bg-white py-12 lg:py-16">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-5 text-4xl font-extrabold text-brand-ink lg:text-5xl">
              Tuition fees
            </h1>
            <p className="text-[16px] leading-relaxed text-brand-muted">
              At Newton&apos;s High School, we believe in providing quality SSC education at an
              affordable fee structure. Our transparent fee system helps parents clearly
              understand the academic and transportation costs associated with their child&apos;s
              education.
            </p>
          </div>
        </Container>
      </section>

      {/* ── Sticky fee category tabs ── */}
      <div className="sticky top-[100px] z-30 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {FEE_SECTIONS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex-shrink-0 whitespace-nowrap border-b-2 border-transparent px-6 py-4 text-[13.5px] font-medium text-brand-muted transition-colors duration-200 hover:border-brand-orange hover:text-brand-navy"
              >
                {section.stage}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Fee sections ── */}
      {FEE_SECTIONS.map((section, i) => (
        <section
          key={section.id}
          id={section.id}
          className={`scroll-mt-[160px] py-14 lg:py-20 ${i % 2 === 0 ? "bg-white" : ""}`}
          style={i % 2 !== 0 ? { background: "#f7f8fd" } : undefined}
        >
          <Container>
            <div className="mx-auto max-w-4xl">
              {/* Section heading */}
              <div className="mb-10 text-center">
                <h2 className="mb-2 text-2xl font-extrabold text-brand-ink lg:text-[2rem]">
                  {section.stage}
                </h2>
                <p className="mb-4 text-sm font-bold uppercase tracking-widest text-brand-orange">
                  {section.ageGroup}
                </p>
                <p className="mx-auto max-w-2xl text-[15px] leading-relaxed text-brand-muted">
                  {section.description}
                </p>
              </div>

              {/* Fee table */}
              <div className="mb-10">
                <FeeTable rows={section.rows} />
              </div>

              {/* CTA */}
              <div className="text-center">
                <Button href={section.ctaHref} size="lg">
                  {section.ctaLabel}
                </Button>
              </div>
            </div>
          </Container>
        </section>
      ))}

      {/* ── Transport fee ── */}
      <section className="bg-white py-14 lg:py-20">
        <Container>
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center">
              <h2 className="mb-4 text-2xl font-extrabold text-brand-ink lg:text-[2rem]">
                Transport fees
              </h2>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-card mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-brand-navy">
                    <th
                      scope="col"
                      className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-white/80"
                    >
                      Service
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-4 text-center text-[11px] font-bold uppercase tracking-wide text-white"
                    >
                      Annual Fee
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100 last:border-0 bg-white">
                    <td className="px-5 py-4 font-semibold text-brand-ink">
                      School Bus Facility
                    </td>
                    <td className="px-5 py-4 text-center text-[15px] font-extrabold text-brand-orange">
                      ₹13,000
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-center text-[14px] leading-relaxed text-brand-muted">
              Safe and reliable transportation is available for students across nearby
              locations with trained drivers and attendants ensuring student safety at all times.
            </p>
          </div>
        </Container>
      </section>

      {/* ── Additional services ── */}
      <section className="py-14 lg:py-20" style={{ background: "#ECEAFB" }}>
        <Container>
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-2xl font-extrabold text-brand-ink lg:text-3xl">
              Additional services
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ADDITIONAL_SERVICES.map((service) => (
              <div
                key={service.title}
                className="group overflow-hidden rounded-2xl bg-white shadow-card hover:shadow-card-lg transition-all duration-300"
              >
                <div className="relative h-[180px]">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div className="p-5">
                  <h3 className="mb-2 text-[15px] font-bold text-brand-ink">
                    {service.title}
                  </h3>
                  <p className="text-[13px] leading-relaxed text-brand-muted">
                    {service.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Terms and disclaimers ── */}
      <section className="bg-white py-14 lg:py-20">
        <Container>
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-extrabold text-brand-ink lg:text-3xl">
                Terms and disclaimers
              </h2>
            </div>
            <FeeAccordion />
          </div>
        </Container>
      </section>

      {/* ── Enquire Now CTA ── */}
      <section className="relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr]">
          {/* Left: navy panel */}
          <div className="relative z-10 flex flex-col justify-center bg-brand-navy px-8 py-14 lg:px-14 lg:py-20">
            <span className="mb-4 inline-block text-[11px] font-bold uppercase tracking-widest text-brand-orange">
              Admissions Open
            </span>
            <h2 className="mb-4 text-3xl font-extrabold text-white leading-tight lg:text-4xl">
              Enquire now
            </h2>
            <p className="mb-8 max-w-sm text-[15px] leading-relaxed text-white/70">
              Speak with our admissions team to learn more about Newton&apos;s High School fee
              structure, facilities, and SSC curriculum programs.
            </p>
            <div>
              <Button href="/admissions/enquire-now" size="lg">
                Enquire Now
              </Button>
            </div>
          </div>

          {/* Right: image */}
          <div className="relative h-[320px] min-h-[320px] lg:h-auto">
            <Image
              src="/images/sections/admissions/students-campus.jpg"
              alt="Newton's High School students"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/30 to-transparent" />
          </div>
        </div>
      </section>

      {/* ── Accreditations ── */}
      <AccreditationsBanner />
    </>
  );
}
