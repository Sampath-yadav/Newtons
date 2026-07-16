import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/Button";
import { Container } from "~/components/layout/Container";
import { AdmissionsSubNav } from "~/components/admissions/AdmissionsSubNav";
import { AccreditationsBanner } from "~/components/admissions/AccreditationsBanner";
import { FeeAccordion } from "~/components/admissions/FeeAccordion";

/* ── SEO ─────────────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Tuition Fees | Newton's High School Banswada | SSC School Fee Structure",
  description:
    "View the complete fee structure for Newton's High School, Banswada. Transparent annual school fees and transport fees for Pre-Primary through SSC (Classes 9-10). Affordable quality SSC education in Nizamabad, Telangana.",
};

/* ── Data ────────────────────────────────────────────────────────────────── */

const SUMMARY_ROWS = [
  { stage: "Pre-Primary (Nursery–UKG)", schoolFee: "₹13,000", busFee: "₹13,000", total: "₹26,000" },
  { stage: "Primary (Grades 1–5)", schoolFee: "₹15,000", busFee: "₹13,000", total: "₹28,000" },
  { stage: "Upper Primary (Gr. 6–8)", schoolFee: "₹22,000", busFee: "₹13,000", total: "₹35,000" },
  { stage: "Secondary SSC (Gr. 9–10)", schoolFee: "₹30,000", busFee: "₹13,000", total: "₹43,000" },
];

const FEE_SECTIONS = [
  {
    id: "pre-primary",
    stage: "Pre-Primary School",
    ageGroup: "Age Group: 3–5 Years   Nursery, LKG, UKG",
    description:
      "Newton's Pre-Primary programme gives children aged 3 to 5 years a joyful, secure, and stimulating start to school life. Through play-based learning, trilingual language activities (Telugu, Hindi, and English), creative arts, and daily social-emotional practice, our youngest students build the confidence, curiosity, and foundational skills that set them up for a strong Primary School experience.",
    rows: [
      { cls: "Nursery", schoolFee: "₹13,000", busFee: "₹13,000", total: "₹26,000" },
      { cls: "LKG", schoolFee: "₹13,000", busFee: "₹13,000", total: "₹26,000" },
      { cls: "UKG", schoolFee: "₹13,000", busFee: "₹13,000", total: "₹26,000" },
    ],
    note: "School fee covers all Pre-Primary academic instruction, classroom activities, and participation in Newton's school events and programmes. Bus fee is optional — charged only for students who use the Newton's school bus service.",
    ctaLabel: "Discover more about Pre-Primary School",
    ctaHref: "/learning-journey/pre-primary",
  },
  {
    id: "primary",
    stage: "Primary School",
    ageGroup: "Grades 1–5   Ages 6–11",
    description:
      "Our Primary programme (Classes 1 to 5) delivers the full Telangana SSC Primary curriculum across nine subjects — Telugu, Hindi, English, Mathematics, Science, Computer Fundamentals, Physical Education, Arts and Creativity, and Value Education. Active classrooms, structured teaching, and regular assessment help every student build the strong academic foundations and personal disciplines that Upper Primary and Secondary School demand.",
    rows: [
      { cls: "Grade 1", schoolFee: "₹15,000", busFee: "₹13,000", total: "₹28,000" },
      { cls: "Grade 2", schoolFee: "₹15,000", busFee: "₹13,000", total: "₹28,000" },
      { cls: "Grade 3", schoolFee: "₹15,000", busFee: "₹13,000", total: "₹28,000" },
      { cls: "Grade 4", schoolFee: "₹15,000", busFee: "₹13,000", total: "₹28,000" },
      { cls: "Grade 5", schoolFee: "₹15,000", busFee: "₹13,000", total: "₹28,000" },
    ],
    note: "School fee covers all nine Primary curriculum subjects, classroom activities, and participation in Newton's annual events including Vana Mahotsavam, sports day, and cultural celebrations. Bus fee is optional.",
    ctaLabel: "Discover more about Primary School",
    ctaHref: "/learning-journey/primary",
  },
  {
    id: "upper-primary",
    stage: "Upper Primary School",
    ageGroup: "Grades 6–8   Ages 11–14",
    description:
      "Newton's Upper Primary programme (Classes 6 to 8) is the structured bridge between foundational learning and SSC Board Examination preparation. Students deepen subject knowledge across ten Telangana SSC curriculum subjects, develop critical thinking and communication skills, and take on genuine leadership responsibilities through school events, student clubs, and co-curricular activities — all while building the personal discipline and independent study habits that Class 9 and 10 will require.",
    rows: [
      { cls: "Grade 6", schoolFee: "₹22,000", busFee: "₹13,000", total: "₹35,000" },
      { cls: "Grade 7", schoolFee: "₹22,000", busFee: "₹13,000", total: "₹35,000" },
      { cls: "Grade 8", schoolFee: "₹22,000", busFee: "₹13,000", total: "₹35,000" },
    ],
    note: "School fee covers all Upper Primary curriculum subjects, co-curricular club participation, and Newton's full annual school programme. Bus fee is optional.",
    ctaLabel: "Discover more about Upper Primary School",
    ctaHref: "/learning-journey/upper-primary",
  },
  {
    id: "secondary-ssc",
    stage: "Secondary School (SSC)",
    ageGroup: "Grades 9–10   Ages 14–16",
    description:
      "Newton's Secondary School programme (Classes 9 and 10) delivers focused, comprehensive Telangana SSC Board Examination preparation. Experienced specialist teachers, a structured six-step examination framework, weekly and monthly assessments, daily doubt-clearing sessions, and career guidance for Intermediate stream selection ensure that every student at Newton's arrives at the board examination thoroughly prepared — academically and personally.",
    rows: [
      { cls: "Grade 9", schoolFee: "₹30,000", busFee: "₹13,000", total: "₹43,000" },
      { cls: "Grade 10", schoolFee: "₹30,000", busFee: "₹13,000", total: "₹43,000" },
    ],
    note: "School fee covers the complete Telangana SSC curriculum across all six subjects, board examination preparation programme, regular assessments, career guidance sessions, and full participation in Newton's school events and activities. Bus fee is optional.",
    ctaLabel: "Discover more about Secondary School (SSC)",
    ctaHref: "/learning-journey/secondary-ssc",
  },
];

