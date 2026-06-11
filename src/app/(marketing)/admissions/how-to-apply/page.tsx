import Image from "next/image";
import Link from "next/link";
import { Container } from "~/components/layout/Container";
import { AdmissionsSubNav } from "~/components/admissions/AdmissionsSubNav";
import { Button } from "~/components/ui/Button";

export default function HowToApplyPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[280px] lg:h-[340px] overflow-hidden">
        <Image
          src="/images/cta-banner/students.jpg"
          alt="Newton's High School admissions"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-brand-navy/40" />
      </section>

      {/* Admissions sub-nav */}
      <AdmissionsSubNav />

      {/* Breadcrumb */}
      <nav className="border-b border-slate-100 bg-white py-3">
        <Container>
          <ol className="flex items-center gap-1.5 text-sm text-brand-muted">
            <li><Link href="/" className="transition hover:text-brand-navy">Home</Link></li>
            <li className="text-slate-300">/</li>
            <li><Link href="/admissions" className="transition hover:text-brand-navy">Admissions</Link></li>
            <li className="text-slate-300">/</li>
            <li className="font-medium text-brand-navy">How to Apply</li>
          </ol>
        </Container>
      </nav>

      {/* Content */}
      <section className="bg-white py-16 lg:py-24">
        <Container>
          <div className="max-w-xl mx-auto text-center">
            <h1 className="text-4xl font-extrabold text-brand-ink mb-5">How to Apply</h1>
            <p className="text-brand-muted text-[15px] leading-relaxed mb-8">
              Our admissions process is simple and welcoming. Complete our online enquiry form and our admissions team will guide you through each step of the journey.
            </p>
            <Button href="/admissions/enquire-now" size="lg">
              Enquire now
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
