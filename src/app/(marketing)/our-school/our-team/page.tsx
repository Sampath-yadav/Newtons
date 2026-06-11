import Link from "next/link";
import { Button } from "~/components/ui/Button";
import { Container } from "~/components/layout/Container";
import { ImageFrame } from "~/components/ui/ImageFrame";
import { AccreditationsBanner } from "~/components/admissions/AccreditationsBanner";

/* ── Data ─────────────────────────────────────────────────────────────────── */

const PHOTO = "/images/people/team"; // drop <slug>.jpg here; initials show until then

interface Member {
  name: string;
  role: string;
  slug: string;
}

const LEADERSHIP: Member[] = [
  { name: "Suresh Reddy", role: "Principal", slug: "suresh-reddy" },
  { name: "Padmaja Rao", role: "Vice Principal & Head of Academics", slug: "padmaja-rao" },
  { name: "Venkat Sharma", role: "Academic Coordinator — SSC", slug: "venkat-sharma" },
  { name: "Lakshmi Naidu", role: "Administrative Officer", slug: "lakshmi-naidu" },
];

const FACULTY: Member[] = [
  { name: "Anitha Kumari", role: "Telugu — Subject Leader", slug: "anitha-kumari" },
  { name: "Rajesh Verma", role: "Hindi — Subject Leader", slug: "rajesh-verma" },
  { name: "Priya Menon", role: "English — Subject Leader", slug: "priya-menon" },
  { name: "Srinivas Rao", role: "Mathematics — Subject Leader", slug: "srinivas-rao" },
  { name: "Kavitha Reddy", role: "Physical Science — Subject Leader", slug: "kavitha-reddy" },
  { name: "Mohan Das", role: "Biological Science — Subject Leader", slug: "mohan-das" },
  { name: "Sunitha Sharma", role: "Social Studies — Subject Leader", slug: "sunitha-sharma" },
  { name: "Ramesh Babu", role: "Physical Education & Sports", slug: "ramesh-babu" },
];

const SUPPORT: Member[] = [
  { name: "Deepa Iyer", role: "Student Counsellor & Wellbeing Lead", slug: "deepa-iyer" },
  { name: "Krishna Murthy", role: "Transport In-charge", slug: "krishna-murthy" },
  { name: "Sridevi Patel", role: "Health & Safety Coordinator", slug: "sridevi-patel" },
  { name: "Ganesh Kumar", role: "IT & Digital Learning", slug: "ganesh-kumar" },
];

const WELLBEING = SUPPORT[0]; // featured in the Student Wellbeing section

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
}

/* ── Building blocks ──────────────────────────────────────────────────────── */

