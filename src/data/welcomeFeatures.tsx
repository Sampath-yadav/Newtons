// src/data/welcomeFeatures.tsx
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  LibraryBig,
  Award,
  Sparkles,
  UserRoundCheck,
  Medal,
} from "lucide-react";

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
  icon: LucideIcon;
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
    icon: LibraryBig,
    title: "Strong SSC Academic Foundation",
    body: (
      <>
        Our teaching follows the Telangana SSC curriculum with a focus on concept
        clarity rather than rote memorisation. Regular assessments, revision
        cycles, and structured practice help students build the strong academic
        base they need to succeed in board examinations and beyond.
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
    icon: Award,
    title: "Results-Focused Academic Guidance",
    body: (
      <>
        From Grade 1 through Grade 10, our teachers use proven, personalised
        teaching strategies tailored to each student&apos;s pace and learning
        style. We track progress consistently and step in early whenever a
        student needs additional support — because no child should be left behind.
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
    icon: Sparkles,
    title: "Whole-Child Development",
    body: (
      <>
        Education at Newton&apos;s is never limited to textbooks and exams.
        Students participate in sports, arts, cultural programmes, environmental
        drives, and life skills workshops that shape them into responsible,
        confident, and well-rounded individuals ready for life beyond school.
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
    icon: UserRoundCheck,
    title: "Experienced & Caring Faculty",
    body: (
      <>
        Our teachers bring subject expertise, classroom experience, and genuine
        commitment to every lesson. Each student receives personal mentorship,
        academic counselling, and continuous encouragement — creating a positive
        environment where students feel motivated to learn and grow every day.
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
    icon: Medal,
    title: "Sports, Arts & Leadership Activities",
    body: (
      <>
        We believe that what happens outside the classroom shapes a child just as
        powerfully as what happens inside it. Students at Newton&apos;s actively
        participate in inter-school competitions, annual cultural events, sports
        days, and leadership programmes that build teamwork, creativity, and
        self-confidence.
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