const INCLUDED_CARDS = [
  {
    icon: "🚌",
    tag: "Optional Add-On",
    tagClass: "bg-amber-100 text-amber-700",
    title: "School Transport",
    body: "Safe, supervised school bus facility operating daily across key routes near Newton's High School, Banswada. Available for all students from Pre-Primary to Class 10. Annual fee: ₹13,000 — charged separately from school tuition. Fully optional.",
  },
  {
    icon: "🏆",
    tag: "Included in School Fee",
    tagClass: "bg-emerald-100 text-emerald-700",
    title: "Student Activities and School Events",
    body: "Participation in all Newton's annual school programmes is included within the school fee — Vana Mahotsavam tree-plantation drive, Teachers' Day celebrations, Diwali and Independence Day performances, annual sports day, Science Exhibition, and inter-class competitions.",
  },
  {
    icon: "👔",
    tag: "Not Included — Purchased Separately",
    tagClass: "bg-slate-100 text-slate-600",
    title: "Uniforms, Books, and Stationery",
    body: "School uniforms, prescribed textbooks, notebooks, and stationery are not included in the annual school fee and must be purchased separately by families. A complete book list and uniform specification is provided at the time of admission confirmation.",
  },
  {
    icon: "📚",
    tag: "Included in School Fee",
    tagClass: "bg-emerald-100 text-emerald-700",
    title: "Academic Instruction and Support",
    body: "All classroom teaching, regular unit and monthly assessments, daily doubt-clearing sessions, and the academic support provided by Newton's subject teachers throughout the year are fully covered within the school fee. No additional coaching fee is charged for these standard academic services.",
  },
];

