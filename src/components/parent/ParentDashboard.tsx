"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Container } from "~/components/layout/Container";
import { TrendChart } from "./TrendChart";

interface SubjectMark { subject: string; value: string; max: number; }
interface ExamResult {
  examId: number;
  name: string;
  total: number;
  maxPresent: number;
  fullMax: number;
  percentage: string;
  grade: string;
  absentCount: number;
  rank: number | null;
  classSize: number;
  subjects: SubjectMark[];
}
interface DashboardData {
  student: { name: string; admissionNumber: string; class: string; section: string; academicYear: string };
  overall: { examsCount: number; averagePercentage: number | null; latestPercentage: number | null; latestExam: string | null };
  exams: ExamResult[];
  trend: { name: string; percentage: number }[];
}

function gradeColor(grade: string): string {
  if (["A1", "A2"].includes(grade)) return "text-emerald-600 bg-emerald-50 border-emerald-100";
  if (["B1", "B2"].includes(grade)) return "text-blue-600 bg-blue-50 border-blue-100";
  if (["C1", "C2"].includes(grade)) return "text-[#F39200] bg-[#FFF5E5] border-[#F39200]/20";
  if (grade === "D") return "text-slate-600 bg-slate-50 border-slate-200";
  return "text-red-600 bg-red-50 border-red-100";
}

function statusFromAvg(avg: number | null): { label: string; color: string } {
  if (avg === null) return { label: "No results yet", color: "text-slate-500" };
  if (avg >= 81) return { label: "Excellent", color: "text-emerald-600" };
  if (avg >= 61) return { label: "Good", color: "text-blue-600" };
  if (avg >= 41) return { label: "Needs Focus", color: "text-[#F39200]" };
  return { label: "Needs Support", color: "text-red-600" };
}

function initials(name: string): string {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
}

