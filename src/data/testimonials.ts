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
      "At Newton's High School, we believe in celebrating the unique individuality of each child and fostering the growth of their innate talents.",
    authorName: "Surjeet Singh",
    authorRole: "Principal",
    chipRole: "Principal",
    linkLabel: "Meet our team",
    href: "/about#team",
  },
  {
    id: "student",
    imageSrc: "/images/people/Student-1.png",
    quote:
      "Newton's High School gave me the confidence to speak on stage, lead a team, and think for myself. I feel genuinely prepared for whatever comes next.",
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
      "The communication between teachers and parents is exceptional. We always feel like partners in our child's learning journey.",
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
      "Teaching at Newton's High School means having the freedom and support to innovate. Every day, I see students grow beyond what they thought possible.",
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
      "Shifting from overseas, we were anxious about the transition. The Newton's High School team made our daughter feel at home from day one.",
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
      "What sets Newton's High School apart is how deeply the school cares about holistic development — not just marks, but character, creativity, and confidence.",
    authorName: "Ananya Reddy",
    authorRole: "Head of Arts & Humanities",
    chipRole: "Teacher",
    linkLabel: "Academics",
    href: "/academics",
  },
];