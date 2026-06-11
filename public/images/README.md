# Image folders — where each picture lives

Every **section of the site owns its images** under `sections/<section>/`. To change a
photo on a page, drop a new file into that section's folder using the **same filename**
the code expects — the page picks it up automatically. You never need to touch code to
swap an image, and changing one section never affects another.

## Rules
- **Lowercase kebab-case only.** No spaces, no `&`, no capitals. ✅ `academic-excellence.png` ❌ `Academic Excellence.png`
- **Use the expected filename** (listed below) so no code change is needed. To use a
  *new* name, update the matching `image:`/`src:` path in that section's page/data file.
- **One photo, one file.** If the same picture appears twice on a page, it's referenced
  twice from a single file — don't duplicate it.

## Structure

```
public/images/
├── sections/                         ← per-section image folders (edit these)
│   ├── learning-journey/
│   │   ├── _stage-cards/             ← age-band cards reused by the homepage,
│   │   │   pre-primary.png             nav mega-menu, and "related journey" links.
│   │   │   primary.png                 Shared on purpose — changing one updates all.
│   │   │   upper-primary.png
│   │   │   secondary.png
│   │   │   senior.png
│   │   ├── pre-primary/              ← one folder per stage page
│   │   │   hero.png                    page hero
│   │   │   <content>.png               curriculum / pillar photos (descriptive names)
│   │   │   students-campus.jpg         closing CTA band
│   │   ├── primary/
│   │   ├── upper-primary/            (also has ssc-prep.png)
│   │   └── secondary-ssc/
│   ├── admissions/                   ← /admissions/tuition-fees images
│   ├── our-school/                   ← /our-school/why-choose-us images
│   ├── school-life/                  ← stubs today (.gitkeep) — add images here later
│   └── whats-on/
│
├── school_logo/  people/  accreditations/   ← shared brand/people assets (used site-wide)
├── Features/  growing-minds/  cta-banner/    ← homepage section pool (home page only)
└── hero/                                     ← reserved
```

## Exact filenames the code expects

Drop your photos in with these names and they appear automatically.

**`sections/learning-journey/_stage-cards/`** (shared age cards)
`pre-primary.png` · `primary.png` · `upper-primary.png` · `secondary.png` · `senior.png`

**`sections/learning-journey/pre-primary/`**
`hero.png` · `academic-achievement.png` · `multilingualism.png` · `holistic-development.png`
· `sports-activities.png` · `life-competencies.png` · `students-campus.jpg`

**`sections/learning-journey/primary/`**
`hero.png` · `academic-achievement.png` · `academic-excellence.png` · `multilingualism.png`
· `holistic-development.png` · `quality-ssc-education.png` · `sports-activities.png`
· `life-competencies.png` · `students-campus.jpg`

**`sections/learning-journey/upper-primary/`**
`hero.png` · `ssc-prep.png` · `academic-achievement.png` · `academic-excellence.png`
· `multilingualism.png` · `holistic-development.png` · `quality-ssc-education.png`
· `sports-activities.png` · `life-competencies.png` · `students-campus.jpg`

**`sections/learning-journey/secondary-ssc/`**
`hero.png` · `academic-achievement.png` · `academic-excellence.png` · `multilingualism.png`
· `holistic-development.png` · `quality-ssc-education.png` · `sports-activities.png`
· `life-competencies.png` · `faculty-mentorship.png`

**`sections/admissions/`**
`students-campus.jpg` · `sports-activities.png` · `quality-ssc-education.png` · `faculty-mentorship.png`

**`sections/our-school/`** (the merged "Why Choose Us" page — all optional, a branded
placeholder shows until you add each one)
- Hero & intro: `hero.jpg` · `commitment.jpg` · `classroom-learning.jpg`
- Beyond-textbooks tiles: `academic-excellence.png` · `science-activities.jpg`
  · `reading-programs.jpg` · `sports-activities.png` · `art-culture.jpg` · `leadership.jpg`
- Campus gallery: `campus-1.jpg` … `campus-4.jpg`
- Facility deep-dives: `smart-classrooms.jpg` · `library.jpg` · `science-lab.jpg`
  · `sports.jpg` · `transport.jpg` · `safety.jpg`
- Photo wall: `gallery-1.jpg` … `gallery-6.jpg`
- Closing CTA: `admission-cta.jpg`

**Shared buckets**
- `school_logo/` → `Newtons_logo.png`, `Name_logo.png`
- `people/` → `Principal.png`, `Student-1.png`, `teacher-1.png`, `teacher-2.jpg`, `parent-1.webp`, `parent-2.jpg`, `person-1.jpg`, `person-2.jpg`, `person-3.jpg`, `person-4.jpg`, `person-5.jpg`
- `Features/` → `Academic Excellence.png`, `Quality SSC Education.png`, `Holistic Student Development.png`, `Experienced Faculty & Mentorship.png`, `Sports & Co-Curricular Activities.png`
- `growing-minds/` → `Academic achievement.png`, `Life competencies.png`, `Multilingualism.png`
- `cta-banner/` → `students.jpg`
- `accreditations/` → `ssc.png`, `cambridge.png`, `neas.png`, `isc.png` (and `sap.png`, `unifrog.png`)
