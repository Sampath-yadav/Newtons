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
  rollNumber: string | null;
  status: "ACTIVE" | "INACTIVE";
  marksCount: number;
}

interface SchoolStats { total: number; active: number; inactive: number; }

interface ExamMarks {
  examId: number;
  examName: string;
  status: string;
  subjectCount: number;
  obtained: number;
  marks: { subject: string; value: string }[];
}

interface FormState {
  admissionNumber: string;
  name: string;
  class: string;
  section: string;
  parentPhone: string;
  rollNumber: string;
}

const EMPTY_FORM: FormState = {
  admissionNumber: "",
  name: "",
  class: "",
  section: "",
  parentPhone: "",
  rollNumber: "",
};

const CLASSES = ["8", "9", "10"];
const SECTIONS = ["A", "B", "C"];

const STATUS_STYLE: Record<string, string> = {
  published:        "bg-emerald-100 text-emerald-700",
  pending_approval: "bg-amber-100 text-amber-700",
  rejected:         "bg-red-100 text-red-700",
  draft:            "bg-slate-100 text-slate-600",
};

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-[#060C8B] focus:outline-none focus:ring-1 focus:ring-[#060C8B]/30 transition-colors";

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
  const [fetchError, setFetchError] = useState("");
  const [stats, setStats]     = useState<SchoolStats | null>(null);

  const [classes, setClasses]   = useState<string[]>([]);
  const [sections, setSections] = useState<string[]>([]);

  // Filters
  const [cls, setCls]         = useState("");
  const [section, setSection] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "ACTIVE" | "INACTIVE">("");
  const [q, setQ]             = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Expand-to-view-marks
  const [expanded, setExpanded] = useState<number | null>(null);
  const [detail, setDetail] = useState<Record<number, ExamMarks[] | "loading">>({});

  // Add / edit modal
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<StudentRow | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);

  useEffect(() => {
    if (authStatus === "unauthenticated") router.push("/admin");
    if (authStatus === "authenticated" && session?.user?.role !== "ADMIN") router.push("/teacher/upload");
  }, [authStatus, session, router]);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setFetchError("");
    const params = new URLSearchParams();
    if (cls) params.set("class", cls);
    if (section) params.set("section", section);
    if (statusFilter) params.set("status", statusFilter);
    if (q) params.set("q", q);
    params.set("page", String(page));
    try {
      const res = await fetch(`/api/admin/students?${params.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setRows(data.students);
        setTotal(data.total);
        setReturned(data.returned);
        setTotalPages(data.totalPages);
        setClasses(data.filters.classes);
        setSections(data.filters.sections);
        if (data.stats) setStats(data.stats);
      } else {
        setFetchError(data.error ?? "Failed to load students.");
      }
    } catch {
      setFetchError("Network error. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [cls, section, statusFilter, q, page]);

  // Any filter change resets to the first page.
  useEffect(() => { setPage(1); }, [cls, section, statusFilter, q]);

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

  function openAdd() {
    setForm(EMPTY_FORM);
    setEditing(null);
    setFormError("");
    setModal("add");
  }

  function openEdit(s: StudentRow) {
    setForm({
      admissionNumber: s.admissionNumber,
      name: s.name,
      class: s.class,
      section: s.section,
      parentPhone: s.parentPhone,
      rollNumber: s.rollNumber ?? "",
    });
    setEditing(s);
    setFormError("");
    setModal("edit");
  }

  function closeModal() {
    setModal(null);
    setEditing(null);
    setFormError("");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError("");

    const isEdit = modal === "edit" && editing;
    const url = isEdit ? `/api/admin/students/${editing.id}` : "/api/admin/students";
    const method = isEdit ? "PATCH" : "POST";
    const payload = isEdit
      ? { name: form.name, class: form.class, section: form.section, parentPhone: form.parentPhone, rollNumber: form.rollNumber }
      : form;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      closeModal();
      if (isEdit && data.student) {
        // Patch the single row in place — no round-trip refetch needed.
        const updated: StudentRow = {
          ...editing,
          ...data.student,
          class: String(data.student.class),
          marksCount: editing.marksCount,
        };
        setRows((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      } else {
        // New student: refetch so it appears in the right sorted position.
        await fetchStudents();
      }
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(s: StudentRow) {
    const next = s.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    // Optimistic: flip the row immediately so the UI feels instant.
    setRows((prev) => prev.map((r) => r.id === s.id ? { ...r, status: next } : r));
    setStats((st) => st
      ? { ...st, active: next === "ACTIVE" ? st.active + 1 : st.active - 1, inactive: next === "INACTIVE" ? st.inactive + 1 : st.inactive - 1 }
      : st
    );
    setBusyId(s.id);
    try {
      const res = await fetch(`/api/admin/students/${s.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) {
        // Revert on failure.
        setRows((prev) => prev.map((r) => r.id === s.id ? { ...r, status: s.status } : r));
        setStats((st) => st
          ? { ...st, active: s.status === "ACTIVE" ? st.active + 1 : st.active - 1, inactive: s.status === "INACTIVE" ? st.inactive + 1 : st.inactive - 1 }
          : st
        );
      }
    } catch {
      // Revert on network error.
      setRows((prev) => prev.map((r) => r.id === s.id ? { ...r, status: s.status } : r));
    } finally {
      setBusyId(null);
    }
  }

  const hasFilters = cls !== "" || section !== "" || statusFilter !== "" || q !== "";
  function clearAll() { setCls(""); setSection(""); setStatusFilter(""); setQ(""); }

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
          <Link href="/admin/teachers" className="border-b-2 border-transparent px-3 py-3 text-[13px] font-medium text-slate-500 hover:text-slate-800 transition-colors">
            Teachers
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
        {/* Stats bar */}
        {stats && (
          <div className="mb-5 grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center">
              <p className="text-2xl font-extrabold text-[#1F2A66]">{stats.total}</p>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Students</p>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center">
              <p className="text-2xl font-extrabold text-emerald-600">{stats.active}</p>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">Active</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center">
              <p className="text-2xl font-extrabold text-slate-400">{stats.inactive}</p>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-300">Inactive</p>
            </div>
          </div>
        )}

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-[#1F2A66] sm:text-2xl">Student Records</h1>
            <p className="mt-0.5 text-[13px] text-slate-400">
              Filter by class &amp; section, search any field, and expand a row to view a student&apos;s marks.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchStudents}
              disabled={loading}
              title="Refresh"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-40"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} aria-hidden>
                <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
            </button>
            <Link
              href="/admin/students/import"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[13px] font-bold text-slate-600 transition-colors hover:bg-slate-50"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Import Students
            </Link>
            <button
              onClick={openAdd}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#060C8B] px-4 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-[#04096a]"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="h-4 w-4" aria-hidden>
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Student
            </button>
          </div>
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

          <div className="flex flex-wrap items-center gap-2">
            <ColumnFilter label="Class" value={cls} options={classes} onChange={setCls} />
            <ColumnFilter label="Section" value={section} options={sections} onChange={setSection} />
            <div className="flex gap-1">
              {(["", "ACTIVE", "INACTIVE"] as const).map((s) => (
                <button
                  key={s || "all"}
                  onClick={() => setStatusFilter(s)}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                    statusFilter === s ? "bg-[#060C8B] text-white" : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {s === "" ? "All" : s === "ACTIVE" ? "Active" : "Inactive"}
                </button>
              ))}
            </div>
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

        {/* Fetch error */}
        {fetchError && (
          <div className="mb-4 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600">
            <span>{fetchError}</span>
            <button onClick={fetchStudents} className="ml-4 rounded-lg border border-red-200 bg-white px-3 py-1 text-[12px] font-semibold hover:bg-red-50 transition-colors">
              Retry
            </button>
          </div>
        )}

        {/* Result summary */}
        <p className="mb-3 text-[12px] text-slate-400">
          {loading ? "Loading…" : (
            <>
              Showing <span className="font-semibold text-slate-600">{returned}</span>
              {total > returned ? <> of <span className="font-semibold text-slate-600">{total}</span></> : null} student{total !== 1 ? "s" : ""}
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
                <th className="whitespace-nowrap px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-500">Status</th>
                <th className="whitespace-nowrap px-3 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!loading && rows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-3 py-16 text-center text-slate-400">
                    No students match these filters.
                  </td>
                </tr>
              ) : (
                rows.map((s) => {
                  const isOpen = expanded === s.id;
                  const d = detail[s.id];
                  const inactive = s.status === "INACTIVE";
                  return (
                    <FragmentRow key={s.id}>
                      <tr
                        onClick={() => toggleExpand(s.id)}
                        className={`cursor-pointer transition-colors ${isOpen ? "bg-[#060C8B]/[0.03]" : "hover:bg-slate-50"} ${inactive ? "opacity-60" : ""}`}
                      >
                        <td className="px-3 py-3 text-center">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? "rotate-90" : ""}`} aria-hidden>
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 font-mono text-[12px] text-slate-500">{s.admissionNumber}</td>
                        <td className="whitespace-nowrap px-3 py-3 font-semibold text-[#1F2A66]">
                          {s.name}
                          {s.rollNumber && <span className="ml-2 text-[11px] font-normal text-slate-400">Roll {s.rollNumber}</span>}
                        </td>
                        <td className="px-3 py-3">
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[12px] font-semibold text-slate-700">{s.class}</span>
                        </td>
                        <td className="px-3 py-3">
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[12px] font-semibold text-slate-700">{s.section}</span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 font-mono text-[12px] text-slate-500">{s.parentPhone}</td>
                        <td className="px-3 py-3 text-center text-slate-500">{s.marksCount}</td>
                        <td className="px-3 py-3">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-bold ${inactive ? "bg-slate-100 text-slate-500" : "bg-emerald-100 text-emerald-700"}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${inactive ? "bg-slate-400" : "bg-emerald-500"}`} />
                            {inactive ? "Inactive" : "Active"}
                          </span>
                        </td>
                        <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            <button onClick={() => openEdit(s)} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-[12px] font-medium text-slate-600 transition-colors hover:bg-slate-50">Edit</button>
                            <button
                              onClick={() => toggleStatus(s)}
                              disabled={busyId === s.id}
                              className={`rounded-lg px-2.5 py-1.5 text-[12px] font-semibold transition-colors disabled:opacity-50 ${
                                inactive ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-red-50 text-red-600 hover:bg-red-100"
                              }`}
                            >
                              {busyId === s.id ? "…" : inactive ? "Reactivate" : "Deactivate"}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {isOpen && (
                        <tr className="bg-[#060C8B]/[0.03]">
                          <td colSpan={9} className="px-4 pb-5 pt-1 sm:px-6">
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-[12px] text-slate-400">Page <span className="font-semibold text-slate-600">{page}</span> of {totalPages}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || loading}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || loading}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <h2 className="text-lg font-extrabold text-[#1F2A66]">
                  {modal === "add" ? "Add Student" : "Edit Student"}
                </h2>
                <p className="mt-0.5 text-[12px] text-slate-400">
                  {modal === "add"
                    ? "New admissions become available across marks, results, and SMS immediately."
                    : "Update details, transfer class/section, or correct the parent phone."}
                </p>
              </div>

              <Field label="Admission Number" required>
                <input
                  className={`${inputCls} ${modal === "edit" ? "cursor-not-allowed bg-slate-50 text-slate-400" : ""}`}
                  value={form.admissionNumber}
                  onChange={(e) => setForm({ ...form, admissionNumber: e.target.value })}
                  placeholder="e.g. NH-2025-001"
                  readOnly={modal === "edit"}
                />
              </Field>
              <Field label="Student Name" required>
                <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Arjun Reddy" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Class" required>
                  <Select value={form.class} onChange={(v) => setForm({ ...form, class: v })} placeholder="Select Class" options={CLASSES} required />
                </Field>
                <Field label="Section" required>
                  <Select value={form.section} onChange={(v) => setForm({ ...form, section: v })} placeholder="Select Section" options={SECTIONS} required />
                </Field>
              </div>
              <Field label="Parent Phone Number" required>
                <input className={inputCls} type="tel" value={form.parentPhone} onChange={(e) => setForm({ ...form, parentPhone: e.target.value })} placeholder="10-digit mobile (e.g. 9876543210)" />
              </Field>
              <Field label="Roll Number">
                <input className={inputCls} value={form.rollNumber} onChange={(e) => setForm({ ...form, rollNumber: e.target.value })} placeholder="Optional" />
              </Field>

              {formError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-[13px] text-red-600">{formError}</div>
              )}

              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={closeModal} className="rounded-xl border border-slate-200 px-4 py-2.5 text-[13px] font-semibold text-slate-600 transition-colors hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={saving} className="rounded-xl bg-[#060C8B] px-4 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-[#04096a] disabled:opacity-50">
                  {saving ? "Saving…" : modal === "add" ? "Add Student" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Small helper so each student maps to a <tr> + optional expansion <tr> without
// an extra wrapper element that would be invalid inside <tbody>.
function FragmentRow({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function Select({
  value,
  onChange,
  placeholder,
  options,
  required,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: readonly string[];
  required?: boolean;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputCls} cursor-pointer appearance-none pr-9 ${value ? "" : "text-slate-400"}`}
      >
        <option value="" disabled={required} className="text-slate-800">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o} className="text-slate-800">{o}</option>
        ))}
      </select>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden>
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}
