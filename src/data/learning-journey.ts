// src/data/learning-journey.ts
// Centralised data layer for all Learning Journey stage pages.
// Swap image paths or text here without touching the page components.

// ── Shared types ────────────────────────────────────────────────────────────

export type IconKey =
  | "book"
  | "globe"
  | "star"
  | "flask"
  | "users"
  | "computer"
  | "trophy"
  | "palette"
  | "mic"
  | "leaf"
  | "shield"
  | "lightbulb";

export interface LJFeature {
  iconKey: IconKey;
  title: string;
  body: string;
}

export interface LJStat {
  value: string;
  label: string;
}

export interface LJCurriculumTab {
  id: string;
  label: string;
  heading: string;
  body: string;
  points: string[];
  image: string;
}

export interface LJDayItem {
  time: string;
  title: string;
  body: string;
  color: string;
  accent: string;
}

export interface LJPillarImage {
  label: string;
  image: string;
}

export interface LJActivityCard {
  title: string;
  href: string;
  image: string;
}

export interface LJRelatedCard {
  label: string;
  ages: string;
  href: string;
  image: string;
}

export interface LJFrameworkStep {
  step: string;
  title: string;
  body: string;
}

// ── Primary School data ─────────────────────────────────────────────────────

export const PRIMARY_SCHOOL = {
  agesLabel: "Ages 6 – 11",
  heroImage: "/images/sections/learning-journey/primary/hero.png",
  heroDescription:
    "Students aged 6 to 11 at Newton's are at a thriving stage of growth — where curiosity meets capability. Through the Telangana SSC Primary curriculum, they explore, question and connect ideas to the world around them. This enquiry-based approach nurtures independence, turning everyday lessons into a lifelong love of discovery.",

  introHeading: "Primary School in Hyderabad",
  introBody:
    "Our Class 1 to 5 students are at a thriving stage of growth — where curiosity meets capability. Through the Telangana SSC Primary curriculum, they explore, question and connect ideas to the world around them. This enquiry-based approach nurtures independence, turning everyday lessons into a lifelong love of discovery.",

  features: [
    {
      iconKey: "book" as IconKey,
      title: "SSC-Aligned Curriculum",
      body: "Our Class 1 to 5 programme follows the Telangana SSC framework, enriched with activity-based learning, projects and real-world connections to inspire every young learner.",
    },
    {
      iconKey: "globe" as IconKey,
      title: "Multilingual Learning",
      body: "Students build fluency in Telugu, English and Hindi through immersive storytelling, reading circles and meaningful conversations across all subjects.",
    },
    {
      iconKey: "star" as IconKey,
      title: "Skills for Life",
      body: "Students develop critical thinking, creativity and problem-solving through hands-on experiments, collaborative projects and enquiry-led classroom experiences.",
    },
  ] as LJFeature[],

  statsHeading: "Celebrate our student success",
  statsBody:
    "At our primary school in Hyderabad, students consistently demonstrate strong academic progress and holistic development. Our results reflect our enquiry-based learning approach and commitment to nurturing every child's unique potential.",
  stats: [
    {
      value: "95%",
      label: "of students score A or A+ grade in annual SSC board examinations",
    },
    {
      value: "98%",
      label: "school day attendance rate maintained across all primary classes",
    },
    {
      value: "8 in 10",
      label: "students participate actively in at least one co-curricular programme",
    },
  ] as LJStat[],

  curriculumHeading: "Our curriculum",
  curriculumBody:
    "Our primary curriculum blends the Telangana SSC framework with activity-based learning, fostering enquiry, critical thinking, creativity and real-world connections to build independence.",
  curriculumTabs: [
    {
      id: "english",
      label: "English",
      heading: "Building strong foundation in language and expression",
      body: "Students build confidence in English by developing reading, writing, speaking and listening skills through an engaging, enquiry-led curriculum. With rich experiences such as storytelling, role-play, drama, poetry and class novels, students strengthen vocabulary, expression and comprehension — learning to think critically and communicate with purpose.",
      points: [
        "Structured phonics and reading programme from Class 1",
        "Weekly creative writing and journaling sessions",
        "Public speaking, drama and debate activities",
        "Literature exploration with Indian and global texts",
      ],
      image: "/images/sections/learning-journey/primary/multilingualism.png",
    },
    {
      id: "mathematics",
      label: "Mathematics",
      heading: "Developing mathematical thinking through enquiry and problem-solving",
      body: "Our primary Maths programme goes beyond computation. Students explore mathematical concepts through hands-on activities, visual models and real-world problems. They build number sense, logical reasoning and confidence as problem-solvers, ensuring every student understands the 'why' behind every concept.",
      points: [
        "Conceptual understanding through manipulatives and models",
        "Mental maths and arithmetic fluency development",
        "Word problems and real-world application challenges",
        "Data handling, geometry and measurement projects",
      ],
      image: "/images/sections/learning-journey/primary/academic-achievement.png",
    },
    {
      id: "science",
      label: "Science",
      heading: "Inspiring curiosity through experimentation and discovery",
      body: "Science at Newton's Primary nurtures natural curiosity. Students learn through hands-on experiments, observations and investigations that bring classroom concepts to life. Our science programme develops a scientific mindset, encouraging students to question, hypothesise and draw conclusions from evidence.",
      points: [
        "Weekly lab experiments and STEM activities",
        "Environmental science and nature observation projects",
        "Plant, animal and human biology explorations",
        "Simple physics and chemistry investigations",
      ],
      image: "/images/sections/learning-journey/primary/academic-excellence.png",
    },
    {
      id: "telugu",
      label: "Telugu",
      heading: "Celebrating our language and cultural heritage through Telugu",
      body: "Telugu is taught with pride and purpose at Newton's. Students develop strong literacy skills in their mother tongue through literature, poetry, grammar and creative writing — connecting them to their rich cultural roots.",
      points: [
        "Reading, writing and grammar development in Telugu",
        "Telugu poetry, folk tales and literature study",
        "Cultural festivals and heritage exploration",
        "Formal and informal communication skills in Telugu",
      ],
      image: "/images/sections/learning-journey/primary/multilingualism.png",
    },
    {
      id: "hindi",
      label: "Hindi",
      heading: "Building national language confidence through Hindi",
      body: "Hindi instruction at Newton's builds foundational literacy and communication skills. Through songs, stories and interactive activities, students develop reading, writing and conversational Hindi skills that open doors across the country.",
      points: [
        "Conversational Hindi for everyday communication",
        "Hindi reading and comprehension exercises",
        "Hindi stories, songs, poems and folk tales",
        "Script writing and spelling development",
      ],
      image: "/images/sections/learning-journey/primary/holistic-development.png",
    },
    {
      id: "computer",
      label: "Computer Fundamentals",
      heading: "Building digital literacy and computational thinking skills",
      body: "In today's world, digital literacy is essential. Our Computer Fundamentals programme introduces students to basic computing concepts, digital tools and online safety. Students learn through project-based activities that make technology relevant, engaging and fun.",
      points: [
        "Introduction to computers, hardware and software",
        "Basic programming concepts and logical thinking",
        "Digital literacy and responsible internet use",
        "Creative projects using age-appropriate software tools",
      ],
      image: "/images/sections/learning-journey/primary/quality-ssc-education.png",
    },
    {
      id: "pe",
      label: "Physical Education",
      heading: "Developing strong, healthy and confident movers",
      body: "Physical Education at Newton's goes beyond sport — it builds character, teamwork and resilience. Students develop motor skills, physical fitness and sportsmanship through structured PE sessions that include outdoor games, yoga, athletics and cooperative activities.",
      points: [
        "Track and field, team games and relay sports",
        "Yoga, stretching and fitness conditioning",
        "Swimming readiness and aquatics activities",
        "Leadership and teamwork through cooperative PE",
      ],
      image: "/images/sections/learning-journey/primary/sports-activities.png",
    },
    {
      id: "arts",
      label: "Arts & Creativity",
      heading: "Unleashing creative potential through art, music and performance",
      body: "The Arts at Newton's celebrate every child's creative voice. Through visual arts, music, dance and performance, students express themselves freely, develop aesthetic sensibility and build confidence. Arts are woven across subjects to enrich learning.",
      points: [
        "Drawing, painting, collage and three-dimensional art",
        "Music — singing, rhythm and basic instruments",
        "Dance, movement and performing arts",
        "Art exhibitions and school performance showcases",
      ],
      image: "/images/sections/learning-journey/primary/holistic-development.png",
    },
    {
      id: "value",
      label: "Value Education",
      heading: "Nurturing character, empathy and responsible citizenship",
      body: "Value Education at Newton's develops moral character and social responsibility. Through discussions, stories and real-world scenarios, students explore universal values such as honesty, respect, empathy and environmental stewardship.",
      points: [
        "Lessons in honesty, respect, empathy and integrity",
        "Community service and social responsibility projects",
        "Environmental awareness and sustainability practices",
        "Mindfulness, gratitude and emotional wellbeing sessions",
      ],
      image: "/images/sections/learning-journey/primary/life-competencies.png",
    },
  ] as LJCurriculumTab[],

  typicalDayHeading: "A typical day at school in our Primary",
  typicalDayBody:
    "Each day at Newton's School is filled with discovery, curiosity and joyful learning. While routines differ by age, here is a glimpse of what happens between the lessons in our Primary class.",
  typicalDay: [
    {
      time: "7:30 AM",
      title: "Start of school",
      body: "A warm and inviting start, where staff greet children and parents at the school gate.",
      color: "#FFF5E5",
      accent: "#F39200",
    },
    {
      time: "8:00 AM",
      title: "Morning assembly",
      body: "Students gather for assembly — a time for values, announcements and building community spirit.",
      color: "#EEF2FF",
      accent: "#060C8B",
    },
    {
      time: "8:30 AM",
      title: "Core subjects",
      body: "English, Maths and Science lessons come alive through enquiry and hands-on activities.",
      color: "#F0FDF4",
      accent: "#16a34a",
    },
    {
      time: "10:30 AM",
      title: "Breakfast break",
      body: "Children enjoy a calm meal to kick off the learning day ahead.",
      color: "#FFF5E5",
      accent: "#F39200",
    },
    {
      time: "11:00 AM",
      title: "Languages & enrichment",
      body: "Telugu, Hindi, Computer Fundamentals and Value Education deepen skills and cultural connection.",
      color: "#FDF4FF",
      accent: "#9333ea",
    },
    {
      time: "1:00 PM",
      title: "Arts, PE & extracurriculars",
      body: "Creative arts, physical education and after-school clubs round out a fulfilling school day.",
      color: "#EEF2FF",
      accent: "#060C8B",
    },
  ] as LJDayItem[],

  pillarsHeading: "Core Learning Pillars",
  pillarsBody:
    "At our primary school in Hyderabad, students transition from guided exploration to independent inquiry. Through hands-on projects and real-world challenges, they develop critical thinking, creativity and problem-solving skills. Students build confidence, take ownership of their learning and gain a broad perspective, preparing them to thrive in an ever-evolving world.",
  pillarsPoints: [
    "Enquiry-based and project-led learning every day",
    "SSC curriculum enriched with activity-based approaches",
    "Strong emphasis on mathematical reasoning and literacy",
    "Telugu-English bilingual instruction in core subjects",
    "Weekly Science experiments and STEM activities",
    "Holistic growth through sports, arts and value education",
  ],
  pillarsImages: [
    { label: "Academic Achievement", image: "/images/sections/learning-journey/primary/academic-achievement.png" },
    { label: "Life Competencies", image: "/images/sections/learning-journey/primary/life-competencies.png" },
    { label: "Multilingualism", image: "/images/sections/learning-journey/primary/multilingualism.png" },
  ] as LJPillarImage[],

  enrollHeading: "When to enrol",
  enrollBody:
    "At Newton's School, we provide flexible enrolment options for our Primary programme throughout the year. Our admissions team is available to understand your needs and help in choosing the ideal start date for your child.",

  activityCards: [
    {
      title: "Clubs, Sports & Opportunities",
      href: "/school-life/clubs-sports",
      image: "/images/sections/learning-journey/primary/sports-activities.png",
    },
    {
      title: "Tuition Fees",
      href: "/admissions/tuition-fees",
      image: "/images/sections/learning-journey/primary/students-campus.jpg",
    },
    {
      title: "Upper Primary School",
      href: "/learning-journey/upper-primary",
      image: "/images/sections/learning-journey/_stage-cards/upper-primary.png",
    },
  ] as LJActivityCard[],

  relatedCards: [
    {
      label: "Pre-Primary School",
      ages: "Ages 3½ – 5½",
      href: "/learning-journey/pre-primary",
      image: "/images/sections/learning-journey/_stage-cards/pre-primary.png",
    },
    {
      label: "Upper Primary School",
      ages: "Ages 11 – 14",
      href: "/learning-journey/upper-primary",
      image: "/images/sections/learning-journey/_stage-cards/upper-primary.png",
    },
    {
      label: "Secondary School (SSC)",
      ages: "Ages 14 – 16",
      href: "/learning-journey/secondary-ssc",
      image: "/images/sections/learning-journey/_stage-cards/secondary.png",
    },
  ] as LJRelatedCard[],
};

