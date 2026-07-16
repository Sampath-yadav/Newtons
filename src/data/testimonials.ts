// src/data/testimonials.ts
// ─────────────────────────────────────────────────────────────────────────────
// TESTIMONIALS data array.
// Replace image paths with your real assets once available.
// chipRole  → short label shown in the avatar chip (e.g. "Principal")
// authorRole → longer label shown in the quote card (e.g. "Principal")
// linkLabel  → CTA text in the card
// href       → CTA destination
// ─────────────────────────────────────────────────────────────────────────────

export interface Testimonial {
  id: string;
  imageSrc: string;
  quote: string;
  authorName: string;
  authorRole: string;
  chipRole: string;
  linkLabel: string;
  href: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "principal",
    imageSrc: "/images/people/Principal.png",
    quote:
      "At Newton's High School, we do not measure success only in marks. We measure it in the confidence a child walks out with, the values they carry forward, and the readiness they have built for the challenges of life. Every student here matters to us — not as a number, but as an individual with a unique future ahead of them.",
    authorName: "Surjeet Singh",
    authorRole: "Principal, Newton's High School",
    chipRole: "Principal",
    linkLabel: "Meet Our Team",
    href: "/about#team",
  },
  {
    id: "student",
    imageSrc: "/images/people/Student-1.png",
    quote:
      "My teachers at Newton's never gave up on me. Even when I found Maths difficult, they stayed back after class and explained every problem patiently. I scored much better in my exams than I expected, and I feel genuinely ready for my future.",
    authorName: "Aarav Mehta",
    authorRole: "Grade 11 Student",
    chipRole: "Student",
    linkLabel: "Student life",
    href: "/school-life",
  },
  {
    id: "parent-1",
    imageSrc: "/images/people/parent-1.webp",
    quote:
      "We chose Newton's because of its reputation in Banswada for discipline and results. Three years later, we have no doubt that it was the right decision. Our daughter has grown academically and personally beyond what we imagined.",
    authorName: "Ramesh Nair",
    authorRole: "Parent — Grade 6",
    chipRole: "Parent",
    linkLabel: "Admissions",
    href: "/admissions",
  },
  {
    id: "teacher",
    imageSrc: "/images/people/teacher-1.png",
    quote:
      "Teaching at Newton's is deeply rewarding. The school gives us the freedom and the support to teach meaningfully — not just to cover the syllabus, but to genuinely connect with students and help each one understand and enjoy the subject.",
    authorName: "Priya Krishnan",
    authorRole: "Cambridge Science Faculty",
    chipRole: "Teacher",
    linkLabel: "Our faculty",
    href: "/about#faculty",
  },
  {
    id: "parent-2",
    imageSrc: "/images/people/parent-2.jpg",
    quote:
      "What I appreciate most is that the school communicates with us regularly. I always know how my son is doing — his attendance, his marks, his behaviour. That level of transparency and involvement is rare and it means everything to a parent.",
    authorName: "Sunita Verma",
    authorRole: "Parent — Grade 3, International Admission",
    chipRole: "Parent",
    linkLabel: "International admissions",
    href: "/admissions#international",
  },
  {
    id: "teacher-2",
    imageSrc: "/images/people/teacher-2.jpg",
    quote:
      "Newton's High School has a culture that values both students and teachers. Professional development is encouraged, student welfare is taken seriously, and every day I feel that the work I do here truly makes a difference.",
    authorName: "Ananya Reddy",
    authorRole: "Head of Arts & Humanities",
    chipRole: "Teacher",
    linkLabel: "Academics",
    href: "/academics",
  },
];