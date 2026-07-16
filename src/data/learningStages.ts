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
    ageRange: "Ages 3–5",
    body: "We welcome the youngest learners into a warm, cheerful classroom environment where curiosity is celebrated. Children discover language, numbers, colours, and creativity through play-based activities, storytelling, rhymes, and hands-on exploration — building confidence, friendships, and a genuine love of learning from the very beginning.",
    href: "/learning-journey/pre-primary",
  },
  {
    id: "primary-school",
    imageSrc: "/images/sections/learning-journey/_stage-cards/primary.png",
    imageAlt: "Primary students in class at Newton's High School",
    title: "Primary School",
    ageRange: "Grades 1–5",
    body: "Students build strong academic fundamentals in Telugu, Hindi, English, Mathematics, and Environmental Science. Active classroom discussions, group activities, and regular reading practice ensure children develop both knowledge and communication skills — nurturing independent thinking alongside a team-first attitude.",
    href: "/learning-journey/primary-school",
  },
  {
    id: "upper-primary-school",
    imageSrc: "/images/sections/learning-journey/_stage-cards/upper-primary.png",
    imageAlt: "Upper Primary students at Newton's High School",
    title: "Upper Primary School",
    ageRange: "Grades 6–8",
    body: "This is where students begin to develop a deeper sense of responsibility, analytical thinking, and academic confidence. Subject knowledge becomes more structured as students prepare for higher studies, while leadership opportunities, project-based learning, and school events help them build a strong personal identity alongside academic achievement.",
    href: "/learning-journey/upper-primary-school",
  },
  {
    id: "secondary-school",
    imageSrc: "/images/sections/learning-journey/_stage-cards/secondary.png",
    imageAlt: "Secondary students at Newton's High School",
    title: "Secondary School — SSC",
    ageRange: "Grades 9–10",
    body: "Our Secondary School programme is specifically designed to deliver outstanding SSC Board Examination results for every student. With experienced subject teachers, targeted practice papers, timed assessments, and individual progress tracking, students are fully prepared — academically and mentally — to face their board exams with confidence and clarity.",
    href: "/learning-journey/secondary-school",
  },
  {
    id: "holistic-development",
    imageSrc: "/images/sections/learning-journey/_stage-cards/senior.png",
    imageAlt: "Students participating in sports and cultural activities at Newton's High School",
    title: "Holistic Student Development",
    ageRange: "Beyond Academics",
    body: "Newton's believes that education is only complete when students grow as full human beings. Throughout all stages, students take part in sports, arts, cultural celebrations, environmental awareness campaigns, and community activities that build character, empathy, and a lifelong sense of responsibility.",
    href: "/learning-journey/holistic-development",
  },
];
