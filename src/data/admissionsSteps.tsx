// src/data/admissionsSteps.tsx
import type { ComponentType, ReactNode, SVGProps } from "react";
import {
  ClipboardIcon,
  DocumentCheckIcon,
  HandshakeIcon,
  PaymentIcon,
  SchoolBuildingIcon,
} from "~/components/icons";

export interface AdmissionStep {
  id: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  body: ReactNode;
  /** Numeral shown below the card, e.g. "01". */
  numeral: string;
}

export type AdmissionsAudience = "indian" | "international";

export const ADMISSIONS_STEPS: Record<AdmissionsAudience, AdmissionStep[]> = {
  indian: [
    {
      id: "enquiry",
      icon: ClipboardIcon,
      numeral: "01",
      title: "Initial enquiry",
      body: (
        <>
          Reach out to our Admissions Team or fill in the{" "}
          <a
            href="/admissions/enquiry"
            className="font-medium text-brand-orange underline underline-offset-2 hover:text-[#D67E00]"
          >
            enquiry form
          </a>{" "}
          to express interest. Our team will be happy to answer your questions
          and arrange a school tour or information session.
        </>
      ),
    },
    {
      id: "tour",
      icon: SchoolBuildingIcon,
      numeral: "02",
      title: "Schedule a school tour",
      body: (
        <>
          <a
            href="/book-a-tour"
            className="font-medium text-brand-orange underline underline-offset-2 hover:text-[#D67E00]"
          >
            Book a tour
          </a>{" "}
          to explore our international school in Hyderabad, meet our caring
          staff and experience our dynamic learning environment. Virtual open
          days are also available.
        </>
      ),
    },
    {
      id: "submission",
      icon: DocumentCheckIcon,
      numeral: "03",
      title: "Application submission",
      body: (
        <>
          Once you&apos;re ready to apply, the admissions form can be completed
          online or in person. Along with the form, we ask families to provide
          supporting documents such as the child&apos;s birth certificate and
          previous school reports.
        </>
      ),
    },
    {
      id: "assessment",
      icon: HandshakeIcon,
      numeral: "04",
      title: "Assessment and interaction",
      body: (
        <>
          To help us understand each child&apos;s needs and readiness, applicants
          may be invited to take part in an age-appropriate assessment or a
          short interaction session, depending on the year group.
        </>
      ),
    },
    {
      id: "offer",
      icon: PaymentIcon,
      numeral: "05",
      title: "Offer & enrolment",
      body: (
        <>
          Following a successful assessment, you&apos;ll receive an offer letter
          and details of next steps. Completing enrolment confirms your
          child&apos;s place at Newton&apos;s High School.
        </>
      ),
    },
  ],
  international: [
    {
      id: "enquiry",
      icon: ClipboardIcon,
      numeral: "01",
      title: "Initial enquiry",
      body: (
        <>
          Get in touch with our International Admissions Team, who will guide
          you through entry requirements, term dates and any visa or
          relocation considerations specific to your situation.
        </>
      ),
    },
    {
      id: "tour",
      icon: SchoolBuildingIcon,
      numeral: "02",
      title: "Virtual or campus tour",
      body: (
        <>
          Choose a guided virtual tour from anywhere in the world, or visit
          the campus in person to meet our team and experience our learning
          environment first-hand.
        </>
      ),
    },
    {
      id: "submission",
      icon: DocumentCheckIcon,
      numeral: "03",
      title: "Application submission",
      body: (
        <>
          Submit your application online together with academic transcripts,
          passport copies and any prior school reports. Our team will keep you
          updated at every stage.
        </>
      ),
    },
    {
      id: "assessment",
      icon: HandshakeIcon,
      numeral: "04",
      title: "Assessment and interview",
      body: (
        <>
          Children take part in an age-appropriate assessment, and families
          attend a friendly interview — online or in person — so we get to
          know each applicant well.
        </>
      ),
    },
    {
      id: "offer",
      icon: PaymentIcon,
      numeral: "05",
      title: "Offer & enrolment",
      body: (
        <>
          Successful candidates receive an offer letter with onboarding
          information, including support for relocation and language
          orientation if required.
        </>
      ),
    },
  ],
};
