// src/data/learningStages.ts

export interface LearningStage {
  id: string;
  imageSrc: string;
  imageAlt: string;
  title: string;
  ageRange: string;
  body: string;
  href: string;
}

/**
 * The five educational stages shown in the Learning journey carousel.
 * Add a sixth here and the carousel dots/arrows update automatically.
 */
export const LEARNING_STAGES: LearningStage[] = [
  {
    id: "pre-primary",
    imageSrc: "/images/sections/learning-journey/_stage-cards/pre-primary.png",
    imageAlt: "Pre-Primary students at Newton's High School",
    title: "Pre-Primary",
    ageRange: "Ages 3–5 Years",
    body: "Young learners begin their educational journey in a caring and joyful environment. Through play-based learning, storytelling, creative activities, and language development, children build confidence, curiosity, and essential foundational skills.",
    href: "/learning-journey/pre-primary",
  },
  {
    id: "primary-school",
    imageSrc: "/images/sections/learning-journey/_stage-cards/primary.png",
    imageAlt: "Primary students in class at Newton's High School",
    title: "Primary School",
    ageRange: "Grades 1–5",
    body: "Students develop strong academic fundamentals while exploring creativity, communication, and teamwork. Our engaging classrooms encourage active learning and independent thinking.",
    href: "/learning-journey/primary-school",
  },
  {
    id: "upper-primary-school",
    imageSrc: "/images/sections/learning-journey/_stage-cards/upper-primary.png",
    imageAlt: "Upper Primary students at Newton's High School",
    title: "Upper Primary School",
    ageRange: "Grades 6–8",
    body: "Students strengthen subject knowledge while developing leadership, responsibility, and problem-solving skills. They actively participate in projects, competitions, and cultural activities that build confidence and teamwork.",
    href: "/learning-journey/upper-primary-school",
  },
  {
    id: "secondary-school",
    imageSrc: "/images/sections/learning-journey/_stage-cards/secondary.png",
    imageAlt: "Secondary students at Newton's High School",
    title: "Secondary School",
    ageRange: "Grades 9–10",
    body: "Students receive focused academic guidance aligned with the Telangana SSC curriculum. Experienced teachers provide structured preparation, helping students achieve outstanding board examination results and future success.",
    href: "/learning-journey/secondary-school",
  },
  {
    id: "holistic-development",
    imageSrc: "/images/sections/learning-journey/_stage-cards/senior.png",
    imageAlt: "Students participating in sports and cultural activities at Newton's High School",
    title: "Holistic Student Development",
    ageRange: "Beyond Academics",
    body: "Education at Newton's High School extends beyond textbooks. Students participate in sports, cultural events, arts, leadership activities, and community engagement programs that shape confident, responsible, and well-rounded individuals.",
    href: "/learning-journey/holistic-development",
  },
];