export function ParentDashboard() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openExam, setOpenExam] = useState<number | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/parent/dashboard");
      if (res.status === 401) { router.push("/parent-portal/login"); return; }
      const json = await res.json();
      if (!res.ok) { setError(json.error ?? "Could not load dashboard."); return; }
      setData(json as DashboardData);
      // Expand the most recent exam by default.
      const list = (json as DashboardData).exams;
      if (list.length) setOpenExam(list[list.length - 1].examId);
    } catch {
      setError("Network error. Please retry.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { load(); }, [load]);

  async function logout() {
    await fetch("/api/parent/logout", { method: "POST" });
    router.push("/parent-portal/login");
  }

  if (loading) return <DashboardSkeleton />;

  if (error) {
    return (
      <Container>
        <div className="mx-auto my-16 max-w-md rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-center text-[14px] text-red-600">
          {error}
        </div>
      </Container>
    );
  }
  if (!data) return null;

  const status = statusFromAvg(data.overall.averagePercentage);

  return (
    <div className="bg-[#f8fafc] py-8 lg:py-10">
      <Container>
        {/* Top bar */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Image src="/images/school_logo/Newtons_logo.png" alt="Newton's" width={80} height={28} />
            <span className="hidden text-[12px] text-slate-400 sm:inline">Parent Portal</span>
          </div>
          <button
            onClick={logout}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-500 hover:bg-slate-50 transition-colors"
          >
            Sign out
          </button>
        </div>

        {/* Profile header */}
        <div className="mb-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-[#060C8B] to-[#1F2A66] px-6 py-7 sm:px-8">
            <div className="flex flex-wrap items-center gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-2xl font-extrabold text-white ring-1 ring-white/25">
                {initials(data.student.name)}
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-extrabold text-white">{data.student.name}</h1>
                <p className="mt-0.5 text-[13px] text-white/70">
                  Class {data.student.class}-{data.student.section} · Adm. {data.student.admissionNumber} · {data.student.academicYear}
                </p>
              </div>
              <div className="text-right">
                <span className="rounded-full bg-white/15 px-3 py-1 text-[13px] font-bold text-white">{status.label}</span>
              </div>
            </div>
          </div>

          {/* Stat strip */}
          <div className="grid grid-cols-3 divide-x divide-slate-100">
            <Stat label="Exams Published" value={String(data.overall.examsCount)} />
            <Stat label="Average Score" value={data.overall.averagePercentage !== null ? `${data.overall.averagePercentage}%` : "—"} />
            <Stat label="Latest" value={data.overall.latestPercentage !== null ? `${data.overall.latestPercentage}%` : "—"} sub={data.overall.latestExam ?? undefined} />
          </div>
        </div>

        {data.exams.length === 0 ? (
          <EmptyState
            title="No results published yet"
            body="When the school publishes your child's exam results, they will appear here automatically."
          />
        ) : (
          <>
            {/* Subject-wise marks table — most recent exam */}
            <SubjectMarksTable exam={data.exams[data.exams.length - 1]} />

            {/* Trend */}
            {data.trend.length >= 1 && (
              <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="text-[15px] font-extrabold text-[#1F2A66]">Performance Trend</h2>
                  <span className="text-[11px] text-slate-400">Percentage across exams</span>
                </div>
                <TrendChart data={data.trend} />
              </div>
            )}

            {/* Results */}
            <h2 className="mb-3 text-[15px] font-extrabold text-[#1F2A66]">Exam Results</h2>
            <div className="space-y-3">
              {[...data.exams].reverse().map((exam) => {
                const open = openExam === exam.examId;
                return (
                  <div key={exam.examId} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <button
                      onClick={() => setOpenExam(open ? null : exam.examId)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border text-[15px] font-extrabold ${gradeColor(exam.grade)}`}>
                          {exam.grade}
                        </span>
                        <div>
                          <p className="text-[15px] font-bold text-[#1F2A66]">{exam.name}</p>
                          <p className="mt-0.5 text-[12px] text-slate-500">
                            {exam.total}/{exam.maxPresent} · {exam.percentage !== "—" ? `${exam.percentage}%` : "Absent"}
                            {exam.rank ? ` · Rank ${exam.rank} of ${exam.classSize}` : ""}
                          </p>
                        </div>
                      </div>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden><polyline points="6 9 12 15 18 9" /></svg>
                    </button>

                    {open && (
                      <div className="border-t border-slate-100 px-5 py-4">
                        <div className="space-y-2.5">
                          {exam.subjects.map((s) => {
                            const absent = s.value === "AB";
                            const num = absent ? 0 : Number(s.value);
                            const pct = s.max ? Math.min((num / s.max) * 100, 100) : 0;
                            const pass = num >= s.max * 0.35;
                            return (
                              <div key={s.subject} className="flex items-center gap-3">
                                <span className="w-32 shrink-0 text-[13px] font-medium text-[#1F2A66]">{s.subject}</span>
                                <div className="h-2 flex-1 rounded-full bg-slate-100">
                                  <div className={`h-full rounded-full ${absent ? "bg-amber-300" : pass ? "bg-[#060C8B]" : "bg-red-400"}`} style={{ width: `${absent ? 0 : pct}%` }} />
                                </div>
                                <span className={`w-16 shrink-0 text-right text-[13px] font-bold ${absent ? "text-amber-600" : pass ? "text-[#1F2A66]" : "text-red-600"}`}>
                                  {absent ? "AB" : `${s.value}/${s.max}`}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        {exam.absentCount > 0 && (
                          <p className="mt-3 text-[11px] text-amber-600">
                            {exam.absentCount} subject(s) marked Absent — excluded from the percentage.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Coming soon — engagement roadmap */}
        <h2 className="mb-3 mt-8 text-[15px] font-extrabold text-[#1F2A66]">More, coming soon</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <ComingSoon title="Attendance" body="Daily attendance and monthly summaries." icon="calendar" />
          <ComingSoon title="School Activities" body="Events, clubs and announcements." icon="star" />
          <ComingSoon title="Final Report Card" body="Consolidated annual report and promotion status." icon="doc" />
        </div>
      </Container>
    </div>
  );
}

function SubjectMarksTable({ exam }: { exam: ExamResult }) {
  const presentSubjects = exam.subjects.filter((s) => s.value !== "AB");
  const totalObtained = presentSubjects.reduce((sum, s) => sum + Number(s.value), 0);
  const totalMax = presentSubjects.reduce((sum, s) => sum + s.max, 0);
  const overallPct = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(1) : "—";

  return (
    <div className="mb-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
        <div>
          <h2 className="text-[15px] font-extrabold text-[#1F2A66]">Academic Results</h2>
          <p className="mt-0.5 text-[12px] text-slate-400">{exam.name}</p>
        </div>
        <span className={`rounded-lg border px-2.5 py-1 text-[13px] font-extrabold ${gradeColor(exam.grade)}`}>
          {exam.grade}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="px-5 py-2.5 font-semibold text-slate-500 sm:px-6">Subject</th>
              <th className="px-3 py-2.5 text-center font-semibold text-slate-500">Obtained</th>
              <th className="px-3 py-2.5 text-center font-semibold text-slate-500">Max</th>
              <th className="px-3 py-2.5 text-center font-semibold text-slate-500">%</th>
              <th className="px-3 py-2.5 text-center font-semibold text-slate-500 sm:pr-6">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {exam.subjects.map((s) => {
              const absent = s.value === "AB";
              const num = absent ? 0 : Number(s.value);
              const pct = s.max > 0 && !absent ? ((num / s.max) * 100).toFixed(1) : null;
              const pass = !absent && num >= s.max * 0.35;
              return (
                <tr key={s.subject} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3 font-medium text-[#1F2A66] sm:px-6">{s.subject}</td>
                  <td className="px-3 py-3 text-center font-bold text-[#1F2A66]">
                    {absent ? <span className="text-amber-500">AB</span> : s.value}
                  </td>
                  <td className="px-3 py-3 text-center text-slate-500">{s.max}</td>
                  <td className="px-3 py-3 text-center text-slate-600">
                    {pct !== null ? `${pct}%` : "—"}
                  </td>
                  <td className="px-3 py-3 text-center sm:pr-6">
                    {absent ? (
                      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-600">Absent</span>
                    ) : pass ? (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-600">Pass</span>
                    ) : (
                      <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-bold text-red-600">Fail</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-200 bg-slate-50/80">
              <td className="px-5 py-3 font-extrabold text-[#1F2A66] sm:px-6">Total</td>
              <td className="px-3 py-3 text-center font-extrabold text-[#1F2A66]">{totalObtained}</td>
              <td className="px-3 py-3 text-center font-extrabold text-slate-600">{totalMax}</td>
              <td className="px-3 py-3 text-center font-extrabold text-[#1F2A66]">{overallPct !== "—" ? `${overallPct}%` : "—"}</td>
              <td className="px-3 py-3 text-center sm:pr-6">
                <span className={`rounded-lg border px-2 py-0.5 text-[11px] font-extrabold ${gradeColor(exam.grade)}`}>
                  {exam.grade}
                </span>
                {exam.rank && (
                  <span className="ml-1.5 text-[11px] text-slate-400">Rank {exam.rank}/{exam.classSize}</span>
                )}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="px-4 py-4 text-center">
      <p className="text-xl font-extrabold text-[#1F2A66]">{value}</p>
      <p className="mt-0.5 text-[11px] font-medium text-slate-500">{label}</p>
      {sub && <p className="text-[10px] text-slate-400">{sub}</p>}
    </div>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-16 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
        <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
      </div>
      <p className="text-[15px] font-bold text-[#1F2A66]">{title}</p>
      <p className="mx-auto mt-1 max-w-xs text-[13px] text-slate-500">{body}</p>
    </div>
  );
}

function ComingSoon({ title, body, icon }: { title: string; body: string; icon: "calendar" | "star" | "doc" }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 opacity-80">
      <div className="mb-2 flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EEF0FB] text-brand-navy">
          {icon === "calendar" && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>}
          {icon === "star" && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>}
          {icon === "doc" && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>}
        </span>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">Soon</span>
      </div>
      <p className="text-[14px] font-bold text-[#1F2A66]">{title}</p>
      <p className="mt-0.5 text-[12px] text-slate-500">{body}</p>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="bg-[#f8fafc] py-8 lg:py-10">
      <Container>
        <div className="mb-6 h-8 w-32 animate-pulse rounded bg-slate-200" />
        <div className="mb-6 h-40 animate-pulse rounded-3xl bg-slate-200" />
        <div className="mb-6 h-56 animate-pulse rounded-3xl bg-slate-100" />
        <div className="space-y-3">
          {[0, 1, 2].map((i) => <div key={i} className="h-20 animate-pulse rounded-2xl bg-slate-100" />)}
        </div>
      </Container>
    </div>
  );
}