// ── Upper Primary School data ────────────────────────────────────────────────

export const UPPER_PRIMARY_SCHOOL = {
  agesLabel: "Grades 6 – 8 · Ages 11 – 14",
  heroImage: "/images/sections/learning-journey/upper-primary/hero.png",
  heroTagline: "Growing Knowledge. Building Confidence. Preparing for Success.",
  heroDescription:
    "At Newton's High School, our Upper Primary program empowers students to strengthen academic foundations, develop critical thinking, improve communication skills, and prepare confidently for Secondary School (SSC). Through engaging classroom learning, projects, sports, and co-curricular activities, students become independent learners and responsible individuals.",

  introHeading: "Upper Primary School in Hyderabad",
  introBody:
    "Classes 6 to 8 at Newton's mark the crucial bridge between foundational learning and SSC success. Students deepen subject knowledge, sharpen critical thinking, develop strong communication skills, and grow into responsible, confident individuals — fully prepared for the rigours of Secondary School.",

  features: [
    {
      iconKey: "book" as IconKey,
      title: "Advanced Subject Learning",
      body: "Students explore subjects in greater depth through concept-based learning and practical understanding, building mastery that prepares them for SSC.",
    },
    {
      iconKey: "mic" as IconKey,
      title: "Communication Skills",
      body: "Students improve speaking, reading, writing, presentation, and interpersonal communication skills through structured classroom activities and public events.",
    },
    {
      iconKey: "trophy" as IconKey,
      title: "Leadership Development",
      body: "Opportunities through school events, group activities, clubs, and student responsibilities develop confident, responsible young leaders.",
    },
    {
      iconKey: "computer" as IconKey,
      title: "Technology & Digital Skills",
      body: "Introduction to computer applications, digital literacy, and responsible technology usage prepares students for the modern world.",
    },
  ] as LJFeature[],

  statsHeading: "Academic Growth & Achievement",
  statsBody:
    "Our Upper Primary students demonstrate outstanding engagement, achievement, and holistic development — a testament to Newton's commitment to every student's individual growth.",
  stats: [
    { value: "95%", label: "Student participation in classroom and co-curricular activities" },
    { value: "100+", label: "Science and cultural activities conducted every academic year" },
    { value: "50+", label: "Leadership opportunities across clubs, events, and student roles" },
    { value: "90%", label: "Consistent attendance rate maintained across all classes" },
  ] as LJStat[],

  curriculumHeading: "Our Curriculum",
  curriculumBody:
    "Our Upper Primary curriculum deepens subject knowledge through concept-based learning, critical thinking, and practical application — building the strong academic foundation every student needs for SSC.",
  curriculumTabs: [
    {
      id: "english",
      label: "English",
      heading: "Reading, Writing, and Communication Excellence",
      body: "English in Upper Primary focuses on reading comprehension, advanced grammar, creative and analytical writing, and confident communication. Students engage in debates, presentations, and literature study to develop strong language skills for life.",
      points: [
        "Reading comprehension with inference and analysis",
        "Creative and formal writing across multiple genres",
        "Grammar, vocabulary, and expression development",
        "Debates, presentations, and public speaking practice",
      ],
      image: "/images/sections/learning-journey/upper-primary/multilingualism.png",
    },
    {
      id: "mathematics",
      label: "Mathematics",
      heading: "Problem-Solving, Reasoning, and Mathematical Mastery",
      body: "Mathematics deepens into algebra, geometry, data handling, and logical reasoning. Students develop problem-solving strategies, number sense, and analytical thinking to tackle real-world challenges confidently.",
      points: [
        "Algebra, equations, and logical reasoning",
        "Geometry — angles, shapes, and measurements",
        "Data handling, graphs, and statistics",
        "Real-world problem-solving and mental mathematics",
      ],
      image: "/images/sections/learning-journey/upper-primary/academic-achievement.png",
    },
    {
      id: "science",
      label: "General Science",
      heading: "Physics, Chemistry, and Biology Through Practical Learning",
      body: "General Science integrates Physics, Chemistry, and Biology into one engaging subject. Students conduct experiments, observe phenomena, and develop a scientific mindset through inquiry-based exploration of the natural world.",
      points: [
        "Physics — force, motion, light, and energy concepts",
        "Chemistry — materials, reactions, and properties",
        "Biology — life systems, ecology, and the human body",
        "Lab experiments and hands-on scientific investigations",
      ],
      image: "/images/sections/learning-journey/upper-primary/academic-excellence.png",
    },
    {
      id: "social",
      label: "Social Studies",
      heading: "History, Geography, Civics, and Understanding Society",
      body: "Social Studies builds awareness of history, geography, and civic responsibility. Students explore India's heritage, understand global geography, and learn what it means to be an active, informed citizen.",
      points: [
        "Ancient, medieval, and modern Indian history",
        "Physical and political geography of India and the world",
        "Civics — democratic values, governance, and rights",
        "Contemporary social issues and responsible citizenship",
      ],
      image: "/images/sections/learning-journey/upper-primary/holistic-development.png",
    },
    {
      id: "telugu",
      label: "Telugu",
      heading: "Language Proficiency and Cultural Awareness",
      body: "Telugu is taught with depth and pride. Students strengthen reading, writing, and grammar skills while exploring rich Telugu literature, poetry, and cultural heritage that connects them to their roots.",
      points: [
        "Advanced reading and writing in Telugu script",
        "Grammar, syntax, and formal expression",
        "Telugu poetry, folk literature, and prose study",
        "Cultural expression, communication, and heritage",
      ],
      image: "/images/sections/learning-journey/upper-primary/multilingualism.png",
    },
    {
      id: "hindi",
      label: "Hindi",
      heading: "National Language Communication and Literacy",
      body: "Hindi instruction at the Upper Primary level builds fluency, literacy, and confident communication. Through prose, poetry, and grammar study, students strengthen their command of the national language.",
      points: [
        "Reading comprehension and prose analysis",
        "Hindi grammar, syntax, and composition",
        "Poetry, essays, and creative writing in Hindi",
        "Conversational Hindi for everyday communication",
      ],
      image: "/images/sections/learning-journey/upper-primary/holistic-development.png",
    },
    {
      id: "computer",
      label: "Computer Fundamentals",
      heading: "Digital Literacy, Applications, and Internet Awareness",
      body: "Computer Fundamentals introduces students to practical digital skills — from office applications to internet safety. Students develop computational thinking and responsible online behaviour for the digital age.",
      points: [
        "Computer hardware, software, and operating systems",
        "Word processing, spreadsheets, and presentations",
        "Internet usage, digital safety, and online etiquette",
        "Basic programming logic and computational thinking",
      ],
      image: "/images/sections/learning-journey/upper-primary/quality-ssc-education.png",
    },
    {
      id: "pe",
      label: "Physical Education",
      heading: "Fitness, Sportsmanship, Teamwork, and Discipline",
      body: "Physical Education builds fitness, discipline, and sportsmanship. Students participate in team sports, athletics, and fitness activities that develop strong character alongside physical wellbeing.",
      points: [
        "Team sports — cricket, kabaddi, volleyball, and athletics",
        "Physical fitness and conditioning exercises",
        "Yoga and mindfulness for mental wellbeing",
        "Leadership through captainship and peer coaching",
      ],
      image: "/images/sections/learning-journey/upper-primary/sports-activities.png",
    },
    {
      id: "arts",
      label: "Arts & Culture",
      heading: "Creativity, Expression, and Cultural Participation",
      body: "Arts & Culture celebrates creative expression through music, dance, drawing, and drama. Students develop aesthetic sensibility, creative confidence, and cultural pride through active participation in school life.",
      points: [
        "Drawing, painting, and visual arts creation",
        "Music — vocals, rhythm, and basic instruments",
        "Dance — classical, folk, and contemporary styles",
        "Drama, skits, and school performance events",
      ],
      image: "/images/sections/learning-journey/upper-primary/holistic-development.png",
    },
    {
      id: "value",
      label: "Value Education",
      heading: "Ethics, Responsibility, Respect, and Character Development",
      body: "Value Education nurtures moral character and social awareness. Through stories, discussions, and real-world scenarios, students build integrity, empathy, respect, and a sense of responsibility towards their community.",
      points: [
        "Ethics, integrity, and sound moral reasoning",
        "Respect, empathy, and inclusive attitudes",
        "Environmental and social responsibility",
        "Mindfulness, gratitude, and emotional regulation",
      ],
      image: "/images/sections/learning-journey/upper-primary/life-competencies.png",
    },
  ] as LJCurriculumTab[],

  activitiesHeading: "Beyond the Classroom",
  activitiesBody:
    "At Newton's Upper Primary, learning comes alive through hands-on activities, projects, competitions, and cultural experiences that complement and enrich academic study.",
  activities: [
    { label: "Science Experiments", image: "/images/sections/learning-journey/upper-primary/academic-excellence.png" },
    { label: "Mathematics Activities", image: "/images/sections/learning-journey/upper-primary/academic-achievement.png" },
    { label: "Project-Based Learning", image: "/images/sections/learning-journey/upper-primary/holistic-development.png" },
    { label: "Educational Tours", image: "/images/sections/learning-journey/upper-primary/quality-ssc-education.png" },
    { label: "Quiz Competitions", image: "/images/sections/learning-journey/upper-primary/sports-activities.png" },
    { label: "Cultural Programs", image: "/images/sections/learning-journey/upper-primary/multilingualism.png" },
  ] as LJPillarImage[],

  typicalDayHeading: "A Typical Day at Upper Primary",
  typicalDayBody:
    "Each day at Newton's Upper Primary is structured for maximum learning, personal growth, and enjoyment — balancing academics, activities, and meaningful reflection.",
  typicalDay: [
    {
      time: "7:30 AM",
      title: "Morning Assembly",
      body: "Prayer, thought for the day, school announcements, and building a strong sense of community spirit.",
      color: "#EEF2FF",
      accent: "#060C8B",
    },
    {
      time: "8:00 AM",
      title: "Interactive Classes",
      body: "Engaging lessons, discussions, and concept-based learning in core academic subjects.",
      color: "#FFF5E5",
      accent: "#F39200",
    },
    {
      time: "10:30 AM",
      title: "Activity Sessions",
      body: "Projects, lab sessions, group work, and collaborative learning experiences.",
      color: "#F0FDF4",
      accent: "#16a34a",
    },
    {
      time: "11:30 AM",
      title: "Break Time",
      body: "Relaxation, social interaction, and a nutritious break to recharge for the rest of the day.",
      color: "#FDF4FF",
      accent: "#9333ea",
    },
    {
      time: "12:00 PM",
      title: "Sports & Games",
      body: "Physical development, teamwork, and sportsmanship through structured PE and outdoor games.",
      color: "#FFF5E5",
      accent: "#ea7c2f",
    },
    {
      time: "1:30 PM",
      title: "Reflection & Wrap-Up",
      body: "Review of the day's learning, homework guidance, and preparation for tomorrow's sessions.",
      color: "#F0F9FF",
      accent: "#0891b2",
    },
  ] as LJDayItem[],

  pillarsHeading: "Core Learning Pillars",
  pillarsBody:
    "At Newton's Upper Primary, we build well-rounded individuals through six core pillars that guide everything we do — from classroom instruction to co-curricular development and character building.",
  pillarsPoints: [
    "Concept-based learning with SSC examination focus",
    "Critical thinking and analytical problem-solving daily",
    "Confident communication in English, Telugu, and Hindi",
    "Leadership through clubs, events, and student roles",
    "Creativity nurtured through arts, projects, and innovation",
    "Character built through values, discipline, and integrity",
  ],
  pillarCards: [
    {
      iconKey: "star" as IconKey,
      title: "Academic Excellence",
      body: "Strong subject knowledge and consistent academic performance.",
    },
    {
      iconKey: "lightbulb" as IconKey,
      title: "Critical Thinking",
      body: "Problem-solving, analytical skills, and independent reasoning.",
    },
    {
      iconKey: "mic" as IconKey,
      title: "Communication",
      body: "Confident expression, public speaking, and multilingual skills.",
    },
    {
      iconKey: "trophy" as IconKey,
      title: "Leadership",
      body: "Taking initiative, responsibility, and working collaboratively.",
    },
    {
      iconKey: "palette" as IconKey,
      title: "Creativity",
      body: "Exploring ideas, creative thinking, and artistic expression.",
    },
    {
      iconKey: "shield" as IconKey,
      title: "Character Building",
      body: "Integrity, discipline, empathy, and strong personal values.",
    },
  ] as LJFeature[],

  clubs: [
    {
      iconKey: "flask" as IconKey,
      title: "Science Club",
      body: "Hands-on experiments, STEM challenges, and scientific innovation that spark curiosity and deeper understanding.",
    },
    {
      iconKey: "book" as IconKey,
      title: "Literary Club",
      body: "Reading, creative writing, debates, storytelling, and building a love of language and literature.",
    },
    {
      iconKey: "palette" as IconKey,
      title: "Cultural Club",
      body: "Dance, music, visual arts, drama, and celebrating India's rich cultural heritage through creative expression.",
    },
    {
      iconKey: "trophy" as IconKey,
      title: "Sports Club",
      body: "Competitive sports, fitness training, and inter-school tournaments that develop teamwork and physical discipline.",
    },
    {
      iconKey: "leaf" as IconKey,
      title: "Eco Club",
      body: "Environmental awareness, sustainability projects, and responsible citizenship for a greener, healthier world.",
    },
  ] as LJFeature[],

  galleryHeading: "Student Life at Newton's",
  galleryItems: [
    { label: "Classroom Learning", image: "/images/sections/learning-journey/upper-primary/academic-excellence.png" },
    { label: "Science Lab Activities", image: "/images/sections/learning-journey/upper-primary/quality-ssc-education.png" },
    { label: "Group Discussions", image: "/images/sections/learning-journey/upper-primary/holistic-development.png" },
    { label: "Sports Events", image: "/images/sections/learning-journey/upper-primary/sports-activities.png" },
    { label: "Cultural Celebrations", image: "/images/sections/learning-journey/upper-primary/multilingualism.png" },
    { label: "School Assemblies", image: "/images/sections/learning-journey/upper-primary/students-campus.jpg" },
  ] as LJPillarImage[],

  sscPrepHeading: "Ready for the Next Stage",
  sscPrepBody:
    "Our Upper Primary program is carefully designed to prepare every student for Secondary School (Grades 9–10 SSC) by strengthening academic fundamentals, study habits, confidence, discipline, and independent learning skills.",
  sscPrepPoints: [
    "Strong conceptual understanding in all SSC subjects",
    "Structured study habits, time management, and self-discipline",
    "Confident communication and presentation skills",
    "Critical thinking and analytical examination approach",
    "Character, integrity, and leadership for SSC readiness",
  ],
  sscPrepImage: "/images/sections/learning-journey/upper-primary/ssc-prep.png",

  parentHeading: "Working Together for Student Success",
  parentBody:
    "At Newton's, we believe strong parent-school partnerships are fundamental to every student's growth. We actively involve parents in their child's educational journey through structured, meaningful engagement.",
  parentCards: [
    {
      title: "Parent-Teacher Meetings",
      body: "Regular structured meetings to discuss academic progress, social development, and individual student needs.",
    },
    {
      title: "Progress Reviews",
      body: "Term-based detailed academic reports and progress reviews shared with parents for complete transparency.",
    },
    {
      title: "Academic Guidance",
      body: "Guidance sessions to help parents support learning at home, including study tips and curriculum insights.",
    },
    {
      title: "Student Support",
      body: "Dedicated pastoral and counselling support for students, with parents kept informed every step of the way.",
    },
  ] as { title: string; body: string }[],

  enrollHeading: "Join Our Upper Primary Program",
  enrollBody:
    "Help your child build confidence, knowledge, leadership skills, and a strong academic foundation for SSC success.",
};

