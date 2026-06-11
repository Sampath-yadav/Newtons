import { Container } from "~/components/layout/Container";

const ACCREDITATIONS = [
  {
    id: "sed-telangana",
    shortName: "Govt. of Telangana",
    icon: "🏛️",
    name: "Recognition from the School Education Department, Government of Telangana",
    description:
      "Newton's High School is recognized by the School Education Department, Government of Telangana, and operates in accordance with the academic standards, policies, and regulations prescribed for recognized educational institutions in the state.",
    accent: "#16a34a",
    bg: "#f0fdf4",
    border: "#bbf7d0",
  },
  {
    id: "rte",
    shortName: "RTE Compliant",
    icon: "📋",
    name: "Right to Education (RTE) Compliance",
    description:
      "The school is committed to the principles of the Right to Education (RTE) Act, promoting accessible, equitable, and quality education while maintaining a safe, inclusive, and student-focused learning environment.",
    accent: "#2563eb",
    bg: "#eff6ff",
    border: "#bfdbfe",
  },
];

export function AccreditationsBanner() {
  return (
    <section className="bg-white py-14 lg:py-20">
      <Container>
        {/* Heading */}
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-orange">
            Official Recognition
          </p>
          <h2 className="text-2xl font-extrabold text-brand-ink lg:text-3xl">
            Accreditations &amp; Recognition
          </h2>
        </div>

        {/* Two-column grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {ACCREDITATIONS.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border p-8 flex flex-col gap-4"
              style={{ background: item.bg, borderColor: item.border }}
            >
              {/* Icon + short badge */}
              <div className="flex items-center gap-3">
                <span className="text-3xl" role="img" aria-hidden>
                  {item.icon}
                </span>
                <span
                  className="rounded-full px-3 py-1 text-xs font-bold tracking-wide"
                  style={{ background: item.accent, color: "#fff" }}
                >
                  {item.shortName}
                </span>
              </div>

              {/* Accent bar */}
              <div
                className="h-1 w-12 rounded-full"
                style={{ background: item.accent }}
              />

              {/* Title */}
              <h3
                className="text-base font-extrabold leading-snug"
                style={{ color: item.accent }}
              >
                {item.name}
              </h3>

              {/* Description */}
              <p className="text-sm leading-relaxed text-brand-muted">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
