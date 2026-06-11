// Central exam configuration — single source of truth for marks system

export interface SubjectConfig {
  name: string;    // "Telugu" — used as DB key and upload column match
  max: number;     // 20 | 10 | 100 | 50
  header: string;  // "Telugu (20)" — used as Excel column header
}

export interface ExamConfig {
  subjects: SubjectConfig[];
  totalMax: number; // sum of all subject max marks
}

// FA: 5 regular subjects × 20 + Phy Science 10 + Bio Science 10 = 120
const FA_SUBJECTS: SubjectConfig[] = [
  { name: "Telugu",             max: 20, header: "Telugu (20)"             },
  { name: "Hindi",              max: 20, header: "Hindi (20)"              },
  { name: "English",            max: 20, header: "English (20)"            },
  { name: "Mathematics",        max: 20, header: "Mathematics (20)"        },
  { name: "Physical Science",   max: 10, header: "Physical Science (10)"   },
  { name: "Biological Science", max: 10, header: "Biological Science (10)" },
  { name: "Social Studies",     max: 20, header: "Social Studies (20)"     },
];

// SA: 5 regular subjects × 100 + Phy Science 50 + Bio Science 50 = 600
const SA_SUBJECTS: SubjectConfig[] = [
  { name: "Telugu",             max: 100, header: "Telugu (100)"             },
  { name: "Hindi",              max: 100, header: "Hindi (100)"              },
  { name: "English",            max: 100, header: "English (100)"            },
  { name: "Mathematics",        max: 100, header: "Mathematics (100)"        },
  { name: "Physical Science",   max:  50, header: "Physical Science (50)"    },
  { name: "Biological Science", max:  50, header: "Biological Science (50)"  },
  { name: "Social Studies",     max: 100, header: "Social Studies (100)"     },
];

export const EXAM_CONFIGS: Record<string, ExamConfig> = {
  "FA-1": { subjects: FA_SUBJECTS, totalMax: 120 },
  "FA-2": { subjects: FA_SUBJECTS, totalMax: 120 },
  "FA-3": { subjects: FA_SUBJECTS, totalMax: 120 },
  "SA-1": { subjects: SA_SUBJECTS, totalMax: 600 },
  "SA-2": { subjects: SA_SUBJECTS, totalMax: 600 },
};

export const EXAM_NAMES = Object.keys(EXAM_CONFIGS); // ["FA-1","FA-2","FA-3","SA-1","SA-2"]

export function getExamConfig(examName: string): ExamConfig {
  const cfg = EXAM_CONFIGS[examName];
  if (!cfg) throw new Error(`Unknown exam type: "${examName}"`);
  return cfg;
}

// Grade scale: Newton's SSC grading
export function getGrade(percentage: number): string {
  if (percentage >= 91) return "A1";
  if (percentage >= 81) return "A2";
  if (percentage >= 71) return "B1";
  if (percentage >= 61) return "B2";
  if (percentage >= 51) return "C1";
  if (percentage >= 41) return "C2";
  if (percentage >= 35) return "D";
  return "F";
}

// Compute totals + grade for one student, excluding absent subjects from denominator
export function computeStudentResult(marks: Record<string, string>, config: ExamConfig) {
  let total = 0;
  let maxPresent = 0;
  let absentCount = 0;

  for (const sub of config.subjects) {
    const raw = (marks[sub.name] ?? "").trim().toUpperCase();
    if (raw === "AB" || raw === "") {
      absentCount++;
    } else {
      total += Number(raw);
      maxPresent += sub.max;
    }
  }

  const pct = maxPresent > 0 ? (total / maxPresent) * 100 : 0;

  return {
    total,
    maxPresent,    // denominator (excludes absent subjects)
    fullMax: config.totalMax,
    percentage: maxPresent > 0 ? pct.toFixed(1) : "—",
    grade: maxPresent > 0 ? getGrade(pct) : "—",
    absentCount,
  };
}
