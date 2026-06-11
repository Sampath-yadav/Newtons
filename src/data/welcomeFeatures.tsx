// src/data/welcomeFeatures.tsx
import type { ComponentType, ReactNode, SVGProps } from "react";
import {
  GlobeBookIcon,
  GraduationCapIcon,
  MentorIcon,
  PeopleIcon,
  TrophyIcon,
} from "~/components/icons";

export interface FeatureTheme {
  /** Pastel header background color */
  headerBg: string;
  /** Accent color for the divider line and "Learn more" link */
  accent: string;
  /** Icon circle background */
  iconBg: string;
  /** Icon stroke/fill color */
  iconColor: string;
}

export interface WelcomeFeature {
  id: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  body: ReactNode;
  /** Visual theme for the card header and accents */
  theme: FeatureTheme;
  /** Background photo for the card header */
  imageSrc: string;
  /** "Learn more" destination */
  href: string;
}

/**
 * Five USP cards shown directly under the hero. Each card carries its own
 * color theme — the first three share a warm cream palette while the last
 * two use cool blue and green for visual variety.
 */
export const WELCOME_FEATURES: WelcomeFeature[] = [
  {
    id: "ssc-curriculum",
    icon: PeopleIcon,
    title: "Quality SSC Education",
    body: (
      <>
        We follow the Telangana SSC curriculum with a focus on concept clarity,
        discipline and regular assessments to build a strong academic foundation
        for every student.
      </>
    ),
    theme: {
      headerBg: "#FFF8ED",
      accent: "#F39200",
      iconBg: "#FFF3DD",
      iconColor: "#E8850A",
    },
    imageSrc: "/images/Features/Quality SSC Education.png",
    href: "/academics/ssc",
  },
  {
    id: "academic-excellence",
    icon: GraduationCapIcon,
    title: "Academic Excellence",
    body: (
      <>
        Our dedicated teachers inspire students to achieve their highest
        potential through personalized attention, continuous practice and a
        results-driven approach.
      </>
    ),
    theme: {
      headerBg: "#FFF8ED",
      accent: "#F39200",
      iconBg: "#FFF3DD",
      iconColor: "#E8850A",
    },
    imageSrc: "/images/Features/Academic Excellence.png",
    href: "/academics/excellence",
  },
  {
    id: "holistic-development",
    icon: GlobeBookIcon,
    title: "Holistic Student Development",
    body: (
      <>
        We go beyond academics to nurture confident, responsible and
        well-rounded individuals through sports, cultural activities, life skills
        and leadership opportunities.
      </>
    ),
    theme: {
      headerBg: "#FFF8ED",
      accent: "#F39200",
      iconBg: "#FFF3DD",
      iconColor: "#E8850A",
    },
    imageSrc: "/images/Features/Holistic Student Development.png",
    href: "/student-life",
  },
  {
    id: "faculty-mentorship",
    icon: MentorIcon,
    title: "Experienced Faculty & Mentorship",
    body: (
      <>
        Our dedicated teachers provide personalized guidance, continuous support,
        and effective learning strategies that help students build confidence,
        improve performance, and achieve their academic goals.
      </>
    ),
    theme: {
      headerBg: "#EEF4FF",
      accent: "#3B5BDB",
      iconBg: "#E0EAFF",
      iconColor: "#3B5BDB",
    },
    imageSrc: "/images/Features/Experienced Faculty & Mentorship.png",
    href: "/about/faculty",
  },
  {
    id: "sports-cocurricular",
    icon: TrophyIcon,
    title: "Sports & Co-Curricular Activities",
    body: (
      <>
        Students are encouraged to participate in sports, arts, cultural events,
        and leadership programs that promote teamwork, creativity, discipline,
        and overall personality development.
      </>
    ),
    theme: {
      headerBg: "#EEFBF4",
      accent: "#2B8A3E",
      iconBg: "#D8F5E3",
      iconColor: "#2B8A3E",
    },
    imageSrc: "/images/Features/Sports & Co-Curricular Activities.png",
    href: "/student-life/sports",
  },
];
