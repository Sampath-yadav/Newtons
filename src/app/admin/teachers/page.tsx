"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface Teacher {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  assignedClass: string | null;
  assignedSection: string | null;
  phone: string | null;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
}

type ModalMode = "add" | "edit" | "view" | null;

interface FormState {
  name: string;
  email: string;
  subject: string;
  assignedClass: string;
  assignedSection: string;
  phone: string;
}

const EMPTY_FORM: FormState = {
  name: "",
  email: "",
  subject: "",
  assignedClass: "",
  assignedSection: "",
  phone: "",
};

// Controlled option lists — extend these to add new subjects/classes/sections
// without touching the form markup.
const SUBJECTS = [
  "Telugu",
  "Hindi",
  "English",
  "Mathematics",
  "Physical Science",
  "Biological Science",
  "Social Studies",
];
const CLASSES = ["8", "9", "10"];
const SECTIONS = ["A", "B", "C"];

function StatusPill({ status }: { status: Teacher["status"] }) {
  const active = status === "ACTIVE";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${
        active
          ? "border-emerald-200 bg-emerald-100 text-emerald-800"
          : "border-slate-200 bg-slate-100 text-slate-500"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-slate-400"}`} />
      {active ? "Active" : "Disabled"}
    </span>
  );
}

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-[#060C8B] focus:outline-none focus:ring-1 focus:ring-[#060C8B]/30 transition-colors";

export default function TeachersPage() {
  const router = useRouter();
  const { data: session, status: authStatus } = useSession();

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "ACTIVE" | "INACTIVE">("");

  const [modal, setModal] = useState<ModalMode>(null);
  const [active, setActive] = useState<Teacher | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);

  useEffect(() => {
    if (authStatus === "unauthenticated") router.push("/admin");
    if (authStatus === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/teacher/upload");
    }
  }, [authStatus, session, router]);

  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (statusFilter) params.set("status", statusFilter);
    const res = await fetch(`/api/admin/teachers?${params.toString()}`);
    const data = await res.json();
    if (res.ok) setTeachers(data.teachers);
    setLoading(false);
  }, [q, statusFilter]);

  useEffect(() => {
    const t = setTimeout(fetchTeachers, q ? 300 : 0);
    return () => clearTimeout(t);
  }, [fetchTeachers, q]);

  function openAdd() {
    setForm(EMPTY_FORM);
    setActive(null);
    setFormError("");
    setModal("add");
  }

  function openEdit(t: Teacher) {
    setForm({
      name: t.name,
      email: t.email,
      subject: t.subject ?? "",
      assignedClass: t.assignedClass ?? "",
      assignedSection: t.assignedSection ?? "",
      phone: t.phone ?? "",
    });
    setActive(t);
    setFormError("");
    setModal("edit");
  }

  function openView(t: Teacher) {
    setActive(t);
    setModal("view");
  }

  function closeModal() {
    setModal(null);
    setActive(null);
    setFormError("");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError("");

    const isEdit = modal === "edit" && active;
    const url = isEdit ? `/api/admin/teachers/${active.id}` : "/api/admin/teachers";
    const method = isEdit ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      closeModal();
      await fetchTeachers();
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(t: Teacher) {
    const next = t.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    setBusyId(t.id);
    try {
      const res = await fetch(`/api/admin/teachers/${t.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (res.ok) await fetchTeachers();
    } finally {
      setBusyId(null);
    }
  }

  if (authStatus === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] text-slate-400">
        Loading…
      </div>
    );
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
              <p className="text-[10px] uppercase tracking-wider text-slate-400">Teacher Management</p>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="hidden text-[13px] text-slate-500 sm:inline">{session?.user?.name}</span>
            <button
              onClick={() => signOut({ callbackUrl: "/admin" })}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-[12px] text-slate-500 transition-colors hover:bg-slate-50"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Sub-nav */}
      <div className="border-b border-slate-200 bg-white px-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl gap-1">
          <Link href="/admin/marks" className="border-b-2 border-transparent px-3 py-3 text-[13px] font-medium text-slate-500 transition-colors hover:text-slate-800">
            Mark Approvals
          </Link>
          <Link href="/admin/students" className="border-b-2 border-transparent px-3 py-3 text-[13px] font-medium text-slate-500 transition-colors hover:text-slate-800">
            Students
          </Link>
          <span className="border-b-2 border-[#060C8B] px-3 py-3 text-[13px] font-semibold text-[#060C8B]">
            Teachers
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-[#1F2A66] sm:text-2xl">Teacher Management</h1>
            <p className="mt-0.5 text-[13px] text-slate-400">
              Add, edit, and enable or disable teacher accounts. Teachers sign in with their own
              identity — no passwords are issued here.
            </p>
          </div>
          <button
            onClick={openAdd}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#060C8B] px-4 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-[#04096a]"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="h-4 w-4" aria-hidden>
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Teacher
          </button>
        </div>

        {/* Toolbar */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden>
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name, email, or subject…"
              className={`${inputCls} pl-9`}
            />
          </div>
          <div className="flex gap-1.5">
            {(["", "ACTIVE", "INACTIVE"] as const).map((s) => (
              <button
                key={s || "all"}
                onClick={() => setStatusFilter(s)}
                className={`rounded-lg border px-3 py-2 text-[12px] font-semibold transition-colors ${
                  statusFilter === s
                    ? "border-[#060C8B] bg-[#060C8B] text-white"
                    : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                }`}
              >
                {s === "" ? "All" : s === "ACTIVE" ? "Active" : "Disabled"}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-left">
                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-slate-400">Name</th>
                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-slate-400">Email</th>
                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-slate-400">Subject</th>
                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-slate-400">Class / Sec</th>
                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-slate-400">Status</th>
                <th className="px-5 py-3 text-right text-[11px] font-bold uppercase tracking-wide text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-400">Loading teachers…</td></tr>
              ) : teachers.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-400">No teachers found.</td></tr>
              ) : (
                teachers.map((t) => (
                  <tr key={t.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/40">
                    <td className="px-5 py-3.5 font-semibold text-slate-800">{t.name}</td>
                    <td className="px-5 py-3.5 text-slate-500">{t.email}</td>
                    <td className="px-5 py-3.5 text-slate-500">{t.subject ?? "—"}</td>
                    <td className="px-5 py-3.5 text-slate-500">
                      {t.assignedClass ? `${t.assignedClass}${t.assignedSection ? ` / ${t.assignedSection}` : ""}` : "—"}
                    </td>
                    <td className="px-5 py-3.5"><StatusPill status={t.status} /></td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => openView(t)} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-[12px] font-medium text-slate-600 transition-colors hover:bg-slate-50">View</button>
                        <button onClick={() => openEdit(t)} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-[12px] font-medium text-slate-600 transition-colors hover:bg-slate-50">Edit</button>
                        <button
                          onClick={() => toggleStatus(t)}
                          disabled={busyId === t.id}
                          className={`rounded-lg px-2.5 py-1.5 text-[12px] font-semibold transition-colors disabled:opacity-50 ${
                            t.status === "ACTIVE"
                              ? "bg-red-50 text-red-600 hover:bg-red-100"
                              : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          }`}
                        >
                          {busyId === t.id ? "…" : t.status === "ACTIVE" ? "Disable" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit modal */}
      {(modal === "add" || modal === "edit") && (
        <Overlay onClose={closeModal}>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <h2 className="text-lg font-extrabold text-[#1F2A66]">
                {modal === "add" ? "Add Teacher" : "Edit Teacher"}
              </h2>
              <p className="mt-0.5 text-[12px] text-slate-400">
                {modal === "add"
                  ? "Create a teacher account. They will be able to sign in with this email."
                  : "Update this teacher's details."}
              </p>
            </div>

            <Field label="Full Name" required>
              <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Anita Sharma" />
            </Field>
            <Field label="Email Address" required>
              <input className={inputCls} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="teacher@newtons.edu.in" />
            </Field>
            <Field label="Subject" required>
              <Select
                value={form.subject}
                onChange={(v) => setForm({ ...form, subject: v })}
                placeholder="Select Subject"
                options={SUBJECTS}
                required
              />
            </Field>
            <Field label="Phone Number">
              <input className={inputCls} type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="e.g. 98660 89343" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Assigned Class">
                <Select
                  value={form.assignedClass}
                  onChange={(v) => setForm({ ...form, assignedClass: v })}
                  placeholder="Select Class"
                  options={CLASSES}
                />
              </Field>
              <Field label="Assigned Section">
                <Select
                  value={form.assignedSection}
                  onChange={(v) => setForm({ ...form, assignedSection: v })}
                  placeholder="Select Section"
                  options={SECTIONS}
                />
              </Field>
            </div>

            {formError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-[13px] text-red-600">{formError}</div>
            )}

            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={closeModal} className="rounded-xl border border-slate-200 px-4 py-2.5 text-[13px] font-semibold text-slate-600 transition-colors hover:bg-slate-50">Cancel</button>
              <button type="submit" disabled={saving} className="rounded-xl bg-[#060C8B] px-4 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-[#04096a] disabled:opacity-50">
                {saving ? "Saving…" : modal === "add" ? "Add Teacher" : "Save Changes"}
              </button>
            </div>
          </form>
        </Overlay>
      )}

      {/* View modal */}
      {modal === "view" && active && (
        <Overlay onClose={closeModal}>
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-[#1F2A66]">{active.name}</h2>
                <p className="mt-0.5 text-[13px] text-slate-500">{active.email}</p>
              </div>
              <StatusPill status={active.status} />
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl bg-slate-50 p-4 text-sm">
              <Detail label="Subject" value={active.subject ?? "—"} />
              <Detail label="Phone" value={active.phone ?? "—"} />
              <Detail label="Assigned Class" value={active.assignedClass ?? "—"} />
              <Detail label="Assigned Section" value={active.assignedSection ?? "—"} />
              <Detail label="Role" value="Teacher" />
              <Detail label="Added On" value={new Date(active.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })} />
            </dl>
            <div className="flex justify-end gap-2 pt-1">
              <button onClick={() => openEdit(active)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-[13px] font-semibold text-slate-600 transition-colors hover:bg-slate-50">Edit</button>
              <button onClick={closeModal} className="rounded-xl bg-[#060C8B] px-4 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-[#04096a]">Close</button>
            </div>
          </div>
        </Overlay>
      )}
    </div>
  );
}

function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        {children}
      </div>
    </div>
  );
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
        className={`${inputCls} cursor-pointer appearance-none pr-10 ${value ? "" : "text-slate-400"}`}
      >
        {/* Required selects disable the empty option so the placeholder can't be
            submitted; optional ones keep it selectable to clear the value. */}
        <option value="" disabled={required} className="text-slate-800">
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o} className="text-slate-800">
            {o}
          </option>
        ))}
      </select>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        aria-hidden
      >
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

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-0.5 font-medium text-slate-700">{value}</dd>
    </div>
  );
}
