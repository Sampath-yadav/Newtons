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
    imageAlt: "Newton's High School students achieving academic excellence",
    title: "Academic achievement",
    body: "Strong academic outcomes open pathways to leading universities and future opportunities worldwide.",
    href: "/learning-journey/academic-achievement",
  },
  {
    id: "life-competencies",
    imageSrc: "/images/growing-minds/Life competencies.png",
    imageAlt: "Newton's High School students building life competencies",
    title: "Life competencies",
    body: "Build the human skills needed to adapt, collaborate and keep learning throughout life.",
    href: "/learning-journey/life-competencies",
  },
  {
    id: "multilingualism",
    imageSrc: "/images/growing-minds/Multilingualism.png",
    imageAlt: "Newton's High School students in a multilingual learning environment",
    title: "Multilingualism",
    body: "Develop fluency across languages, cultures and global environments.",
    href: "/learning-journey/multilingualism",
  },
];
