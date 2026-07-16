// src/data/growingMilestones.ts

export interface GrowingMilestone {
  id: string;
  imageSrc: string;
  imageAlt: string;
  title: string;
  body: string;
  href: string;
}

/**
 * The three milestone cards shown in the "Growing curious, confident minds"
 * section. They sit in the right column on a horizontal timeline connector.
 */
export const GROWING_MILESTONES: GrowingMilestone[] = [
  {
    id: "academic-achievement",
    imageSrc: "/images/growing-minds/Academic achievement.png",
    imageAlt: "Newton's High School students achieving strong SSC academic results",
    title: "Academic Achievement",
    body: "Our structured SSC curriculum, consistent assessments, and experienced faculty combine to deliver strong academic outcomes — giving students the knowledge, exam skills, and confidence to succeed in higher education and in life.",
    href: "/learning-journey/secondary-ssc",
  },
  {
    id: "life-competencies",
    imageSrc: "/images/growing-minds/Life competencies.png",
    imageAlt: "Newton's High School students building real-world life skills",
    title: "Life Skills & Competencies",
    body: "Academic knowledge becomes truly valuable when combined with practical life skills. Students develop critical thinking, time management, teamwork, communication, and responsible decision-making that serve them long after their school years end.",
    href: "/school-life",
  },
  {
    id: "values-culture",
    imageSrc: "/images/growing-minds/Multilingualism.png",
    imageAlt: "Students at Newton's High School celebrating cultural events and traditions",
    title: "Values, Culture & Community",
    body: "We are deeply rooted in Telangana's cultural heritage. Through celebrations like Vana Mahotsavam, Teachers' Day, Diwali, and Independence Day, students develop pride in their identity, respect for others, and a genuine sense of belonging.",
    href: "/school-life",
  },
];