// One fixed circle size for EVERY member — uniform across the whole page.
function TeamAvatar({ member, size = "h-28 w-28" }: { member: Member; size?: string }) {
  return (
    <div className="relative">
      {/* decorative accent (consistent for everyone) */}
      <span className="absolute -bottom-1 -left-2 h-10 w-10 rounded-full bg-[#ECEAFB]" aria-hidden />
      <div className={`relative ${size} overflow-hidden rounded-full ring-4 ring-white shadow-card`}>
        {/* initials fallback */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-navy to-[#2b34a0] text-2xl font-extrabold text-white">
          {initials(member.name)}
        </div>
        {/* real photo — appears the moment the file exists, no broken icon if missing */}
        <div
          role="img"
          aria-label={member.name}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${PHOTO}/${member.slug}.jpg')` }}
        />
      </div>
    </div>
  );
}

function TeamCard({ member }: { member: Member }) {
  return (
    <div className="group flex h-full flex-col items-center rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-lg">
      <TeamAvatar member={member} />
      <h3 className="mt-5 text-[15px] font-bold text-brand-ink">{member.name}</h3>
      <p className="mt-1 min-h-[34px] text-[12.5px] font-medium leading-snug text-brand-orange">
        {member.role}
      </p>
      <span className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-brand-navy/70 transition-colors group-hover:text-brand-orange">
        Read more
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 transition-transform group-hover:translate-x-0.5" aria-hidden>
          <polyline points="9 6 15 12 9 18" />
        </svg>
      </span>
    </div>
  );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-8 flex items-center gap-4">
      <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-orange">{children}</span>
      <span className="h-px flex-1 bg-slate-200" />
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────────── */

export default function OurTeamPage() {
  return (
    <>
      {/* ── Hero banner ── */}
      <section className="relative isolate">
        <ImageFrame
          src="/images/sections/our-school/team-hero.jpg"
          tone="navy"
          rounded="rounded-none"
          overlay
          className="h-[260px] lg:h-[360px]"
        />
        <div className="absolute inset-0 flex items-center">
          <Container>
            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-orange">
              <span className="h-px w-5 bg-brand-orange/60" />
              Our School
            </span>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight text-white lg:text-[3.2rem]">
              Meet Our Team
            </h1>
            <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-white/80">
              The passionate educators and staff shaping confident, capable learners at
              Newton&apos;s High School.
            </p>
          </Container>
        </div>
      </section>

      {/* ── Section sub-nav ── */}
      <nav className="sticky top-20 z-30 border-b border-white/10 bg-brand-navy lg:top-[100px]">
        <Container>
          <ul className="flex gap-7 overflow-x-auto text-[13px] font-semibold">
            <li>
              <Link href="/our-school/why-choose-us" className="inline-block whitespace-nowrap py-4 text-white/65 transition-colors hover:text-white">
                Why Choose Us
              </Link>
            </li>
            <li>
              <span className="inline-block whitespace-nowrap border-b-2 border-brand-orange py-4 text-white">
                Our Team
              </span>
            </li>
          </ul>
        </Container>
      </nav>

      {/* ── Breadcrumb + intro ── */}
      <section className="bg-white pb-4 pt-8">
        <Container>
          <ol className="mb-10 flex items-center gap-1.5 text-sm text-brand-muted">
            <li><Link href="/" className="transition hover:text-brand-navy">Home</Link></li>
            <li className="text-slate-300">›</li>
            <li><Link href="/our-school" className="transition hover:text-brand-navy">Our School</Link></li>
            <li className="text-slate-300">›</li>
            <li className="font-semibold text-brand-navy">Our Team</li>
          </ol>

          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold text-brand-ink lg:text-[2.6rem]">
              Meet Our Leadership Team
            </h2>
            <p className="mt-5 text-[16px] leading-relaxed text-brand-muted">
              Our educators are experienced, caring professionals who create a supportive,
              student-centred environment — recognising and nurturing every child&apos;s unique
              strengths. Beyond teaching, they mentor students to build confidence, discipline
              and the values to lead with impact, in school and in life.
            </p>
          </div>
        </Container>
      </section>

      {/* ── Leadership ── */}
      <section className="bg-white py-12 lg:py-16">
        <Container>
          <GroupLabel>School Leadership</GroupLabel>
          <div className="grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-4">
            {LEADERSHIP.map((m) => <TeamCard key={m.slug} member={m} />)}
          </div>
        </Container>
      </section>

      {/* ── Academic Faculty ── */}
      <section className="py-12 lg:py-16" style={{ background: "#f7f8fd" }}>
        <Container>
          <GroupLabel>Academic Faculty &amp; Subject Leaders</GroupLabel>
          <div className="grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-4">
            {FACULTY.map((m) => <TeamCard key={m.slug} member={m} />)}
          </div>
        </Container>
      </section>

      {/* ── Student Support & Operations ── */}
      <section className="bg-white py-12 lg:py-16">
        <Container>
          <GroupLabel>Student Support &amp; Operations</GroupLabel>
          <div className="grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-4">
            {SUPPORT.map((m) => <TeamCard key={m.slug} member={m} />)}
          </div>
        </Container>
      </section>

      {/* ── Student Wellbeing & Safety (PDF "Safeguarding") ── */}
      <section className="py-16 lg:py-24" style={{ background: "#ECEAFB" }}>
        <Container>
          <div className="mx-auto max-w-4xl">
            <div className="overflow-hidden rounded-3xl bg-white shadow-card-lg">
              <div className="grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr]">
                {/* Left: featured person */}
                <div className="flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-brand-navy to-[#1b2378] px-8 py-12 text-center">
                  <TeamAvatar member={WELLBEING} size="h-32 w-32" />
                  <div>
                    <h3 className="text-[18px] font-extrabold text-white">{WELLBEING.name}</h3>
                    <p className="mt-1 text-[13px] text-brand-orange">{WELLBEING.role}</p>
                  </div>
                </div>
                {/* Right: copy */}
                <div className="px-8 py-12 lg:px-12">
                  <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-orange">
                    <span className="h-px w-5 bg-brand-orange/50" />
                    Student Wellbeing &amp; Safety
                  </span>
                  <h2 className="mt-4 text-2xl font-extrabold leading-tight text-brand-ink lg:text-3xl">
                    Every Child, Safe and Supported
                  </h2>
                  <p className="mt-4 text-[15px] leading-relaxed text-brand-muted">
                    A dedicated counsellor and a trained support team look after the emotional
                    wellbeing, safety and pastoral care of every student — so each child feels
                    secure, heard and ready to learn.
                  </p>
                  <div className="mt-7">
                    <Button href="/our-school/why-choose-us" variant="outline-navy" size="lg" arrow>
                      Our safety commitment
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Join / Enquire CTA ── */}
      <section className="relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr]">
          <div className="relative z-10 flex flex-col justify-center bg-brand-navy px-8 py-14 lg:px-14 lg:py-20">
            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-orange">
              <span className="h-px w-5 bg-brand-orange/50" />
              Join Our Community
            </span>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-white lg:text-4xl">
              Meet Our Team in Person
            </h2>
            <p className="mb-8 mt-4 max-w-sm text-[15px] leading-relaxed text-white/70">
              The best way to know our educators is to visit. Book a campus tour or enquire about
              admissions and see the Newton&apos;s difference for yourself.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button href="/admissions/enquire-now" size="lg">Enquire Now</Button>
              <Button href="/careers" size="lg" variant="outline-light">Careers at Newton&apos;s</Button>
            </div>
          </div>
          <ImageFrame
            src="/images/sections/our-school/team-cta.jpg"
            label="Team Image"
            tone="orange"
            rounded="rounded-none"
            className="h-[300px] min-h-[300px] lg:h-auto"
          />
        </div>
      </section>

      {/* ── Accreditations ── */}
      <AccreditationsBanner />
    </>
  );
}