// ── Secondary School (SSC) data ──────────────────────────────────────────────

export const SECONDARY_SCHOOL = {
  agesLabel: "Grades 9–10 · Ages 14 – 16",
  heroImage: "/images/sections/learning-journey/secondary-ssc/hero.png",
  heroTagline: "Empowering students with strong academics, disciplined learning, board examination success, and future-ready skills.",

  introHeading: "Why Choose Newton's SSC Program?",
  introBody:
    "Newton's High School SSC program is designed for excellence — combining rigorous academics, experienced faculty, individual attention, and focused board exam preparation to help every student achieve outstanding results.",
  features: [
    {
      iconKey: "star" as IconKey,
      title: "Academic Excellence",
      body: "Strong subject mastery through experienced faculty, structured learning, and consistent performance tracking.",
    },
    {
      iconKey: "book" as IconKey,
      title: "SSC Board Preparation",
      body: "Focused preparation aligned with the Telangana SSC curriculum, covering all subjects thoroughly and methodically.",
    },
    {
      iconKey: "users" as IconKey,
      title: "Individual Attention",
      body: "Regular mentoring, doubt-clearing sessions, and personalised academic support for every single student.",
    },
    {
      iconKey: "lightbulb" as IconKey,
      title: "Future Readiness",
      body: "Preparing students confidently for Intermediate education, competitive examinations, and future career paths.",
    },
  ] as LJFeature[],

  statsHeading: "Student Success & Academic Results",
  statsBody:
    "Our SSC students consistently achieve outstanding board results, reflecting the quality of teaching, disciplined learning, and individual commitment at Newton's High School.",
  stats: [
    { value: "98%", label: "SSC Board Pass Rate" },
    { value: "95%", label: "Students achieving Distinction" },
    { value: "100+", label: "Merit & Award Recipients" },
    { value: "50+", label: "Academic Awards & Honours" },
    { value: "30+", label: "Scholarship Achievers" },
    { value: "20+", label: "Competitive Exam Selections" },
  ] as LJStat[],

  curriculumHeading: "Comprehensive Telangana SSC Curriculum",
  curriculumBody:
    "Our SSC curriculum follows the Telangana State Board framework, covering every subject with depth, clarity, and a sharp focus on board examination success.",
  curriculumTabs: [
    {
      id: "mathematics",
      label: "Mathematics",
      heading: "Algebra, Geometry, Trigonometry, and Problem-Solving",
      body: "Mathematics at SSC level builds strong analytical and problem-solving ability. Through structured lessons covering algebra, geometry, trigonometry, and statistics, students develop mathematical confidence and examination readiness.",
      points: [
        "Algebra — equations, polynomials, and real numbers",
        "Geometry — triangles, circles, and constructions",
        "Trigonometry — ratios, identities, and applications",
        "Statistics — data analysis, probability, and graphs",
      ],
      image: "/images/sections/learning-journey/secondary-ssc/academic-achievement.png",
    },
    {
      id: "science",
      label: "Science",
      heading: "Physical Science and Biological Science with Practicals",
      body: "Science is taught as two integrated streams — Physical Science and Biological Science — with strong emphasis on conceptual understanding, practical experiments, and real-world applications that bring theory to life in the classroom.",
      points: [
        "Physical Science — physics and chemistry concepts in depth",
        "Biological Science — life sciences, ecology, and health",
        "Lab experiments and investigative practical sessions",
        "Board examination paper practice and model tests",
      ],
      image: "/images/sections/learning-journey/secondary-ssc/academic-excellence.png",
    },
    {
      id: "social",
      label: "Social Studies",
      heading: "History, Geography, Economics, and Civics",
      body: "Social Studies builds comprehensive awareness of India's history, geography, economy, and civic institutions. Students develop critical thinking about society, government, and their own role as informed citizens.",
      points: [
        "Indian and world history — ancient, medieval, and modern",
        "Geography — physical, human, and economic geography",
        "Economics — markets, government, and development",
        "Civics — democracy, the Constitution, and fundamental rights",
      ],
      image: "/images/sections/learning-journey/secondary-ssc/holistic-development.png",
    },
    {
      id: "english",
      label: "English",
      heading: "Reading, Writing, Communication, and Literature",
      body: "English at SSC level focuses on reading comprehension, grammar, creative writing, and literature study. Students develop language skills that prepare them for board examinations and confident communication in any context.",
      points: [
        "Reading comprehension and inferential skills",
        "Grammar, vocabulary, and formal writing techniques",
        "Literature — prose, poetry, drama, and supplementary readers",
        "Writing — essays, formal letters, and reports",
      ],
      image: "/images/sections/learning-journey/secondary-ssc/multilingualism.png",
    },
    {
      id: "telugu",
      label: "Telugu / Hindi",
      heading: "Language Proficiency and Cultural Communication",
      body: "Telugu and Hindi are taught with a focus on language proficiency, literature analysis, and board examination preparation. Students strengthen mastery of their language along with an appreciation of its cultural context.",
      points: [
        "Grammar, syntax, and formal written expression",
        "Prose, poetry, and literature study",
        "Letter writing, essays, and reading comprehension",
        "Communication skills and cultural awareness",
      ],
      image: "/images/sections/learning-journey/secondary-ssc/multilingualism.png",
    },
    {
      id: "computer",
      label: "Computer Literacy",
      heading: "Digital Awareness, Applications, and Technology Skills",
      body: "Computer Literacy at SSC level equips students with essential digital skills — from word processing and internet usage to computational thinking — preparing them for the technology demands of Intermediate and higher education.",
      points: [
        "Computer hardware, software, and operating systems",
        "Office applications — word processing, spreadsheets, presentations",
        "Internet usage, digital safety, and online awareness",
        "Introduction to programming logic and computational thinking",
      ],
      image: "/images/sections/learning-journey/secondary-ssc/quality-ssc-education.png",
    },
  ] as LJCurriculumTab[],

  examHeading: "Board Exam Preparation Framework",
  examBody:
    "A structured, step-by-step approach ensures every student is thoroughly prepared for the Telangana SSC board examinations — from first concept to final mock paper.",
  examFramework: [
    {
      step: "01",
      title: "Concept Learning",
      body: "Deep understanding of every chapter and topic across all subjects through structured, paced classroom teaching.",
    },
    {
      step: "02",
      title: "Weekly Assessments",
      body: "Regular unit-level tests to evaluate understanding and provide timely, actionable feedback to students.",
    },
    {
      step: "03",
      title: "Monthly Examinations",
      body: "Full-syllabus monthly examinations to track cumulative performance and identify areas for targeted improvement.",
    },
    {
      step: "04",
      title: "Pre-Final Examinations",
      body: "Board-pattern simulation examinations held under real exam conditions to build confidence and readiness.",
    },
    {
      step: "05",
      title: "Structured Revision",
      body: "Dedicated revision programs with chapter summaries, formula sheets, and focused doubt-clearing sessions.",
    },
    {
      step: "06",
      title: "SSC Model Papers",
      body: "Extensive practice using previous board papers and model tests to ensure complete examination preparedness.",
    },
  ] as LJFrameworkStep[],

  typicalDayHeading: "A Typical Day in Secondary School",
  typicalDayBody:
    "Each day at Newton's Secondary School is carefully structured to balance rigorous academics with practical learning, personal development, and focused reflection.",
  typicalDay: [
    {
      time: "7:30 AM",
      title: "Morning Assembly",
      body: "Character-building sessions, motivational thoughts for the day, and community announcements.",
      color: "#EEF2FF",
      accent: "#060C8B",
    },
    {
      time: "8:00 AM",
      title: "Academic Sessions",
      body: "Structured subject lessons with interactive teaching and board-focused content delivery.",
      color: "#FFF5E5",
      accent: "#F39200",
    },
    {
      time: "10:30 AM",
      title: "Practical Learning",
      body: "Science lab sessions, mathematics activities, and project-based applied learning.",
      color: "#F0FDF4",
      accent: "#16a34a",
    },
    {
      time: "11:30 AM",
      title: "Study Hour",
      body: "Guided revision, doubt clarification, and structured self-study with full teacher support.",
      color: "#FDF4FF",
      accent: "#9333ea",
    },
    {
      time: "12:30 PM",
      title: "Sports & Activities",
      body: "Physical education, team sports, and co-curricular activities for balanced development.",
      color: "#FFF5E5",
      accent: "#ea7c2f",
    },
    {
      time: "1:30 PM",
      title: "Reflection Session",
      body: "Daily review of learning objectives, goal-setting for tomorrow, and individual performance feedback.",
      color: "#F0F9FF",
      accent: "#0891b2",
    },
  ] as LJDayItem[],

  supportHeading: "Academic Support System",
  supportBody:
    "Every Newton's SSC student has access to a comprehensive support system — ensuring no student is left behind and every student has the opportunity to excel.",
  supportItems: [
    {
      iconKey: "users" as IconKey,
      title: "Dedicated Subject Experts",
      body: "Experienced teachers with deep subject mastery and a proven passion for student success.",
    },
    {
      iconKey: "book" as IconKey,
      title: "Doubt-Clearing Sessions",
      body: "Scheduled and on-demand sessions to address individual questions and close conceptual gaps.",
    },
    {
      iconKey: "star" as IconKey,
      title: "Remedial Classes",
      body: "Targeted catch-up sessions for students who need additional support in any subject area.",
    },
    {
      iconKey: "trophy" as IconKey,
      title: "Advanced Learning Programs",
      body: "Extension activities and challenges for high-performing students to deepen and broaden their learning.",
    },
    {
      iconKey: "mic" as IconKey,
      title: "Parent Progress Meetings",
      body: "Regular structured meetings to discuss academic progress and align school and family goals.",
    },
    {
      iconKey: "shield" as IconKey,
      title: "Performance Monitoring",
      body: "Continuous tracking of student performance with data-driven insights and early intervention.",
    },
  ] as LJFeature[],

  scienceHeading: "Science & Innovation",
  scienceBody:
    "Our science program goes beyond the textbook — students experiment, explore, and innovate through hands-on laboratory work, STEM projects, and science exhibitions.",
  scienceItems: [
    { label: "Science Laboratory", image: "/images/sections/learning-journey/secondary-ssc/academic-excellence.png" },
    { label: "Mathematics Lab Activities", image: "/images/sections/learning-journey/secondary-ssc/academic-achievement.png" },
    { label: "STEM Projects", image: "/images/sections/learning-journey/secondary-ssc/holistic-development.png" },
    { label: "Science Exhibitions", image: "/images/sections/learning-journey/secondary-ssc/quality-ssc-education.png" },
    { label: "Innovation Challenges", image: "/images/sections/learning-journey/secondary-ssc/faculty-mentorship.png" },
    { label: "Research-Based Learning", image: "/images/sections/learning-journey/secondary-ssc/life-competencies.png" },
  ] as LJPillarImage[],

  leadershipHeading: "Leadership & Life Skills",
  leadershipBody:
    "Academic excellence and holistic development go hand in hand at Newton's. We cultivate leaders, communicators, and confident individuals fully prepared for life beyond school.",
  leadershipItems: [
    {
      iconKey: "trophy" as IconKey,
      title: "Student Leadership Programs",
      body: "Student council, prefect roles, and event leadership that build confidence and responsibility.",
    },
    {
      iconKey: "mic" as IconKey,
      title: "Communication Skills",
      body: "Structured activities to develop clear, articulate, and confident communication in all contexts.",
    },
    {
      iconKey: "users" as IconKey,
      title: "Public Speaking",
      body: "Debates, elocution, and presentations that build persuasive, confident public expression.",
    },
    {
      iconKey: "globe" as IconKey,
      title: "Teamwork",
      body: "Collaborative projects, team sports, and group activities that develop cooperative working skills.",
    },
    {
      iconKey: "lightbulb" as IconKey,
      title: "Decision Making",
      body: "Real-world scenarios and structured programs to develop sound judgment and reasoning ability.",
    },
    {
      iconKey: "shield" as IconKey,
      title: "Time Management",
      body: "Study planning, schedule discipline, and self-management habits for academic and personal success.",
    },
  ] as LJFeature[],

  careerHeading: "Career Awareness & Guidance",
  careerBody:
    "We prepare our SSC students not just for board examinations, but for informed, confident decisions about their future — Intermediate streams, career paths, and long-term goals.",
  careerItems: [
    {
      iconKey: "lightbulb" as IconKey,
      title: "Career Exploration Workshops",
      body: "Interactive sessions introducing students to diverse career fields, professional paths, and emerging opportunities.",
    },
    {
      iconKey: "book" as IconKey,
      title: "Intermediate Course Guidance",
      body: "Expert counselling to help students choose the Intermediate stream — MPC, BiPC, CEC — aligned with their strengths.",
    },
    {
      iconKey: "star" as IconKey,
      title: "Goal Planning Sessions",
      body: "Structured workshops to help students set clear academic and career goals with concrete, achievable action plans.",
    },
    {
      iconKey: "users" as IconKey,
      title: "Academic Counseling",
      body: "One-on-one sessions with experienced counsellors to address concerns and chart a clear path forward.",
    },
    {
      iconKey: "globe" as IconKey,
      title: "Stream Selection Support",
      body: "Guidance on MPC, BiPC, CEC, and other Intermediate streams to help every student decide with confidence.",
    },
  ] as LJFeature[],

  achievementsHeading: "Student Achievements",
  achievementsItems: [
    { label: "Academic Awards", image: "/images/sections/learning-journey/secondary-ssc/academic-excellence.png" },
    { label: "Science Olympiads", image: "/images/sections/learning-journey/secondary-ssc/quality-ssc-education.png" },
    { label: "Science Fair Winners", image: "/images/sections/learning-journey/secondary-ssc/academic-achievement.png" },
    { label: "Sports Achievements", image: "/images/sections/learning-journey/secondary-ssc/sports-activities.png" },
    { label: "Cultural Competitions", image: "/images/sections/learning-journey/secondary-ssc/multilingualism.png" },
    { label: "Community Service", image: "/images/sections/learning-journey/secondary-ssc/holistic-development.png" },
  ] as LJPillarImage[],

  parentHeading: "Parent Partnership",
  parentBody:
    "At Newton's, parents are essential partners in every student's academic journey. Our structured engagement ensures complete transparency, aligned goals, and collaborative support.",
  parentItems: [
    {
      iconKey: "users" as IconKey,
      title: "Regular PTMs",
      body: "Scheduled parent-teacher meetings to discuss academic progress, behaviour, and individual student goals.",
    },
    {
      iconKey: "book" as IconKey,
      title: "Academic Progress Reports",
      body: "Detailed term reports providing a clear, transparent picture of performance, effort, and improvement areas.",
    },
    {
      iconKey: "star" as IconKey,
      title: "Performance Analytics",
      body: "Data-driven performance insights shared with parents for informed, proactive academic decisions.",
    },
    {
      iconKey: "mic" as IconKey,
      title: "Personalised Guidance",
      body: "Subject-specific and general academic advice tailored to each student's unique strengths and needs.",
    },
    {
      iconKey: "shield" as IconKey,
      title: "Open Communication",
      body: "Direct channels between parents and faculty ensuring real-time updates and collaborative support.",
    },
    {
      iconKey: "lightbulb" as IconKey,
      title: "Goal Alignment",
      body: "Joint sessions to align school and parent expectations around student goals and academic outcomes.",
    },
  ] as LJFeature[],

  facilitiesHeading: "Facilities Supporting SSC Success",
  facilities: [
    {
      iconKey: "lightbulb" as IconKey,
      title: "Smart Classrooms",
      body: "Technology-enabled interactive classrooms for engaging, board-focused teaching and learning.",
    },
    {
      iconKey: "flask" as IconKey,
      title: "Science Labs",
      body: "Well-equipped physics, chemistry, and biology laboratories for hands-on experimental learning.",
    },
    {
      iconKey: "book" as IconKey,
      title: "Library",
      body: "Comprehensive reference library with SSC study materials, textbooks, and revision resources.",
    },
    {
      iconKey: "computer" as IconKey,
      title: "Computer Lab",
      body: "Modern computer lab with internet access for digital literacy and computer studies practicals.",
    },
    {
      iconKey: "trophy" as IconKey,
      title: "Sports Facilities",
      body: "Indoor and outdoor sports facilities for physical fitness, games, and inter-school competitions.",
    },
    {
      iconKey: "star" as IconKey,
      title: "Study Spaces",
      body: "Quiet, well-lit study areas designed for focused revision, self-study, and group learning sessions.",
    },
  ] as LJFeature[],

  beyondHeading: "Beyond SSC",
  beyondBody:
    "Our Secondary School program equips students with the academic strength, confidence, discipline, and critical thinking skills needed for success in Intermediate education, competitive examinations, and future careers.",

  enrollHeading: "Ready to Begin Your SSC Journey?",
  enrollBody:
    "Join Newton's High School and experience quality SSC education designed for academic excellence, disciplined learning, and holistic development.",
};
