import { Container } from "~/components/layout/Container";

// Kept deliberately light for parents on slow (2G) connections: a pure Server
// Component that streams plain HTML — no client JS, no web fonts, no images.
// Marks are visible the instant the HTML arrives.

interface Mark {
  subject: string;
  value: string;
  max: number;
}

interface ResultData {
  student: {
    name: string;
    admissionNumber: string;
    class: string;
    section: string;
  };
  exam: {
    name: string;
    publishedAt: string;
  };
  marks: Mark[];
  summary: {
    total: number;
    maxMarks: number;
    fullMax: number;
    percentage: string;
    grade: string;
    absentCount: number;
  };
}

async function getResult(token: string): Promise<ResultData | null> {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const res = await fetch(`${base}/api/results/${token}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// Colour for each SSC grade band returned by the API.
function gradeColor(grade: string): string {
  if (["A1", "A2"].includes(grade)) return "text-green-600";
  if (["B1", "B2"].includes(grade)) return "text-blue-600";
  if (["C1", "C2"].includes(grade)) return "text-[#F39200]";
  if (grade === "D") return "text-slate-600";
  return "text-red-600"; // F
}

export default async function ResultPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const data = await getResult(token);

  if (!data) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8" aria-hidden>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h1 className="text-2xl font-extrabold text-[#1F2A66]">Result Not Found</h1>
        <p className="mt-2 text-[15px] text-[#6B7280]">
          This link is invalid or results are not yet published.
        </p>
        <a href="/" className="mt-6 text-[14px] text-[#060C8B] hover:underline">
          Return to Newton&apos;s High School →
        </a>
      </div>
    );
  }

  const grade = data.summary.grade;
  const color = gradeColor(grade);

  return (
    <>
      {/* ── Mini header (no full navbar needed for this result page) ── */}
      <header className="border-b border-slate-100 bg-white py-4">
        <Container>
          {/* Text wordmark instead of a logo image — avoids a heavy PNG download on 2G. */}
          <span className="text-lg font-extrabold tracking-tight text-[#060C8B]">
            NEWTON&apos;S <span className="text-[#F39200]">HIGH SCHOOL</span>
          </span>
        </Container>
      </header>

      {/* ── Hero band ── */}
      <div className="bg-[#060C8B] py-10">
        <Container>
          <div className="max-w-2xl">
            <span className="mb-2 inline-block rounded-full bg-[#F39200]/20 px-3 py-0.5 text-[11px] font-bold uppercase tracking-widest text-[#F39200]">
              Official Result
            </span>
            <h1 className="text-3xl font-extrabold text-white leading-tight">
              {data.exam.name} Results
            </h1>
            <p className="mt-1 text-[15px] text-white/70">
              Newton&apos;s High School · Class {data.student.class}{data.student.section}
            </p>
          </div>
        </Container>
      </div>

      <div className="py-10 bg-[#f8fafc]">
        <Container>
          <div className="mx-auto max-w-2xl space-y-6">

            {/* Student info card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-[#1F2A66]">{data.student.name}</h2>
                  <p className="mt-0.5 text-[13px] text-[#6B7280]">
                    Admission No. {data.student.admissionNumber} · Class {data.student.class} — Section {data.student.section}
                  </p>
                </div>
                {/* Grade circle */}
                <div className="shrink-0 text-center">
                  <div className={`text-4xl font-extrabold ${color}`}>{grade}</div>
                  <div className="text-[11px] text-slate-400">Grade</div>
                </div>
              </div>

              {/* Summary stats */}
              <div className="mt-5 grid grid-cols-3 gap-4 border-t border-slate-100 pt-5">
                <div className="text-center">
                  <div className="text-2xl font-extrabold text-[#F39200]">{data.summary.total}</div>
                  <div className="text-[11px] text-slate-400">Total Marks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-extrabold text-[#1F2A66]">{data.summary.maxMarks}</div>
                  <div className="text-[11px] text-slate-400">Max Marks</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-extrabold ${color}`}>{data.summary.percentage}%</div>
                  <div className="text-[11px] text-slate-400">Percentage</div>
                </div>
              </div>

              {data.summary.absentCount > 0 && (
                <p className="mt-3 text-[12px] text-amber-600">
                  * {data.summary.absentCount} subject(s) marked AB (Absent). These are not counted in the percentage.
                </p>
              )}
            </div>

            {/* Subject marks */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
                <h3 className="text-[14px] font-bold text-[#1F2A66]">Subject-wise Marks</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {data.marks.map((mark) => {
                  const isAbsent = mark.value === "AB";
                  const markNum = isAbsent ? 0 : Number(mark.value);
                  const subPct = isAbsent || mark.max === 0 ? 0 : (markNum / mark.max) * 100;
                  const passMark = mark.max * 0.35; // 35% pass threshold per subject

                  return (
                    <div key={mark.subject} className="flex items-center justify-between px-6 py-4">
                      <div>
                        <p className="text-[14px] font-semibold text-[#1F2A66]">{mark.subject}</p>
                        <p className="text-[11px] text-slate-400">out of {mark.max}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        {/* Bar */}
                        <div className="hidden sm:block w-24 h-1.5 rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-[#060C8B]"
                            style={{ width: `${Math.min(subPct, 100)}%` }}
                          />
                        </div>
                        {isAbsent ? (
                          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[12px] font-bold text-amber-700">
                            Absent
                          </span>
                        ) : (
                          <span className={`text-[16px] font-extrabold ${markNum >= passMark ? "text-[#1F2A66]" : "text-red-600"}`}>
                            {mark.value}
                            <span className="text-[12px] font-medium text-slate-400">/{mark.max}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer note */}
            <p className="text-center text-[12px] text-slate-400">
              Result published by Newton&apos;s High School.
              {data.exam.publishedAt && (
                <> Published on {new Date(data.exam.publishedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}.</>
              )}
              <br />
              For queries, contact the school office.
            </p>
          </div>
        </Container>
      </div>
    </>
  );
}
