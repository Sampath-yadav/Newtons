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
  agesLabel: "Ages 6 – 11 · Classes 1 to 5",
  heroImage: "/images/sections/learning-journey/primary/hero.png",
  heroDescription:
    "Classes 1 to 5 at Newton's High School, Banswada — building the academic skills, habits of mind, and personal values that every child carries forward for life. We follow the Telangana SSC Primary curriculum and enrich it with activity-based teaching, trilingual instruction, and genuine personal attention from teachers who know every child by name.",

  introHeading: "Quality Primary Education in Banswada — Classes 1 to 5",
  introBody:
    "At Newton's High School, our Primary programme spans Classes 1 to 5 for students aged 6 to 11. Academic habits formed now — how a child approaches a problem, how they handle not knowing an answer, how they relate to their teachers and classmates — stay with them for the rest of their schooling. We follow the Telangana State Board SSC curriculum and bring it to life through classroom discussions, hands-on projects, group activities, and real-world connections. Our Primary School in Banswada maintains a healthy student-teacher ratio of 25:1, meaning every teacher knows every child — their strengths, their challenges, and the specific kind of encouragement that works best for them.",

  features: [
    {
      iconKey: "book" as IconKey,
      title: "SSC-Aligned Activity-Based Learning",
      body: "Every subject in our Class 1 to 5 programme is taught in alignment with the Telangana SSC framework and brought to life through hands-on activities, classroom projects, and real-world examples. Students participate, explore, ask questions, and build genuine understanding through active engagement.",
    },
    {
      iconKey: "globe" as IconKey,
      title: "Trilingual Instruction — Telugu, Hindi, English",
      body: "Newton's Primary students build strong communication skills in all three languages simultaneously. Telugu, Hindi, and English are taught through reading, writing, speaking, and listening activities integrated naturally into daily classroom life.",
    },
    {
      iconKey: "lightbulb" as IconKey,
      title: "Skills for Life, Learnt Every Day",
      body: "Critical thinking, time management, the ability to work in a team, and the confidence to present ideas to others are developed through the way we teach — embedded in every lesson across every class, not through separate add-on programmes.",
    },
  ] as LJFeature[],

  statsHeading: "Primary School Results That Speak for Themselves",
  statsBody:
    "At Newton's High School, Banswada, strong academic results are the natural outcome of consistent teaching, regular assessment, and genuine care for every student's progress.",
  stats: [
    {
      value: "25:1",
      label: "Student-to-teacher ratio across all Primary classes",
    },
    {
      value: "Classes 1–5",
      label: "Structured Telangana SSC Primary programme",
    },
    {
      value: "3 Languages",
      label: "Telugu, Hindi, and English taught across all subjects daily",
    },
    {
      value: "Daily",
      label: "Individual student progress monitored and supported",
    },
  ] as LJStat[],

  curriculumHeading: "What Students Learn in Classes 1 to 5 at Newton's",
  curriculumBody:
    "Our Primary curriculum follows the Telangana State Board SSC framework across nine subject areas. Each subject is taught by experienced teachers using methods that make concepts clear, memorable, and genuinely useful to the child's world.",
  curriculumTabs: [
    {
      id: "english",
      label: "English",
      heading: "Reading, writing, speaking, and listening — the four pillars of confident communication",
      body: "English at Newton's Primary is taught as a living, practical language — not just a subject to pass in examinations. From Class 1 onwards, students develop all four communication skills simultaneously through structured reading programmes, guided writing practice, classroom discussion, and regular opportunities to speak in front of others. We use the Telangana State Board English syllabus and carefully selected supplementary reading materials to ensure students not only meet curriculum requirements but genuinely fall in love with reading and feel confident expressing themselves in English in any situation.",
      points: [
        "Structured reading programme from Class 1, progressing through graded texts to chapter books by Class 5",
        "Weekly writing practice — sentences, paragraphs, stories, letters, and factual descriptions",
        "Oral English activities including classroom presentations, storytelling, and structured discussions",
        "Grammar taught in context — through reading and writing, not isolated drilling",
        "Vocabulary building through theme-based units and daily classroom exposure",
      ],
      image: "/images/sections/learning-journey/primary/multilingualism.png",
    },
    {
      id: "mathematics",
      label: "Mathematics",
      heading: "Number sense, logical thinking, and problem-solving built step by step",
      body: "Mathematics at Newton's is about understanding, not memorising. Our teachers use concrete materials, visual models, and real-life problem scenarios to help students in Classes 1 to 5 build a genuine feel for numbers, patterns, and mathematical reasoning before moving to abstract procedures. Following the Telangana SSC Maths curriculum, we progress systematically from foundational number work in Class 1 through to fractions, decimals, geometry, and data handling by Class 5. Regular practice, weekly assessments, and prompt identification of learning gaps ensure that no student falls behind and no concept is left unresolved.",
      points: [
        "Number operations — addition, subtraction, multiplication, division taught with understanding and speed",
        "Mental arithmetic and tables practice embedded in every class",
        "Word problems and real-life applications in every unit",
        "Geometry — shapes, measurements, area and perimeter with hands-on activities",
        "Weekly timed practice and assessment to build both accuracy and examination confidence",
      ],
      image: "/images/sections/learning-journey/primary/academic-achievement.png",
    },
    {
      id: "science",
      label: "Science",
      heading: "Observation, questioning, and discovery — science the way it should be",
      body: "Science at Newton's Primary is taught with a strong emphasis on observation and hands-on investigation. We want students to think like scientists — to ask why, to look carefully, to test ideas, and to draw conclusions from what they actually see and do rather than simply reading facts from a textbook. Our Science programme follows the Telangana SSC curriculum and includes weekly practical activities, classroom demonstrations, and structured observation exercises that bring concepts in biology, physics, and chemistry to life in age-appropriate ways.",
      points: [
        "Weekly hands-on science activities and simple experiments",
        "Natural world — plants, animals, the human body, and ecosystems",
        "Physical science — matter, force, light, and simple machines",
        "Earth and environment — weather, water cycle, conservation",
        "Connection to Newton's Vana Mahotsavam tradition — environmental responsibility in the Science curriculum",
      ],
      image: "/images/sections/learning-journey/primary/academic-excellence.png",
    },
    {
      id: "telugu",
      label: "Telugu",
      heading: "Our mother tongue — taught with pride and purpose",
      body: "Telugu is taught at Newton's as both a language and a cultural identity. Students in Classes 1 to 5 develop strong Telugu reading, writing, and oral communication skills through the Telangana SSC Telugu curriculum, enriched by stories, poetry, folk traditions, and regular practice in a language our students hear and speak at home and in their community every day. A child who reads and writes Telugu with confidence and pride learns everything else with greater ease.",
      points: [
        "Telugu reading — from basic aksharamala to connected prose by Class 5",
        "Telugu writing — handwriting, dictation, paragraph, and essay",
        "Oral Telugu — recitation, conversation, and story retelling",
        "Telugu literature — age-appropriate poems, stories, and folk tales",
        "Cultural connection — Telangana traditions, proverbs, and values through the Telugu curriculum",
      ],
      image: "/images/sections/learning-journey/primary/multilingualism.png",
    },
    {
      id: "hindi",
      label: "Hindi",
      heading: "National language confidence built naturally from Class 1",
      body: "Hindi is introduced at Newton's from Class 1 and developed systematically through Classes 2 to 5, following the Telangana SSC Hindi curriculum. Students build reading, writing, and speaking confidence in Hindi through structured lessons that move at a manageable pace — ensuring every student develops genuine communicative ability by the time they reach Upper Primary School.",
      points: [
        "Hindi alphabet, reading, and writing from Class 1",
        "Structured vocabulary building through themes and daily use",
        "Short compositions and letter writing from Class 3 onwards",
        "Hindi conversation and comprehension activities",
        "Preparation for Upper Primary Hindi curriculum continuity",
      ],
      image: "/images/sections/learning-journey/primary/holistic-development.png",
    },
    {
      id: "computer",
      label: "Computer Fundamentals",
      heading: "Digital skills for a technology-enabled world — taught responsibly",
      body: "Newton's High School introduces Computer Fundamentals in Primary School to ensure every child develops essential digital literacy skills alongside a healthy, responsible attitude toward technology. This is especially important in the context of our school's Mobile Awareness Programme, which encourages students to be thoughtful and balanced in their use of technology. Students learn the basics of computer hardware, software, and keyboard operation, along with age-appropriate introductions to word processing, basic internet awareness, and digital safety.",
      points: [
        "Computer hardware — identifying and understanding parts of a computer",
        "Keyboard and mouse skills — typing practice from Class 2",
        "Word processing basics — creating and editing simple documents",
        "Introduction to safe, responsible internet use",
        "Digital citizenship — understanding screen time and online safety, linked to Newton's Mobile Awareness Programme",
      ],
      image: "/images/sections/learning-journey/primary/quality-ssc-education.png",
    },
    {
      id: "pe",
      label: "Physical Education",
      heading: "Fit bodies, disciplined minds, strong team spirit",
      body: "Physical Education at Newton's is a valued, timetabled subject for all Primary students. Our school grounds in Banswada provide the space for daily outdoor activity, sports practice, and physical games that develop strength, coordination, discipline, and the joy of healthy competition. Students participate in organised sports sessions, athletic activities, and team games that teach them about effort, fair play, winning graciously, and losing with dignity.",
      points: [
        "Daily outdoor activity and structured PE sessions",
        "Athletics — running, jumping, throwing on Newton's school ground",
        "Team sports — kabaddi, kho-kho, cricket, football",
        "Sports Day preparation and inter-class competitions",
        "Yoga and physical fitness exercises for health and concentration",
      ],
      image: "/images/sections/learning-journey/primary/sports-activities.png",
    },
    {
      id: "arts",
      label: "Arts & Creativity",
      heading: "Self-expression, imagination, and cultural pride through the arts",
      body: "Arts and Creativity at Newton's Primary School spans drawing, painting, craft, music, and performance. Creative confidence, fine motor skill, aesthetic awareness, and the ability to express ideas visually and musically are essential to a child's complete development. Newton's cultural calendar — including our Diwali celebrations, Independence Day performances, and Vana Mahotsavam activities — is closely connected to our Arts curriculum, giving students a meaningful purpose and audience for their creative work throughout the year.",
      points: [
        "Drawing and painting — technique, composition, colour theory",
        "Craft — seasonal and cultural projects using accessible materials",
        "Music — Telugu folk songs, Hindi national songs, English rhymes",
        "Rangoli and traditional Indian art forms taught in cultural context",
        "Performance arts — drama, dance, and public speaking for school events and celebrations",
      ],
      image: "/images/sections/learning-journey/primary/holistic-development.png",
    },
    {
      id: "value",
      label: "Value Education",
      heading: "Character, discipline, and respect — taught every single day",
      body: "Value Education at Newton's is not a once-a-week period — it is woven into the fabric of every school day. From the way students greet their teachers to the way they treat each other in the playground, good character is expected, modelled, and celebrated at every opportunity. Through dedicated Value Education lessons, story-based discussions, classroom activities, and school events, students in Classes 1 to 5 develop a clear and genuine understanding of honesty, respect, responsibility, kindness, environmental awareness, and national pride.",
      points: [
        "Weekly Value Education period with story-based moral discussions",
        "Classroom rules created with students — building ownership of shared values",
        "Environmental values — connected to Vana Mahotsavam and Green Day",
        "National values — Independence Day, Republic Day, and constitution awareness activities",
        "Respect for teachers — connected to our annual Teachers' Day self-government celebration",
      ],
      image: "/images/sections/learning-journey/primary/life-competencies.png",
    },
  ] as LJCurriculumTab[],

  typicalDayHeading: "A Day in Our Primary School — Newton's High School, Banswada",
  typicalDayBody:
    "Each school day at Newton's Primary is structured to give students the right balance of academic challenge, language learning, physical activity, and creative enrichment. Here is how a typical day unfolds for our Class 1 to 5 students.",
  typicalDay: [
    {
      time: "7:30 AM",
      title: "School Opens — A Strong Start",
      body: "Teachers welcome students and parents at the gate. Students settle into classrooms, organise their materials, and prepare mentally for the day. This quiet transition builds the habit of punctuality and personal responsibility from Class 1 onwards.",
      color: "#FFF5E5",
      accent: "#F39200",
    },
    {
      time: "8:00 AM",
      title: "Morning Assembly",
      body: "The full Primary School gathers for assembly combining the national pledge, a prayer, a motivational thought or short moral story, school announcements, and student performances. Assembly builds community, national pride, and the confidence to speak in front of others.",
      color: "#EEF2FF",
      accent: "#060C8B",
    },
    {
      time: "8:30 AM",
      title: "Core Academic Subjects",
      body: "The morning block is dedicated to English, Mathematics, and Science. These lessons are active, structured, and paced to ensure deep understanding. Teachers enrich the Telangana SSC curriculum with group work and regular formative assessment to check understanding and address gaps immediately.",
      color: "#F0FDF4",
      accent: "#16a34a",
    },
    {
      time: "10:30 AM",
      title: "Breakfast Break",
      body: "Students enjoy a supervised break for a nutritious snack and free social time. Children talk, play freely, and build the friendships that make school a place they genuinely want to be. Teachers supervise to ensure a safe, inclusive playground environment.",
      color: "#FFF5E5",
      accent: "#F39200",
    },
    {
      time: "11:00 AM",
      title: "Languages and Enrichment",
      body: "The late morning covers Telugu, Hindi, Computer Fundamentals, and Value Education. Language periods are active and communicative. Computer class gives structured digital skills practice. Value Education uses stories, discussion, and activities to reinforce the character strengths Newton's is known for.",
      color: "#FDF4FF",
      accent: "#9333ea",
    },
    {
      time: "1:00 PM",
      title: "Arts, Physical Education & Co-Curricular",
      body: "The final session is dedicated to Arts, PE, and enrichment activities. Students rotate between drawing, craft, music, outdoor PE sessions, and preparation for school events — including cultural celebrations, sports day, and our annual Vana Mahotsavam tree-planting programme.",
      color: "#EEF2FF",
      accent: "#060C8B",
    },
  ] as LJDayItem[],

  pillarsHeading: "How We Teach at Newton's Primary — Six Core Principles",
  pillarsBody:
    "Our Primary teaching philosophy is built on six principles that guide every classroom, every lesson, and every interaction at Newton's High School, Banswada.",
  pillarsPoints: [
    "Activity-based learning across every subject, every day",
    "The Telangana SSC curriculum — delivered with rigour and creativity",
    "Trilingual strength — Telugu, Hindi, and English built simultaneously",
    "Regular assessment and early intervention so no child falls behind",
    "Sport, arts, and character development every day",
    "A safe, disciplined, nurturing campus environment",
  ],
  philosophyPillars: [
    {
      title: "Activity-Based Learning Across Every Subject",
      body: "Every subject in our Primary curriculum is enriched with hands-on activities, classroom discussions, group projects, and real-world connections that make lessons engaging and meaningful — not just something to sit through.",
    },
    {
      title: "The Telangana SSC Curriculum — Done Well",
      body: "We follow the SSC curriculum with rigour and deliver it with creativity. Our teachers know the syllabus thoroughly and teach it in a way that builds genuine understanding, not just the ability to reproduce answers in an examination.",
    },
    {
      title: "Trilingual Strength — Telugu, Hindi, English",
      body: "Newton's Primary students develop real communicative confidence in all three languages. Telugu connects them to their culture. Hindi prepares them for national life. English opens doors to academic and professional opportunity.",
    },
    {
      title: "Regular Assessment and Early Intervention",
      body: "Weekly assessments, monthly tests, and term examinations give our teachers clear, timely information. When a student is struggling, we identify it early and act immediately. No child at Newton's falls behind silently.",
    },
    {
      title: "Sport, Arts, and Character Every Day",
      body: "Physical education, arts, music, and value education are timetabled and taken seriously — because discipline, teamwork, resilience, and creativity are equally essential to a child's success in life.",
    },
    {
      title: "A Safe, Disciplined, Nurturing Environment",
      body: "Newton's Primary School in Banswada is known for its positive school culture. Students are treated with respect and held to clear, consistent expectations — creating classrooms where every student feels safe to ask questions, make mistakes, and keep growing.",
    },
  ] as Array<{ title: string; body: string }>,
  pillarsImages: [
    { label: "Academic Achievement", image: "/images/sections/learning-journey/primary/academic-achievement.png" },
    { label: "Life Competencies", image: "/images/sections/learning-journey/primary/life-competencies.png" },
    { label: "Trilingual Confidence", image: "/images/sections/learning-journey/primary/multilingualism.png" },
  ] as LJPillarImage[],
  activities: [
    {
      title: "Vana Mahotsavam — Green Day Plantation Drive",
      body: "Every year, Newton's Primary students take part in our school-wide Vana Mahotsavam tree-plantation drive. Each student plants and waters their own sapling in the school garden, creating a direct, personal connection to environmental responsibility. Classrooms are transformed with student-made Rangoli art and 'Save Trees, Save Life' decorations. For Primary students, this is not just an event — it is a lived lesson in the relationship between human choices and the natural world.",
    },
    {
      title: "Mobile Awareness Programme — Real Digital Wisdom",
      body: "Newton's Mobile Awareness Programme is one of our most impactful school-wide initiatives. Through student-led roleplays, skits, and classroom activities, children explore the effects of excessive screen time and actively practise choosing books, outdoor play, and face-to-face relationships instead. This programme gives children a healthy, critical awareness of technology that they carry with them through every stage of their lives.",
    },
    {
      title: "Teachers' Day — Learning Respect Through Experience",
      body: "Newton's annual Teachers' Day celebration is one of the most meaningful days in our school calendar. Senior students take on the role of teachers for the day — conducting lessons, managing classrooms, and experiencing firsthand how much skill, patience, and dedication teaching requires. Primary students observe, support, and participate in ceremonies honouring their teachers with gratitude and respect.",
    },
    {
      title: "Cultural Celebrations — Diwali, Independence Day & More",
      body: "Cultural awareness is a core part of Newton's Primary education. Students celebrate Diwali with traditional Kesar Tilak ceremonies, creative performances, and classroom art that explores the meaning and values behind the festival. Independence Day and Republic Day are celebrated with patriotic performances, speeches, and activities that build national pride. These events are not interruptions to learning — they are learning.",
    },
  ] as Array<{ title: string; body: string }>,

  enrollHeading: "Enrol Your Child in Newton's Primary School Today",
  enrollBody:
    "We welcome admission enquiries for Classes 1 to 5 throughout the academic year, subject to seat availability. Our admissions team is always ready to speak with you, understand your child's current stage, and help you make the right decision. We encourage every family to visit our campus on Bodhan Road, Banswada — meet our Primary teachers, see our classrooms, and experience Newton's school culture for yourself.",

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
  agesLabel: "Classes 6 – 8 · Ages 11 to 14",
  heroImage: "/images/sections/learning-journey/upper-primary/hero.png",
  heroTagline:
    "Upper Primary School in Banswada — The Bridge to SSC Success",
  heroDescription:
    "Classes 6 to 8 at Newton's High School, Banswada — where the habits, skills, and confidence that determine SSC success are built. Deeper subject knowledge, stronger communication, and genuine leadership through real school responsibilities.",

  introHeading: "Quality Upper Primary Education in Banswada — Classes 6 to 8",
  introBody:
    "Classes 6 to 8 connect the academic foundation of Primary School to the demands of Secondary School and the Telangana SSC Board. Our Upper Primary programme follows the State Board SSC curriculum with one purpose: genuine conceptual understanding, not rote recall. Every student leaving Class 8 at Newton's is ready to think clearly, write confidently, and meet SSC head-on.",

  features: [
    {
      iconKey: "book" as IconKey,
      title: "Advanced Subject Learning",
      body: "Subjects are taught in greater depth across Classes 6 to 8 — moving students from basic recall to analysis, application, and explanation. This builds both SSC examination readiness and genuine academic capability.",
    },
    {
      iconKey: "mic" as IconKey,
      title: "Communication Skills — Written and Spoken",
      body: "Structured writing, debates, presentations, and public speaking develop confident communication in English, Telugu, and Hindi — skills that serve students at every stage of life.",
    },
    {
      iconKey: "trophy" as IconKey,
      title: "Leadership Through Real Responsibility",
      body: "From assembly duties to cultural event organisation and group project leadership, students in Classes 6 to 8 develop genuine leadership through real responsibility — not theory.",
    },
    {
      iconKey: "computer" as IconKey,
      title: "Technology & Digital Responsibility",
      body: "Word processing, spreadsheets, and internet safety are taught practically — alongside Newton's Mobile Awareness values of balanced, responsible technology use.",
    },
  ] as LJFeature[],

  statsHeading: "What Newton's Upper Primary Students Achieve",
  statsBody:
    "At Newton's High School, Banswada, our Upper Primary students are active, engaged, and growing across every dimension — academic, personal, creative, and physical.",
  stats: [
    { value: "10", label: "Subjects taught across Classes 6, 7, and 8" },
    { value: "3", label: "Languages — Telugu, Hindi, and English taught daily" },
    { value: "25:1", label: "Student-to-teacher ratio across all Upper Primary classes" },
    { value: "5+", label: "Student clubs and co-curricular programmes available" },
  ] as LJStat[],

  curriculumHeading: "What Students Study in Classes 6 to 8 at Newton's",
  curriculumBody:
    "Our Upper Primary curriculum covers ten subjects aligned to the Telangana State Board SSC framework. Each subject is taught by specialist teachers who bring both subject expertise and genuine commitment to every student's understanding and progress.",
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
      heading: "Our mother tongue — deepened, celebrated, and mastered",
      body: "Telugu in Classes 6 to 8 builds on Primary foundations — more complex texts, deeper literature and poetry study, and the writing fluency needed for SSC examinations. We teach Telugu as a source of cultural identity: Telangana's literary traditions, folk forms, and oral heritage woven throughout.",
      points: [
        "Advanced reading comprehension — prose, poetry, and drama",
        "Telugu composition — paragraphs, letters, essays, and summaries",
        "Telugu grammar — sandhi, samasa, vibhakti, and verb forms",
        "Telugu literature — prescribed Telangana SSC texts and poetry",
        "Cultural connection — Telangana folk traditions and literary heritage",
        "Oral Telugu — recitation, explanation, and discussion in class",
      ],
      image: "/images/sections/learning-journey/upper-primary/multilingualism.png",
    },
    {
      id: "hindi",
      label: "Hindi",
      heading: "National language competence — developed with structure and confidence",
      body: "Hindi in Classes 6 to 8 moves from Primary-level introduction to genuine communicative competence — reading, writing, and speaking developed systematically through the Telangana SSC curriculum for examination readiness and real-world confidence.",
      points: [
        "Hindi reading — fluency, comprehension, and inference",
        "Hindi writing — paragraphs, letters, essays, and short answers",
        "Hindi grammar — tenses, gender, number, and sentence structure",
        "Hindi vocabulary — theme-based units aligned to SSC syllabus",
        "Oral Hindi — classroom conversation and prepared recitation",
        "Preparation aligned to Class 10 SSC Hindi examination standards",
      ],
      image: "/images/sections/learning-journey/upper-primary/holistic-development.png",
    },
    {
      id: "computer",
      label: "Computer Applications",
      heading: "Practical digital skills built with responsibility and purpose",
      body: "Students move beyond basic computer literacy into word processing, spreadsheets, presentations, and programming logic — with responsible use taught alongside Newton's Mobile Awareness Programme values of balanced, safe, and purposeful technology engagement.",
      points: [
        "MS Word — document creation, formatting, and practical writing tasks",
        "MS Excel — spreadsheets, basic formulae, and data organisation",
        "MS PowerPoint — designing clear, well-structured presentations",
        "Introduction to programming concepts and computational thinking",
        "Internet safety — responsible searching, privacy, and online conduct",
        "Digital citizenship — screen time awareness connected to Newton's Mobile Awareness Programme values",
      ],
      image: "/images/sections/learning-journey/upper-primary/quality-ssc-education.png",
    },
    {
      id: "pe",
      label: "Physical Education",
      heading: "Fitness, discipline, teamwork, and the joy of healthy competition",
      body: "Physical Education is a timetabled, taken-seriously subject at Newton's — not a break from academics. Structured sessions, inter-class competitions, and sports day preparation develop physical fitness, mental resilience, and the team values that strengthen every area of student life.",
      points: [
        "Athletics — running, long jump, shot put, relay races",
        "Team sports — kabaddi, kho-kho, cricket, football, volleyball",
        "Inter-class and inter-school competition participation",
        "Annual Sports Day — preparation, events, and celebration",
        "Yoga and fitness exercises for physical health and mental focus",
        "Sportsmanship, discipline, and team values built through every session",
      ],
      image: "/images/sections/learning-journey/upper-primary/sports-activities.png",
    },
    {
      id: "arts",
      label: "Arts & Culture",
      heading: "Creative expression, cultural pride, and artistic confidence",
      body: "Drawing, painting, craft, music, dance, and drama — explored within Telangana's cultural heritage. Newton's cultural calendar (Diwali, Independence Day, Vana Mahotsavam Rangoli, Cultural Day) gives students a real audience and real purpose for their creative work throughout the year.",
      points: [
        "Drawing and painting — technique, composition, and independent creative projects",
        "Craft — seasonal, cultural, and environmental project work",
        "Music — Telugu folk music, Hindi patriotic songs, school choir",
        "Dance and drama — cultural performances for school events",
        "Rangoli — traditional Indian art form practiced during Vana Mahotsavam and Diwali celebrations",
        "Annual Cultural Day — full-scale performances by Upper Primary students",
      ],
      image: "/images/sections/learning-journey/upper-primary/holistic-development.png",
    },
    {
      id: "value",
      label: "Value Education",
      heading: "Character, integrity, and responsibility — the mark of a Newton's student",
      body: "At this age, students are forming identity and making independent choices. Through structured lessons, school traditions, and Newton's daily classroom culture, Upper Primary students build honesty, discipline, empathy, environmental responsibility, and genuine national pride.",
      points: [
        "Weekly Value Education sessions — stories, discussion, reflection",
        "Honesty and integrity — why character matters more than marks alone",
        "Respect and empathy — for teachers, classmates, and community",
        "Environmental responsibility — deepened through Vana Mahotsavam and Eco Club activities",
        "National values — Independence Day, Republic Day, Constitution awareness, and civic responsibility",
        "Self-discipline and time management — preparing for SSC demands",
      ],
      image: "/images/sections/learning-journey/upper-primary/life-competencies.png",
    },
  ] as LJCurriculumTab[],

  activitiesHeading: "Learning That Goes Beyond the Textbook — Every Term",
  activitiesBody:
    "At Newton's High School, Banswada, we know that the best learning happens when students apply what they know to real situations. Upper Primary students participate in a wide range of practical and experiential activities throughout the academic year.",
  activities: [
    { label: "Science Experiments", image: "/images/sections/learning-journey/upper-primary/academic-excellence.png" },
    { label: "Mathematics Activities", image: "/images/sections/learning-journey/upper-primary/academic-achievement.png" },
    { label: "Project-Based Learning", image: "/images/sections/learning-journey/upper-primary/holistic-development.png" },
    { label: "Quiz Competitions", image: "/images/sections/learning-journey/upper-primary/sports-activities.png" },
    { label: "Cultural Programmes", image: "/images/sections/learning-journey/upper-primary/multilingualism.png" },
    { label: "Educational Activities", image: "/images/sections/learning-journey/upper-primary/quality-ssc-education.png" },
  ] as LJPillarImage[],

  schoolActivitiesHeading: "Real Experiences That Define Newton's Upper Primary Students",
  schoolActivitiesBody:
    "Upper Primary students at Newton's are active participants in a school community built on shared values, real responsibilities, and genuine experiences that shape character as much as academic performance.",
  schoolActivities: [
    {
      icon: "🌿",
      title: "Vana Mahotsavam — Student Environmental Leaders",
      body: "Upper Primary students organise our annual Vana Mahotsavam tree-plantation drive, guide younger students, create Rangoli displays, and take year-round responsibility for saplings on school grounds — hands-on environmental leadership no textbook can replace.",
    },
    {
      icon: "📵",
      title: "Mobile Awareness Programme — Student Performers",
      body: "Upper Primary students write, rehearse, and perform the skits at the heart of Newton's Mobile Awareness Programme — building public speaking confidence and teamwork while reinforcing values around balanced, healthy technology use.",
    },
    {
      icon: "🎓",
      title: "Teachers' Day — Upper Primary Students Lead the School",
      body: "Classes 7 and 8 students dress formally, conduct lessons for younger students, and lead the ceremony honouring teachers with shawls and gratitude — a single day that teaches more about leadership and respect than many weeks of instruction.",
    },
    {
      icon: "🪔",
      title: "Diwali, Independence Day & Cultural Celebrations",
      body: "Upper Primary students lead Newton's Diwali Kesar Tilak celebrations, Independence Day performances, and Republic Day programmes — planning, performing, and delivering events with genuine national pride.",
    },
  ] as { icon: string; title: string; body: string }[],

  typicalDayHeading: "A Typical Day in Upper Primary — Newton's High School, Banswada",
  typicalDayBody:
    "Each school day in Classes 6 to 8 is structured to build the academic skill, discipline, and personal habits students need for Secondary School.",
  typicalDay: [
    {
      time: "7:30 AM",
      title: "School Opens — Punctuality and Preparation",
      body: "Students arrive, greet teachers, and settle in. Punctuality is taken seriously at Newton's as the foundation of the discipline SSC success requires.",
      color: "#FFF5E5",
      accent: "#F39200",
    },
    {
      time: "8:00 AM",
      title: "Morning Assembly — Values, Voice, and Community",
      body: "National pledge, student-led thought for the day, and a values reflection. Students take turns leading assembly, building public confidence and accountability.",
      color: "#EEF2FF",
      accent: "#060C8B",
    },
    {
      time: "8:30 AM",
      title: "Interactive Academic Classes",
      body: "English, Mathematics, Science, and Social Studies through concept-focused lessons. Active classrooms where ideas are discussed and understanding is checked continuously.",
      color: "#F0FDF4",
      accent: "#16a34a",
    },
    {
      time: "10:30 AM",
      title: "Activity and Enrichment Sessions",
      body: "Project work, lab activities, quiz preparation, or computer applications — developing the independent skills needed for Class 9 and 10 SSC studies.",
      color: "#FDF4FF",
      accent: "#9333ea",
    },
    {
      time: "11:30 AM",
      title: "Break — Rest, Food, and Socialisation",
      body: "Supervised break for a snack and outdoor time. Physical activity and genuine rest improve concentration and afternoon learning quality.",
      color: "#FFF5E5",
      accent: "#F39200",
    },
    {
      time: "12:00 PM",
      title: "Sports, Physical Education, and Games",
      body: "Structured PE — athletics, team sports, and fitness — taken seriously as an investment in physical health, mental resilience, and team values.",
      color: "#F0F9FF",
      accent: "#0891b2",
    },
    {
      time: "1:30 PM",
      title: "Reflection, Review, and Wrap-Up",
      body: "Homework guidance, concept review, and preparation for the next day. Students leave with a clear sense of what they achieved and what comes next.",
      color: "#EEF2FF",
      accent: "#060C8B",
    },
  ] as LJDayItem[],

  pillarsHeading: "Six Core Principles That Guide Newton's Upper Primary Programme",
  pillarsBody:
    "At Newton's Upper Primary, we build well-rounded individuals through six core principles that guide every classroom, every lesson, and every interaction at Newton's High School, Banswada.",
  pillarsPoints: [
    "Concept-based learning with SSC examination focus — every topic taught for genuine understanding",
    "Critical thinking and analytical problem-solving built into every lesson, every day",
    "Confident communication in English, Telugu, and Hindi — written, spoken, and presented",
    "Leadership through genuine responsibility — assembly, events, awareness programmes, and roles",
    "Creativity honoured alongside academic achievement — arts, music, drama, and performance",
    "Character built every day — not just taught once a week",
  ],
  pillarCards: [
    {
      iconKey: "star" as IconKey,
      title: "Academic Excellence",
      body: "Strong conceptual understanding and consistent performance across all Telangana SSC subjects",
    },
    {
      iconKey: "lightbulb" as IconKey,
      title: "Critical Thinking",
      body: "Analytical skills, problem-solving, and independent reasoning developed through every lesson",
    },
    {
      iconKey: "mic" as IconKey,
      title: "Communication",
      body: "Confident expression in English, Telugu, and Hindi — written, spoken, and presented",
    },
    {
      iconKey: "trophy" as IconKey,
      title: "Leadership",
      body: "Taking initiative, accepting responsibility, and working collaboratively within the Newton's community",
    },
    {
      iconKey: "palette" as IconKey,
      title: "Creativity",
      body: "Original thinking, artistic expression, and the confidence to explore and create",
    },
    {
      iconKey: "shield" as IconKey,
      title: "Character Building",
      body: "Integrity, discipline, empathy, and personal responsibility — the qualities Newton's is known for in Banswada",
    },
  ] as LJFeature[],

  clubs: [
    {
      iconKey: "flask" as IconKey,
      title: "Science Club",
      body: "Structured experiments, STEM challenges, and science fair preparation that takes members well beyond the classroom syllabus.",
    },
    {
      iconKey: "book" as IconKey,
      title: "Literary Club",
      body: "Reading, writing, debate, and performance — including inter-school debate tournaments and creative writing competitions.",
    },
    {
      iconKey: "palette" as IconKey,
      title: "Cultural Club",
      body: "Classical and folk dance, music, drama, and visual arts in preparation for Diwali, Independence Day, and our annual Cultural Day.",
    },
    {
      iconKey: "trophy" as IconKey,
      title: "Sports Club",
      body: "Dedicated coaching and inter-school competition preparation for cricket, kabaddi, kho-kho, and athletics.",
    },
    {
      iconKey: "leaf" as IconKey,
      title: "Eco Club",
      body: "Practical environmental action — leading the Vana Mahotsavam tree drive, managing the school garden, and promoting sustainable habits.",
    },
  ] as LJFeature[],

  galleryHeading: "Student Life at Newton's — Banswada",
  galleryItems: [
    { label: "Classroom Learning — Classes 6 to 8", image: "/images/sections/learning-journey/upper-primary/academic-excellence.png" },
    { label: "Science Lab Activities", image: "/images/sections/learning-journey/upper-primary/quality-ssc-education.png" },
    { label: "Group Project Discussions", image: "/images/sections/learning-journey/upper-primary/holistic-development.png" },
    { label: "Sports Day Events", image: "/images/sections/learning-journey/upper-primary/sports-activities.png" },
    { label: "Diwali Cultural Programme", image: "/images/sections/learning-journey/upper-primary/multilingualism.png" },
    { label: "Morning Assembly — Upper Primary", image: "/images/sections/learning-journey/upper-primary/students-campus.jpg" },
  ] as LJPillarImage[],

  sscPrepHeading: "How Newton's Upper Primary Prepares Students for Class 9 and 10 SSC",
  sscPrepBody:
    "Every decision in our Upper Primary programme has one goal: every student moving from Class 8 to Class 9 at Newton's is genuinely ready — academically and personally — for Secondary School.",
  sscPrepPoints: [
    "Strong conceptual understanding across all ten subjects — no gaps carried into Secondary School",
    "Study habits, time management, and personal organisation built through consistent expectations",
    "Confident communication in English, Telugu, and Hindi for SSC examination requirements",
    "Critical thinking and analytical skills for higher-order SSC question types",
    "Character and self-discipline that make Secondary School a productive, positive experience",
  ],
  sscPrepImage: "/images/sections/learning-journey/upper-primary/ssc-prep.png",

  parentHeading: "How Newton's Keeps Parents Informed and Involved",
  parentBody:
    "At Newton's, parents and teachers are genuine partners. We keep every family informed — because parents who understand their child's progress can support learning at home in ways that make a real difference.",
  parentCards: [
    {
      title: "Parent-Teacher Meetings",
      body: "Structured PTMs with subject teachers to discuss academic progress, classroom behaviour, and individual support needs.",
    },
    {
      title: "Term-Based Progress Reports",
      body: "End-of-term reports covering all subjects, attendance, co-curricular participation, and teacher observations.",
    },
    {
      title: "Academic Guidance for Parents",
      body: "Study tips, homework guidance, and term-by-term subject information to support learning at home.",
    },
    {
      title: "Transparent Student Support",
      body: "When additional support is needed, Newton's acts promptly and communicates clearly — with marks transparency maintained throughout.",
    },
  ] as { title: string; body: string }[],

  enrollHeading: "Enrol Your Child in Newton's Upper Primary School",
  enrollBody:
    "We welcome enquiries for Classes 6, 7, and 8 throughout the year. Visit our campus on Bodhan Road, Banswada — meet our teachers, see our classrooms, and decide for yourself.",

  relatedCards: [
    {
      label: "Pre-Primary School",
      ages: "Ages 3½ – 5½",
      href: "/learning-journey/pre-primary",
      image: "/images/sections/learning-journey/_stage-cards/pre-primary.png",
    },
    {
      label: "Primary School",
      ages: "Ages 6 – 11",
      href: "/learning-journey/primary",
      image: "/images/sections/learning-journey/_stage-cards/primary.png",
    },
    {
      label: "Secondary School (SSC)",
      ages: "Ages 14 – 16",
      href: "/learning-journey/secondary-ssc",
      image: "/images/sections/learning-journey/_stage-cards/secondary.png",
    },
  ] as LJRelatedCard[],
};