const TRANSPORT_NOTES = [
  "Annual bus fee of ₹13,000 applies equally to all students from Pre-Primary through Secondary School (SSC)",
  "Bus routes cover key areas near Bodhan Road, Banswada",
  "For specific route and stop details, contact Newton's admissions team on 098660 89343",
  "Bus facility is fully optional — families may arrange their own transportation at no additional charge",
];

/* ── Fee Table ───────────────────────────────────────────────────────────── */

function FeeTable({
  rows,
}: {
  rows: { cls: string; schoolFee: string; busFee: string; total: string }[];
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
              <div className="text-[10px] font-normal normal-case opacity-70">per year</div>
            </th>
            <th
              scope="col"
              className="px-5 py-4 text-center text-[11px] font-bold uppercase tracking-wide text-white/80"
            >
              Bus Fee
              <div className="text-[10px] font-normal normal-case opacity-70">per year</div>
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
              <td className="px-5 py-4 font-semibold text-brand-ink">{row.cls}</td>
              <td className="px-5 py-4 text-center text-brand-muted">{row.schoolFee}</td>
              <td className="px-5 py-4 text-center text-brand-muted">{row.busFee}</td>
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
          alt="Newton's High School Banswada students in science laboratory — SSC Classes 9 and 10 with microscope and chemistry equipment"
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
            <li className="font-semibold text-brand-navy">Tuition Fees</li>
          </ol>
        </Container>
      </nav>

      {/* ── Page header ── */}
      <section className="border-b border-slate-100 bg-white py-12 lg:py-16">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-brand-orange">
              Admissions
            </p>
            <h1 className="mb-4 text-4xl font-extrabold text-brand-ink lg:text-5xl">
              Tuition Fees
            </h1>
            <p className="mb-4 text-lg font-medium text-brand-muted">
              Clear, honest, and affordable — Newton&apos;s complete fee structure, explained in full.
            </p>
            <p className="text-[15px] leading-relaxed text-brand-muted">
              At Newton&apos;s High School, Banswada, we believe that quality SSC education should be
              accessible to every family in our community. Our fee structure is transparent and
              straightforward — with no hidden charges and no surprises.
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-brand-muted">
              The fees below cover the full academic year for each stage of schooling at Newton&apos;s.
              School fees and bus fees are listed separately so every family can make a fully informed
              decision about the services they require for their child.
            </p>
          </div>
        </Container>
      </section>

      {/* ── Quick summary table ── */}
      <section className="py-12 lg:py-16" style={{ background: "#f7f8fd" }}>
        <Container>
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 text-center">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-orange">
                Fee Overview
              </p>
              <h2 className="text-2xl font-extrabold text-brand-ink lg:text-3xl">
                Annual Fee Summary — All Stages
              </h2>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-card">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-brand-navy">
                    <th
                      scope="col"
                      className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-white/80"
                    >
                      Stage
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-4 text-center text-[11px] font-bold uppercase tracking-wide text-white/80"
                    >
                      School Fee/Year
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-4 text-center text-[11px] font-bold uppercase tracking-wide text-white/80"
                    >
                      Bus Fee/Year
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-4 text-center text-[11px] font-bold uppercase tracking-wide text-white"
                    >
                      Total/Year
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {SUMMARY_ROWS.map((row, i) => (
                    <tr
                      key={row.stage}
                      className={`border-b border-slate-100 last:border-0 ${
                        i % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                      }`}
                    >
                      <td className="px-5 py-4 font-semibold text-brand-ink">{row.stage}</td>
                      <td className="px-5 py-4 text-center text-brand-muted">{row.schoolFee}</td>
                      <td className="px-5 py-4 text-center text-brand-muted">{row.busFee}</td>
                      <td className="px-5 py-4 text-center text-[15px] font-extrabold text-brand-orange">
                        {row.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-center text-[13px] leading-relaxed text-brand-muted">
              Bus fee is optional and applies only to students using the Newton&apos;s school bus
              service. Uniforms, textbooks, and stationery are not included and are purchased
              separately.
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

              <div className="mb-5">
                <FeeTable rows={section.rows} />
              </div>

              <p className="mb-10 text-center text-[13px] leading-relaxed text-brand-muted">
                {section.note}
              </p>

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
            <div className="mb-8 text-center">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-orange">
                School Transport
              </p>
              <h2 className="mb-4 text-2xl font-extrabold text-brand-ink lg:text-[2rem]">
                Safe and Reliable School Bus Service
              </h2>
              <p className="mx-auto max-w-2xl text-[15px] leading-relaxed text-brand-muted">
                Newton&apos;s High School operates a daily school bus service covering key residential
                areas in and around Banswada. Our buses are driven by trained, experienced drivers and
                supervised by a responsible attendant at all times — so every parent can send their
                child to school with full confidence in their safety and punctuality.
              </p>
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
                    <td className="px-5 py-4 font-semibold text-brand-ink">School Bus Facility</td>
                    <td className="px-5 py-4 text-center text-[15px] font-extrabold text-brand-orange">
                      ₹13,000
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <ul className="space-y-3">
              {TRANSPORT_NOTES.map((note) => (
                <li
                  key={note}
                  className="flex items-start gap-3 text-[14px] leading-relaxed text-brand-muted"
                >
                  <span className="mt-[6px] h-2 w-2 flex-shrink-0 rounded-full bg-brand-orange" />
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* ── What is included ── */}
      <section className="py-14 lg:py-20" style={{ background: "#ECEAFB" }}>
        <Container>
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-orange">
              Included in Your Fee
            </p>
            <h2 className="mb-4 text-2xl font-extrabold text-brand-ink lg:text-3xl">
              What Newton&apos;s School Fee Covers
            </h2>
            <p className="text-[15px] leading-relaxed text-brand-muted">
              Here is a clear breakdown of what is and is not included in Newton&apos;s annual school
              fee — so every family knows exactly what they are paying for.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {INCLUDED_CARDS.map((card) => (
              <div
                key={card.title}
                className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-7 shadow-card"
              >
                <div className="text-3xl">{card.icon}</div>
                <span
                  className={`inline-block w-fit rounded-full px-3 py-1 text-[11px] font-bold tracking-wide ${card.tagClass}`}
                >
                  {card.tag}
                </span>
                <h3 className="text-[15px] font-bold text-brand-ink">{card.title}</h3>
                <p className="text-[13px] leading-relaxed text-brand-muted">{card.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Fee policies ── */}
      <section className="bg-white py-14 lg:py-20">
        <Container>
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-orange">
                Terms and Information
              </p>
              <h2 className="text-2xl font-extrabold text-brand-ink lg:text-3xl">
                Fee Policies and Important Information
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
              Have Questions About Fees or Admissions?
            </h2>
            <p className="mb-4 max-w-sm text-[15px] leading-relaxed text-white/70">
              Our admissions team at Newton&apos;s High School, Banswada is always ready to speak
              with you — whether you want to clarify any aspect of the fee structure, enquire about
              the bus routes serving your area, understand what is included in your child&apos;s
              school fee, or simply find out more about Newton&apos;s.
            </p>
            <p className="mb-8 max-w-sm text-[14px] leading-relaxed text-white/60">
              No question is too small. We are here to help every family make an informed, confident
              decision.
            </p>
            <div className="mb-8">
              <Button href="/admissions/enquire-now" size="lg">
                Enquire Now
              </Button>
            </div>
            <div className="space-y-2 text-[13px] text-white/60">
              <p>📞 098660 89343</p>
              <p>
                📍 Newton&apos;s High School, Bodhan Road, Banswada, Nizamabad – 503187, Telangana
              </p>
              <p>🕐 Monday to Saturday, 9:00 AM to 4:00 PM</p>
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
