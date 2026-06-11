import { Container } from "~/components/layout/Container";
import type { LJStat } from "~/data/learning-journey";

interface Props {
  heading: string;
  body: string;
  stats: LJStat[];
}

export function StatsSection({ heading, body, stats }: Props) {
  return (
    <section className="py-16 lg:py-24" style={{ background: "#ECEAFB" }}>
      <Container>
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-brand-ink mb-4">
            {heading}
          </h2>
          <p className="text-[15px] text-brand-muted leading-relaxed">{body}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white p-8 text-center shadow-card hover:shadow-card-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-4xl lg:text-5xl font-extrabold text-brand-orange mb-3 leading-none">
                {stat.value}
              </div>
              <p className="text-sm text-brand-muted leading-relaxed">{stat.label}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