// ── Secondary School (SSC) data ──────────────────────────────────────────────

export const SECONDARY_SCHOOL = {
  agesLabel: "Classes 9 & 10 · Ages 14 to 16",
  heroImage: "/images/sections/learning-journey/secondary-ssc/hero.png",
  heroTagline:
    "Two focused years. Experienced teachers. Individual attention. And the board examination results that open every door.",
  heroDescription:
    "Classes 9 and 10 at Newton's High School, Banswada are the culmination of every student's school journey — the two years that matter most for board examinations, Intermediate stream selection, and the confidence a student carries into the next chapter of their life. We build our Secondary School programme around one honest commitment: to prepare every student for the Telangana SSC Board Examinations as thoroughly as possible. Newton's Secondary students do not arrive at exam season hoping for the best. They arrive prepared.",

  introHeading: "What Makes Newton's SSC Programme Different",
  introBody:
    "The Telangana SSC Board Examination determines Intermediate stream options, scholarship eligibility, and the confidence a student carries forward. At Newton's High School, Banswada, we treat this responsibility with the seriousness it deserves. Our Secondary School programme is built on four pillars that work together every day — not just in the final weeks before the examination.",

  features: [
    {
      iconKey: "trophy" as IconKey,
      title: "Academic Excellence Through Daily Teaching",
      body: "Outstanding SSC results at Newton's are the outcome of outstanding daily teaching — not last-minute revision. Our subject teachers are experienced, deeply knowledgeable, and personally invested in every student's understanding.",
    },
    {
      iconKey: "book" as IconKey,
      title: "Complete Telangana SSC Board Preparation",
      body: "Every subject, every chapter, and every question type in the Telangana SSC curriculum is covered thoroughly and methodically. We do not skip difficult topics or rush complex units — board examinations reward exactly that approach.",
    },
    {
      iconKey: "users" as IconKey,
      title: "Individual Attention for Every Student",
      body: "With a 25:1 student-teacher ratio, every Class 9 and 10 student receives genuine individual attention. Teachers know each student's strengths and weak areas — and no difficulty goes unnoticed or unaddressed.",
    },
    {
      iconKey: "lightbulb" as IconKey,
      title: "Readiness for the Future Beyond SSC",
      body: "Newton's Secondary students are prepared not just for the board examination but for what comes after — Intermediate stream selection, career awareness, and the discipline and clear thinking that further education demands.",
    },
  ] as LJFeature[],

  statsHeading: "SSC Results That Reflect Real Teaching and Real Effort",
  statsBody:
    "At Newton's High School, Banswada, we do not publish numbers we cannot verify. What we can say honestly: every student who studies sincerely at Newton's — attends regularly, participates actively, and uses the support available — is fully prepared for the Telangana SSC Board Examinations.",
  stats: [
    { value: "Classes 9 & 10", label: "Two dedicated years of focused SSC Board preparation" },
    { value: "6 Subjects", label: "Complete Telangana SSC curriculum covered in depth" },
    { value: "25:1", label: "Student-to-teacher ratio — individual attention guaranteed" },
    { value: "6-Step", label: "Structured board examination preparation framework" },
  ] as LJStat[],

  curriculumHeading: "Subjects Taught in Classes 9 and 10 at Newton's",
  curriculumBody:
    "Our Secondary School curriculum follows the complete Telangana State Board SSC framework across six subject areas. Each subject is taught by a specialist teacher with a clear examination focus and genuine depth of subject knowledge.",
  curriculumTabs: [
    {
      id: "mathematics",
      label: "Mathematics",
      heading: "Algebra, geometry, trigonometry — built with understanding, not just memorisation",
      body: "Mathematics in Classes 9 and 10 is taught with one goal: every student understands every concept well enough to apply it to any examination question. Our Mathematics teacher works systematically through the Telangana SSC syllabus, teaching each concept only after the previous one is secure. Weekly practice papers, timed tests, and regular doubt-clearing sessions build both conceptual understanding and the speed and accuracy required for board examination success.",
      points: [
        "Real numbers — rational and irrational, surds, and number theory",
        "Algebra — polynomials, quadratic equations, progressions (AP & GP)",
        "Coordinate geometry — straight lines, distance, and section formulae",
        "Geometry — similar triangles, Pythagoras, circles, and tangents",
        "Trigonometry — ratios, identities, heights, and distances",
        "Mensuration — areas, volumes, and surface areas of 3D solids",
        "Statistics and probability — mean, median, mode, and basic probability",
        "Previous SSC board paper practice from Class 9 onwards",
      ],
      image: "/images/sections/learning-journey/secondary-ssc/academic-achievement.png",
    },
    {
      id: "science",
      label: "Science",
      heading: "Physics, Chemistry, and Biology — taught with depth and practical understanding",
      body: "Science covers Physics, Chemistry, and Biology as integrated disciplines of the Telangana SSC curriculum. Our teaching moves beyond definitions and diagrams — classroom demonstrations, structured practicals, and real-world examples ensure students genuinely understand the concepts behind every topic. Newton's environmental values, visible through our Vana Mahotsavam and Eco Club, give students a real-world connection to Biology and Environmental Science that goes beyond textbook knowledge.",
      points: [
        "Motion, force, gravitation, work, energy, electricity, magnetism, and light (Physics)",
        "Chemical reactions, acids/bases/salts, metals, carbon compounds, and periodic table (Chemistry)",
        "Life processes, control and coordination, reproduction, heredity, and evolution (Biology)",
        "Our environment — ecosystems, food chains, and conservation connected to Newton's values",
        "Lab experiments and structured practical sessions for all SSC practical requirements",
        "Board examination paper practice and model tests across all three science disciplines",
      ],
      image: "/images/sections/learning-journey/secondary-ssc/academic-excellence.png",
    },
    {
      id: "social",
      label: "Social Studies",
      heading: "History, geography, civics, and economics — understood, not just memorised",
      body: "Social Studies covers History, Geography, Economics, and Political Science within the Telangana State Board framework. Our teachers emphasise understanding causation, significance, and connection rather than mere fact recall. Telangana's history, geography, and cultural identity are given particular emphasis — students in Banswada should understand their own state's story deeply and with pride.",
      points: [
        "Ancient and medieval Indian history — civilisations, empires, and Deccan kingdoms",
        "Modern India — independence movement, partition, and nation-building",
        "Telangana history and statehood — taught with regional pride and depth",
        "Indian geography — physical, human, economic, and resource geography",
        "Indian Constitution, democratic governance, and civic responsibility",
        "Economics — development, poverty, and globalisation basics",
        "Map skills, timeline construction, and source-based analysis",
      ],
      image: "/images/sections/learning-journey/secondary-ssc/holistic-development.png",
    },
    {
      id: "english",
      label: "English",
      heading: "Reading, writing, and communication excellence — board-ready and life-ready",
      body: "English in Classes 9 and 10 develops reading, writing, listening, and speaking to the standard required for Telangana SSC Board success and for confident use of English in further education and professional life. Newton's school events, debates, and public speaking opportunities provide the oral confidence that complements the written examination preparation.",
      points: [
        "Reading comprehension — inference, analysis, and extended response",
        "Literature — prescribed Telangana SSC prose, poetry, and drama texts",
        "Formal writing — letters, reports, essays, and notices",
        "Creative writing — stories, descriptions, and narrative pieces",
        "Grammar — tenses, voice, reported speech, and clause structures",
        "Examination technique — question analysis, time management, and answer structure for SSC Board marks",
      ],
      image: "/images/sections/learning-journey/secondary-ssc/multilingualism.png",
    },
    {
      id: "telugu",
      label: "Telugu / Hindi",
      heading: "Mother tongue and national language — both mastered at SSC level",
      body: "Telugu at SSC level is the culmination of ten years of mother-tongue education — complex prescribed texts, rigorous writing practice in board-examination format, and genuine cultural pride in Telangana's literary heritage. Hindi is taught to SSC Board standard with full coverage of the Telangana SSC syllabus: reading fluency, writing accuracy, grammar, and complete examination readiness.",
      points: [
        "Prescribed Telangana SSC Telugu prose, poetry, and drama texts",
        "Telugu composition — essays, letters, summaries, and explanations",
        "Advanced Telugu grammar — alankaras, samasa, sandhi, chandas",
        "Cultural connection — Telangana literary heritage and folk traditions",
        "Prescribed Telangana SSC Hindi prose and poetry texts",
        "Hindi composition, grammar, and board examination practice papers",
      ],
      image: "/images/sections/learning-journey/secondary-ssc/multilingualism.png",
    },
    {
      id: "computer",
      label: "Computer Literacy",
      heading: "Practical digital skills and responsible technology use for the modern world",
      body: "Computer Literacy covers the Telangana SSC curriculum — practical digital skills and theoretical knowledge for board examination and for confident technology use in Intermediate education. At Newton's, this is taught with a consistent emphasis on responsible, balanced use of technology — a value that runs through our school from Pre-Primary onwards through our Mobile Awareness Programme.",
      points: [
        "Computer fundamentals — hardware, software, and operating systems",
        "MS Office applications — Word, Excel, PowerPoint at SSC level",
        "Internet — working principles, browsers, and safe online conduct",
        "Networking — basic concepts, LAN, WAN, and communication protocols",
        "Programming basics — introduction to problem-solving and algorithms",
        "SSC Board practical examination preparation and past paper practice",
      ],
      image: "/images/sections/learning-journey/secondary-ssc/quality-ssc-education.png",
    },
  ] as LJCurriculumTab[],

  examHeading: "How Newton's Prepares Every Student for the Board Examination — A Six-Step Framework",
  examBody:
    "At Newton's High School, Banswada, board examination preparation is not a last-minute sprint — it is a structured, two-year process that begins on the first day of Class 9 and builds systematically through every stage of the curriculum.",
  examFramework: [
    {
      step: "01",
      title: "Concept Teaching — Understanding First",
      body: "Every chapter in every subject is taught for genuine understanding before any examination technique is introduced. Teachers take the time to explain, demonstrate, and verify that every student has grasped each concept before the class moves forward.",
    },
    {
      step: "02",
      title: "Weekly Unit Assessments",
      body: "Short weekly tests give teachers precise, timely information about which concepts are secure and which need reinforcement. Students receive feedback promptly — weak areas are addressed immediately in class and through targeted individual support.",
    },
    {
      step: "03",
      title: "Monthly Full-Subject Examinations",
      body: "Monthly examinations covering the full content studied to date track each student's cumulative progress — structured to replicate board examination conditions so students build exam confidence progressively over two years.",
    },
    {
      step: "04",
      title: "Pre-Final Board Simulation Examinations",
      body: "Full pre-final examinations under strict board-level conditions — sealed question papers, exact timing, supervised answer scripts. This eliminates examination anxiety and reveals any final gaps before the real board.",
    },
    {
      step: "05",
      title: "Structured Revision Programme",
      body: "Dedicated revision periods in Class 10 give students organised, efficient access to every chapter's key concepts, formulae, and definitions. Teachers provide revision notes, chapter summaries, and focused doubt-clearing sessions.",
    },
    {
      step: "06",
      title: "SSC Model Paper and Past Paper Practice",
      body: "Extensive practice using previous Telangana SSC Board question papers is built into Newton's Class 10 preparation. Students learn to manage time effectively, structure answers for maximum marks, and perform consistently under pressure.",
    },
  ] as LJFrameworkStep[],

  typicalDayHeading: "A Day in Secondary School — Newton's High School, Banswada",
  typicalDayBody:
    "Each day in Classes 9 and 10 is carefully structured to balance rigorous academic preparation with practical learning, physical activity, and the personal reflection that builds disciplined, self-aware students.",
  typicalDay: [
    {
      time: "7:30 AM",
      title: "Punctual Start — The Discipline of Readiness",
      body: "Students arrive, settle purposefully, and are ready to learn from the moment the day begins. Teachers are available from 7:30 AM for doubt clarification before main sessions start.",
      color: "#FFF5E5",
      accent: "#F39200",
    },
    {
      time: "8:00 AM",
      title: "Morning Assembly — Character Before Content",
      body: "National pledge, student-led thought for the day, and a values reflection — a daily reminder that academic performance and personal character are equally important at Newton's.",
      color: "#EEF2FF",
      accent: "#060C8B",
    },
    {
      time: "8:30 AM",
      title: "Core Academic Sessions",
      body: "Structured, interactive lessons covering the Telangana SSC curriculum. Every lesson has a clear connection to what students will need to demonstrate in the board examination.",
      color: "#F0FDF4",
      accent: "#16a34a",
    },
    {
      time: "10:30 AM",
      title: "Practical Learning and Application",
      body: "Science lab experiments, mathematics workshops, computer practicals, and project-based activities that reinforce classroom learning through direct, hands-on experience.",
      color: "#FDF4FF",
      accent: "#9333ea",
    },
    {
      time: "11:30 AM",
      title: "Guided Study and Doubt Clearing",
      body: "Structured, teacher-supervised study time to review the morning's learning, work through practice questions, and resolve doubts before they accumulate.",
      color: "#FFF5E5",
      accent: "#F39200",
    },
    {
      time: "12:30 PM",
      title: "Sports, Physical Education, and Fresh Air",
      body: "Timetabled daily physical activity — athletics, team sports, and fitness training. Students who are physically active concentrate more effectively and manage exam pressure more healthily.",
      color: "#F0F9FF",
      accent: "#0891b2",
    },
    {
      time: "1:30 PM",
      title: "Daily Review and Reflection",
      body: "Consolidation of learning, clear homework expectations, and individual progress review. Students leave Newton's each day knowing where they stand and what they will do tomorrow to move forward.",
      color: "#EEF2FF",
      accent: "#060C8B",
    },
  ] as LJDayItem[],

  supportHeading: "No Student Left Behind — Newton's Academic Support System",
  supportBody:
    "Not every student learns at the same pace. At Newton's High School, Banswada, we build a structured support system around every SSC student — so that difficulty is identified early, addressed promptly, and never allowed to undermine a student's board examination preparation.",
  supportItems: [
    {
      iconKey: "users" as IconKey,
      title: "Specialist Subject Teachers",
      body: "Every Class 9 and 10 subject is taught by a teacher with deep knowledge of the Telangana SSC syllabus, examination pattern, and marking scheme — and how to explain difficult concepts to each individual student.",
    },
    {
      iconKey: "book" as IconKey,
      title: "Daily Doubt-Clearing Sessions",
      body: "Doubt-clearing is built into every school day at Newton's — not reserved for the week before examinations. No student should leave Newton's with an unresolved gap in their understanding.",
    },
    {
      iconKey: "star" as IconKey,
      title: "Remedial Support When Needed",
      body: "When assessment results indicate additional support is needed, Newton's acts immediately — targeted catch-up sessions, additional practice materials, and parent communication until performance is back on track.",
    },
    {
      iconKey: "trophy" as IconKey,
      title: "Extension for High-Performing Students",
      body: "High-achieving Class 9 and 10 students receive additional challenge material, concepts extending beyond the SSC syllabus, and support in preparing for scholarship and merit-based opportunities.",
    },
    {
      iconKey: "mic" as IconKey,
      title: "Regular Parent-Teacher Communication",
      body: "Structured PTMs, term progress reports, and our marks transparency system ensure every family has a clear, current picture of their child's academic progress — enabling aligned support at home.",
    },
    {
      iconKey: "shield" as IconKey,
      title: "Continuous Performance Monitoring",
      body: "Every student's performance across weekly tests, monthly examinations, and pre-finals is tracked. Early warning signs are addressed before they affect SSC Board results.",
    },
  ] as LJFeature[],

  scienceHeading: "Science Learning That Goes Beyond the Textbook",
  scienceBody:
    "Physics, Chemistry, and Biology at SSC level require applied understanding — not just recalled definitions. At Newton's, our science teaching is designed from the beginning to develop this applied understanding through structured practicals, STEM activities, and Newton's own environmental heritage.",
  scienceItems: [
    { label: "Science Laboratory Experiments", image: "/images/sections/learning-journey/secondary-ssc/academic-excellence.png" },
    { label: "Mathematics Problem-Solving Workshops", image: "/images/sections/learning-journey/secondary-ssc/academic-achievement.png" },
    { label: "STEM Activities and Projects", image: "/images/sections/learning-journey/secondary-ssc/holistic-development.png" },
    { label: "Science Exhibitions and Fairs", image: "/images/sections/learning-journey/secondary-ssc/quality-ssc-education.png" },
    { label: "Innovation Challenges", image: "/images/sections/learning-journey/secondary-ssc/faculty-mentorship.png" },
    { label: "Environmental Science in Action", image: "/images/sections/learning-journey/secondary-ssc/life-competencies.png" },
  ] as LJPillarImage[],

  schoolActivitiesHeading: "The Experiences That Shape Newton's SSC Students",
  schoolActivitiesBody:
    "Secondary School at Newton's is not only about SSC Board preparation — it is also about the person a student becomes during these two formative years. Newton's school traditions play a genuine role in shaping the character of every student who sits the Telangana SSC Board at Newton's High School, Banswada.",
  schoolActivities: [
    {
      icon: "🌿",
      title: "Vana Mahotsavam — Environmental Leadership at Its Finest",
      body: "Class 9 and 10 students organise Newton's annual Vana Mahotsavam tree-plantation programme, guide younger students through the planting process, create campaign materials, and take responsibility for the school garden year-round — a demonstration of the environmental leadership Newton's has nurtured across their entire school journey.",
    },
    {
      icon: "📵",
      title: "Mobile Awareness Programme — Secondary Students as Educators",
      body: "Newton's Mobile Awareness Programme reaches its most powerful expression when Secondary School students lead it — writing awareness scripts, directing younger students, and educating the entire school community about healthy technology habits. The communication and leadership skills developed here serve our SSC students throughout Intermediate education and beyond.",
    },
    {
      icon: "🎓",
      title: "Teachers' Day — The Highest Honour at Newton's",
      body: "On Teachers' Day, Class 9 and 10 students conduct formal lessons for younger classes, run school management for the day, and lead the ceremony in which teachers are honoured with traditional shawls and sincere gratitude — a moment of visible, meaningful leadership that a Newton's education is designed to build.",
    },
    {
      icon: "🪔",
      title: "Cultural Celebrations — Pride, Performance, and Heritage",
      body: "Newton's cultural calendar — Diwali, Independence Day, Republic Day, and Cultural Day — reaches its most ambitious expression in the performances and productions of Secondary School students, who plan, rehearse, and deliver the school's most significant cultural events of the year with genuine pride in Telangana's heritage and India's national identity.",
    },
  ] as { icon: string; title: string; body: string }[],

  leadershipHeading: "Leadership, Life Skills, and Personal Growth in Classes 9 and 10",
  leadershipBody:
    "Students who complete their SSC education at Newton's leave not just with a strong board result, but with the personal qualities that make that result genuinely useful — the character, discipline, and capability to build on it throughout their lives.",
  leadershipItems: [
    {
      iconKey: "trophy" as IconKey,
      title: "Student Leadership",
      body: "Class 9 and 10 students hold Newton's most senior student roles — leading assembly, organising events, mentoring younger classes, and representing the school. Real responsibilities that develop authentic leadership.",
    },
    {
      iconKey: "mic" as IconKey,
      title: "Communication Excellence",
      body: "Debates, presentations, public speaking at school events, and leading Newton's awareness programmes develop the ability to communicate with clarity and confidence in any situation.",
    },
    {
      iconKey: "users" as IconKey,
      title: "Teamwork and Collaboration",
      body: "Group projects, team sports, cultural productions, and collaborative activities give Secondary students regular, meaningful practice in working with others — essential for higher education and professional life.",
    },
    {
      iconKey: "globe" as IconKey,
      title: "Sound Decision Making",
      body: "Newton's Secondary students are given genuine choices and genuine responsibilities — and held accountable for both. Real-world practice in making decisions and learning from outcomes builds lasting judgment.",
    },
    {
      iconKey: "lightbulb" as IconKey,
      title: "Study Discipline and Time Management",
      body: "The structured daily routine, weekly assessment cycle, and consistent preparation expectations build the study habits and time management skills that make SSC preparation effective — and Intermediate education manageable.",
    },
    {
      iconKey: "shield" as IconKey,
      title: "Integrity and Personal Values",
      body: "Academic integrity, respectful relationships with teachers and peers, and a genuine commitment to doing what is right — these are not aspirations at Newton's. They are expectations.",
    },
  ] as LJFeature[],

  careerHeading: "Guiding Newton's Students Toward a Confident Future",
  careerBody:
    "During Classes 9 and 10, students receive structured guidance about Intermediate education options, career paths, and the long-term choices that will shape their adult lives. We want every Newton's student to leave Class 10 knowing what comes next — and feeling genuinely confident about it.",
  careerItems: [
    {
      iconKey: "lightbulb" as IconKey,
      title: "Intermediate Stream Selection Guidance",
      body: "Structured, honest guidance on choosing between MPC, BiPC, CEC, and other Intermediate streams — based on each student's academic strengths, personal interests, and long-term goals, so the decision is made with clarity rather than confusion.",
    },
    {
      iconKey: "book" as IconKey,
      title: "Career Awareness Sessions",
      body: "Guest sessions and structured discussions introduce Newton's SSC students to medicine, engineering, law, government service, education, agriculture, business, and emerging technology careers relevant to Telangana's developing economy.",
    },
    {
      iconKey: "star" as IconKey,
      title: "Goal-Setting Workshops",
      body: "Structured Class 10 sessions help students articulate academic and career goals clearly, set achievable short-term targets, and build the planning habits that make long-term ambitions reachable.",
    },
    {
      iconKey: "users" as IconKey,
      title: "One-on-One Academic Counselling",
      body: "Individual counselling is available to any Class 9 or 10 student — whether the concern is academic performance, stream selection uncertainty, or personal confidence. Newton's teachers know their students well enough to give genuinely personalised advice.",
    },
  ] as LJFeature[],

  parentHeading: "How Newton's Keeps SSC Families Informed, Involved, and Aligned",
  parentBody:
    "The SSC years are a time of significant pressure for students and families alike. At Newton's, parents who are fully informed and genuinely involved make a real positive difference to their child's SSC performance. We maintain open, transparent, and structured communication with every family throughout Classes 9 and 10.",
  parentItems: [
    {
      iconKey: "users" as IconKey,
      title: "Structured Parent-Teacher Meetings",
      body: "Regular PTMs with subject teachers covering academic progress, examination preparation, and individual concerns. Parents leave with a clear, accurate picture of where their child stands.",
    },
    {
      iconKey: "book" as IconKey,
      title: "Transparent Academic Progress Reports",
      body: "Detailed term reports covering all six SSC subjects — marks, attendance, teacher observations, and specific guidance on areas for improvement.",
    },
    {
      iconKey: "star" as IconKey,
      title: "Marks Transparency System",
      body: "Newton's marks transparency system allows parents to access their child's assessment results securely and promptly after each examination cycle — so no parent is the last to know how their child is progressing.",
    },
    {
      iconKey: "mic" as IconKey,
      title: "Personalised Academic Guidance",
      body: "Specific, honest guidance from subject teachers on supporting SSC preparation at home — study routine advice, subject-specific strategies, and managing examination pressure constructively.",
    },
    {
      iconKey: "shield" as IconKey,
      title: "Direct Communication Channels",
      body: "Parents of Newton's SSC students have direct access to subject teachers and school administration. Questions are answered promptly — because a parent who reaches out deserves a real response.",
    },
    {
      iconKey: "lightbulb" as IconKey,
      title: "Aligned Goals — School and Family Together",
      body: "The best outcomes happen when school and family share the same expectations, encouragement, and commitment. We work actively with every family to ensure that alignment throughout Classes 9 and 10.",
    },
  ] as LJFeature[],

  facilitiesHeading: "Facilities That Support SSC Success at Newton's, Banswada",
  facilities: [
    {
      iconKey: "lightbulb" as IconKey,
      title: "Smart Classrooms",
      body: "Newton's Secondary classrooms are equipped for structured, board-focused teaching — clear instructional spaces, good lighting, and appropriate resources supporting every academic session.",
    },
    {
      iconKey: "flask" as IconKey,
      title: "Science Laboratory",
      body: "A well-equipped science laboratory supporting Physics, Chemistry, and Biology practical work for Classes 9 and 10 — covering the complete Telangana SSC practical curriculum.",
    },
    {
      iconKey: "book" as IconKey,
      title: "Library",
      body: "Newton's school library provides access to Telangana SSC textbooks, reference materials, model papers, and supplementary reading — in a quiet space that supports independent revision.",
    },
    {
      iconKey: "computer" as IconKey,
      title: "Computer Laboratory",
      body: "Newton's computer laboratory supports the Computer Literacy practical curriculum and provides structured access to digital resources that support learning across other subjects.",
    },
    {
      iconKey: "trophy" as IconKey,
      title: "School Grounds and Sports Facilities",
      body: "Newton's school grounds in Banswada provide outdoor space for daily physical education, team sport practice, athletics, and Sports Day events. Physical activity is built into every school day.",
    },
    {
      iconKey: "star" as IconKey,
      title: "Dedicated Study Spaces",
      body: "Quiet, structured study spaces supporting the guided study hour built into every Secondary School day — focused, distraction-free environments for revision, practice paper work, and doubt resolution.",
    },
  ] as LJFeature[],

  beyondHeading: "Prepared for Intermediate and for Everything Beyond",
  beyondBody:
    "The mark of a Newton's education is not just the SSC result a student achieves — it is the person they have become by the time they achieve it. Students who complete their schooling at Newton's High School, Banswada leave with strong academic preparation for Intermediate education, the study habits that sustained hard work requires, the personal values that build trustworthy character, and the genuine confidence that comes from years of being believed in by teachers who cared.",

  enrollHeading: "Enrol Your Child in Newton's Secondary School",
  enrollBody:
    "We welcome admission enquiries for Classes 9 and 10 throughout the academic year, subject to seat availability. Our admissions team will speak with you directly, understand your child's current academic stage, and help you understand what joining Newton's for SSC will look like in practice. Come and visit us — see our classrooms, meet our subject teachers, and speak with families whose children have already been through Newton's SSC programme.",

  relatedCards: [
    {
      label: "Pre-Primary School",
      ages: "Ages 3½ – 5½",
      href: "/learning-journey/pre-primary",
      image: "/images/sections/learning-journey/_stage-cards/pre-primary.png",
    },
    {
      label: "Primary School",
      ages: "Ages 6 – 11",
      href: "/learning-journey/primary",
      image: "/images/sections/learning-journey/_stage-cards/primary.png",
    },
    {
      label: "Upper Primary School",
      ages: "Ages 11 – 14",
      href: "/learning-journey/upper-primary",
      image: "/images/sections/learning-journey/_stage-cards/upper-primary.png",
    },
  ] as LJRelatedCard[],
};
