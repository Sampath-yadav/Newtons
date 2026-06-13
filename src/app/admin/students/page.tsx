"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface StudentRow {
  id: number;
  admissionNumber: string;
  name: string;
  class: string;
  section: string;
  parentPhone: string;
  marksCount: number;
}

interface ExamMarks {
  examId: number;
  examName: string;
  status: string;
  subjectCount: number;
  obtained: number;
  marks: { subject: string; value: string }[];
}

const STATUS_STYLE: Record<string, string> = {
  published:        "bg-emerald-100 text-emerald-700",
  pending_approval: "bg-amber-100 text-amber-700",
  rejected:         "bg-red-100 text-red-700",
  draft:            "bg-slate-100 text-slate-600",
};

/** Embedded column-header filter — click the header to pick a value. */
function ColumnFilter({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = value !== "";

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wide transition-colors ${
          active ? "bg-[#060C8B] text-white" : "text-slate-500 hover:bg-slate-100"
        }`}
      >
        {label}{active ? `: ${value}` : ""}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3" aria-hidden>
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-30 mt-1.5 max-h-64 w-40 overflow-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
          <button
            type="button"
            onClick={() => { onChange(""); setOpen(false); }}
            className={`flex w-full items-center justify-between px-3 py-2 text-left text-[13px] transition-colors ${
              !active ? "font-semibold text-[#060C8B]" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            All {label.toLowerCase()}
          </button>
          {options.map((o) => {
            const sel = o === value;
            return (
              <button
                key={o}
                type="button"
                onClick={() => { onChange(o); setOpen(false); }}
                className={`flex w-full items-center justify-between px-3 py-2 text-left text-[13px] transition-colors ${
                  sel ? "bg-[#060C8B]/10 font-semibold text-[#060C8B]" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>{label === "Class" ? `Class ${o}` : o}</span>
                {sel && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="#060C8B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function AdminStudentsPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();

  const [rows, setRows]       = useState<StudentRow[]>([]);
  const [total, setTotal]     = useState(0);
  const [returned, setReturned] = useState(0);
  const [loading, setLoading] = useState(true);

  const [classes, setClasses]   = useState<string[]>([]);
  const [sections, setSections] = useState<string[]>([]);

  // Filters
  const [cls, setCls]         = useState("");
  const [section, setSection] = useState("");
  const [q, setQ]             = useState("");

  // Expand-to-view-marks
  const [expanded, setExpanded] = useState<number | null>(null);
  const [detail, setDetail] = useState<Record<number, ExamMarks[] | "loading">>({});

  useEffect(() => {
    if (authStatus === "unauthenticated") router.push("/admin");
    if (authStatus === "authenticated" && session?.user?.role !== "admin") router.push("/teacher/upload");
  }, [authStatus, session, router]);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (cls) params.set("class", cls);
    if (section) params.set("section", section);
    if (q) params.set("q", q);
    const res = await fetch(`/api/admin/students?${params.toString()}`);
    const data = await res.json();
    if (res.ok) {
      setRows(data.students);
      setTotal(data.total);
      setReturned(data.returned);
      setClasses(data.filters.classes);
      setSections(data.filters.sections);
    }
    setLoading(false);
  }, [cls, section, q]);

  // Debounce so typing in search doesn't fire a request per keystroke.
  useEffect(() => {
    const t = setTimeout(fetchStudents, q ? 300 : 0);
    return () => clearTimeout(t);
  }, [fetchStudents, q]);

  async function toggleExpand(id: number) {
    if (expanded === id) { setExpanded(null); return; }
    setExpanded(id);
    if (!detail[id]) {
      setDetail((d) => ({ ...d, [id]: "loading" }));
      const res = await fetch(`/api/admin/students/${id}`);
      const data = await res.json();
      setDetail((d) => ({ ...d, [id]: res.ok ? data.exams : [] }));
    }
  }

  const hasFilters = cls !== "" || section !== "" || q !== "";

  function clearAll() {
    setCls(""); setSection(""); setQ("");
  }

  if (authStatus === "loading") {
    return <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] text-slate-400">Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white px-4 py-3.5 sm:px-6 sm:py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/images/school_logo/Newtons_logo.png" alt="Newton's" width={100} height={34} />
            <div className="hidden h-5 w-px bg-slate-200 sm:block" />
            <div className="hidden sm:block">
              <p className="text-[13px] font-bold text-[#060C8B]">Admin Portal</p>
              <p className="text-[10px] uppercase tracking-wider text-slate-400">Student Records</p>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="hidden text-[13px] text-slate-500 sm:inline">{session?.user?.name}</span>
            <button
              onClick={() => signOut({ callbackUrl: "/admin" })}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-[12px] text-slate-500 hover:bg-slate-50 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Sub-nav */}
      <div className="border-b border-slate-200 bg-white px-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl gap-1">
          <Link href="/admin/marks" className="border-b-2 border-transparent px-3 py-3 text-[13px] font-medium text-slate-500 hover:text-slate-800 transition-colors">
            Mark Approvals
          </Link>
          <span className="border-b-2 border-[#060C8B] px-3 py-3 text-[13px] font-semibold text-[#060C8B]">
            Students
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
        <div className="mb-5">
          <h1 className="text-xl font-extrabold text-[#1F2A66] sm:text-2xl">Student Records</h1>
          <p className="mt-0.5 text-[13px] text-slate-400">
            Filter by class &amp; section, search any field, and expand a row to view that student&apos;s marks.
          </p>
        </div>

        {/* Toolbar: search + quick filters */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden>
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name, admission no., phone…"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-800 placeholder-slate-400 focus:border-[#060C8B] focus:outline-none focus:ring-1 focus:ring-[#060C8B]/30 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <ColumnFilter label="Class" value={cls} options={classes} onChange={setCls} />
            <ColumnFilter label="Section" value={section} options={sections} onChange={setSection} />
            {hasFilters && (
              <button
                onClick={clearAll}
                className="rounded-md px-2 py-1 text-[12px] font-semibold text-slate-500 hover:text-red-600 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Result summary */}
        <p className="mb-3 text-[12px] text-slate-400">
          {loading ? "Loading…" : (
            <>
              Showing <span className="font-semibold text-slate-600">{returned}</span>
              {returned < total ? <> of <span className="font-semibold text-slate-600">{total}</span></> : null} student{total !== 1 ? "s" : ""}
              {cls && <> · Class <span className="font-semibold text-[#060C8B]">{cls}</span></>}
              {section && <> · Section <span className="font-semibold text-[#060C8B]">{section}</span></>}
            </>
          )}
        </p>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="w-8 px-3 py-3" />
                <th className="whitespace-nowrap px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-500">Adm. No.</th>
                <th className="whitespace-nowrap px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-500">Student Name</th>
                <th className="whitespace-nowrap px-3 py-2.5 text-left"><ColumnFilter label="Class" value={cls} options={classes} onChange={setCls} /></th>
                <th className="whitespace-nowrap px-3 py-2.5 text-left"><ColumnFilter label="Section" value={section} options={sections} onChange={setSection} /></th>
                <th className="whitespace-nowrap px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-500">Parent Phone</th>
                <th className="whitespace-nowrap px-3 py-3 text-center text-[10px] font-bold uppercase tracking-wide text-slate-500">Marks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!loading && rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 py-16 text-center text-slate-400">
                    No students match these filters.
                  </td>
                </tr>
              ) : (
                rows.map((s) => {
                  const isOpen = expanded === s.id;
                  const d = detail[s.id];
                  return (
                    <FragmentRow key={s.id}>
                      <tr
                        onClick={() => toggleExpand(s.id)}
                        className={`cursor-pointer transition-colors ${isOpen ? "bg-[#060C8B]/[0.03]" : "hover:bg-slate-50"}`}
                      >
                        <td className="px-3 py-3 text-center">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? "rotate-90" : ""}`} aria-hidden>
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 font-mono text-[12px] text-slate-500">{s.admissionNumber}</td>
                        <td className="whitespace-nowrap px-3 py-3 font-semibold text-[#1F2A66]">{s.name}</td>
                        <td className="px-3 py-3">
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[12px] font-semibold text-slate-700">{s.class}</span>
                        </td>
                        <td className="px-3 py-3">
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[12px] font-semibold text-slate-700">{s.section}</span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 font-mono text-[12px] text-slate-500">{s.parentPhone}</td>
                        <td className="px-3 py-3 text-center text-slate-500">{s.marksCount}</td>
                      </tr>

                      {isOpen && (
                        <tr className="bg-[#060C8B]/[0.03]">
                          <td colSpan={7} className="px-4 pb-5 pt-1 sm:px-6">
                            {d === "loading" || d === undefined ? (
                              <p className="py-3 text-[13px] text-slate-400">Loading marks…</p>
                            ) : d.length === 0 ? (
                              <p className="py-3 text-[13px] text-slate-400">No marks recorded for this student yet.</p>
                            ) : (
                              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {d.map((ex) => (
                                  <div key={ex.examId} className="rounded-xl border border-slate-200 bg-white p-3.5">
                                    <div className="mb-2 flex items-center justify-between gap-2">
                                      <span className="text-[13px] font-bold text-[#1F2A66]">{ex.examName}</span>
                                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${STATUS_STYLE[ex.status] ?? STATUS_STYLE.draft}`}>
                                        {ex.status.replace("_", " ")}
                                      </span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                      {ex.marks.map((mk) => (
                                        <span key={mk.subject} className="rounded-md bg-slate-50 px-2 py-1 text-[11px] text-slate-600">
                                          <span className="text-slate-400">{mk.subject}:</span>{" "}
                                          <span className={`font-semibold ${mk.value === "AB" ? "text-amber-600" : "text-slate-800"}`}>{mk.value}</span>
                                        </span>
                                      ))}
                                    </div>
                                    <p className="mt-2 text-[11px] text-slate-400">
                                      {ex.subjectCount} subjects · total obtained <span className="font-semibold text-slate-600">{ex.obtained}</span>
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </FragmentRow>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Small helper so each student maps to a <tr> + optional expansion <tr> without
// an extra wrapper element that would be invalid inside <tbody>.
function FragmentRow({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
