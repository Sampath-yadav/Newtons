"use client";

import { useState } from "react";
import { Button } from "~/components/ui/Button";

/* ── Data ─────────────────────────────────────────────────────────────── */

const GRADES = [
  "Pre-Primary (Ages 3½ – 5½)",
  "Class 1 (Age 6)",
  "Class 2 (Age 7)",
  "Class 3 (Age 8)",
  "Class 4 (Age 9)",
  "Class 5 (Age 10)",
  "Class 6 (Age 11)",
  "Class 7 (Age 12)",
  "Class 8 (Age 13)",
  "Class 9 (Age 14)",
  "Class 10 / SSC (Age 15 – 16)",
];

const ACADEMIC_YEARS = ["2025 – 2026", "2026 – 2027", "2027 – 2028"];

/* ── Types ─────────────────────────────────────────────────────────────── */

interface FormState {
  parentName: string;
  studentName: string;
  email: string;
  mobile: string;
  grade: string;
  academicYear: string;
  address: string;
  message: string;
}

interface FormErrors {
  parentName?: string;
  studentName?: string;
  email?: string;
  mobile?: string;
  grade?: string;
}

/* ── Helpers ───────────────────────────────────────────────────────────── */

function inputClass(hasError?: boolean) {
  return [
    "w-full rounded-lg border px-4 py-3 text-[14px] text-brand-ink",
    "placeholder:text-slate-400 transition duration-150",
    "focus:outline-none focus:ring-2 focus:ring-brand-orange/25 focus:border-brand-orange",
    hasError
      ? "border-red-400 bg-red-50/60"
      : "border-slate-200 bg-white hover:border-slate-300",
  ].join(" ");
}

/* ── Component ─────────────────────────────────────────────────────────── */

export function EnquiryForm() {
  const [form, setForm] = useState<FormState>({
    parentName: "",
    studentName: "",
    email: "",
    mobile: "",
    grade: "",
    academicYear: "",
    address: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function update<K extends keyof FormState>(field: K, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field in errors && errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function validate(): boolean {
    const e: FormErrors = {};
    if (!form.parentName.trim())
      e.parentName = "Parent / guardian name is required.";
    if (!form.studentName.trim())
      e.studentName = "Student name is required.";
    if (!form.email.trim()) {
      e.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Please enter a valid email address.";
    }
    if (!form.mobile.trim()) {
      e.mobile = "Mobile number is required.";
    } else if (!/^[6-9]\d{9}$/.test(form.mobile.replace(/[\s-]/g, ""))) {
      e.mobile = "Please enter a valid 10-digit mobile number.";
    }
    if (!form.grade) e.grade = "Please select the grade applying for.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate() || !consent) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setSubmitted(true);
  }

  /* Success state */
  if (submitted) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 px-8 py-14 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#16a34a"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-8 w-8"
            aria-hidden
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="mb-2 text-xl font-extrabold text-brand-ink">
          Enquiry received!
        </h3>
        <p className="mx-auto max-w-sm text-[15px] text-brand-muted">
          Thank you for your interest in Newton&apos;s High School. Our
          admissions team will be in touch within 2 working days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

        {/* Parent / Guardian Name */}
        <Field
          id="parentName"
          label="Parent / Guardian Name"
          required
          error={errors.parentName}
        >
          <input
            id="parentName"
            type="text"
            value={form.parentName}
            onChange={(e) => update("parentName", e.target.value)}
            placeholder="Parent / Guardian Name"
            className={inputClass(!!errors.parentName)}
            aria-describedby={errors.parentName ? "parentName-err" : undefined}
            aria-invalid={!!errors.parentName}
          />
          {errors.parentName && (
            <ErrorMsg id="parentName-err">{errors.parentName}</ErrorMsg>
          )}
        </Field>

        {/* Student Name */}
        <Field id="studentName" label="Student Name" required error={errors.studentName}>
          <input
            id="studentName"
            type="text"
            value={form.studentName}
            onChange={(e) => update("studentName", e.target.value)}
            placeholder="Student Name"
            className={inputClass(!!errors.studentName)}
            aria-describedby={errors.studentName ? "studentName-err" : undefined}
            aria-invalid={!!errors.studentName}
          />
          {errors.studentName && (
            <ErrorMsg id="studentName-err">{errors.studentName}</ErrorMsg>
          )}
        </Field>

        {/* Email */}
        <Field id="email" label="E-mail" required error={errors.email}>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="E-mail"
            className={inputClass(!!errors.email)}
            aria-describedby={errors.email ? "email-err" : undefined}
            aria-invalid={!!errors.email}
          />
          {errors.email && <ErrorMsg id="email-err">{errors.email}</ErrorMsg>}
        </Field>

        {/* Mobile */}
        <Field id="mobile" label="Mobile Number" required error={errors.mobile}>
          <input
            id="mobile"
            type="tel"
            value={form.mobile}
            onChange={(e) => update("mobile", e.target.value)}
            placeholder="Mobile Number"
            className={inputClass(!!errors.mobile)}
            aria-describedby={errors.mobile ? "mobile-err" : undefined}
            aria-invalid={!!errors.mobile}
          />
          {errors.mobile && (
            <ErrorMsg id="mobile-err">{errors.mobile}</ErrorMsg>
          )}
        </Field>

        {/* Grade Applying For */}
        <Field
          id="grade"
          label="Grade Applying For"
          required
          error={errors.grade}
        >
          <div className="relative">
            <select
              id="grade"
              value={form.grade}
              onChange={(e) => update("grade", e.target.value)}
              className={inputClass(!!errors.grade) + " cursor-pointer appearance-none pr-10"}
              aria-describedby={errors.grade ? "grade-err" : undefined}
              aria-invalid={!!errors.grade}
            >
              <option value="">Grade Applying For</option>
              {GRADES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            <ChevronDown />
          </div>
          {errors.grade && <ErrorMsg id="grade-err">{errors.grade}</ErrorMsg>}
        </Field>

        {/* Academic Year */}
        <Field id="academicYear" label="Academic Year">
          <div className="relative">
            <select
              id="academicYear"
              value={form.academicYear}
              onChange={(e) => update("academicYear", e.target.value)}
              className={inputClass() + " cursor-pointer appearance-none pr-10"}
            >
              <option value="">Academic Year</option>
              {ACADEMIC_YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <ChevronDown />
          </div>
        </Field>

        {/* Address */}
        <Field id="address" label="Address" className="sm:col-span-2">
          <input
            id="address"
            type="text"
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
            placeholder="Address"
            className={inputClass()}
          />
        </Field>

        {/* Message */}
        <Field
          id="message"
          label="Additional Notes / Message"
          className="sm:col-span-2"
        >
          <textarea
            id="message"
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            placeholder="Any additional information or questions about admissions…"
            rows={4}
            className={inputClass() + " resize-none"}
          />
        </Field>
      </div>

      {/* Consent */}
      <div className="mt-6">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-brand-navy"
          />
          <span className="text-xs leading-relaxed text-brand-muted">
            I acknowledge that I am sharing my contact information with
            Newton&apos;s High School to learn more about my child&apos;s
            education. I consent to the Newton&apos;s School team reaching out
            to me with further details via Phone Calls, Text Messages, WhatsApp
            Messages, or Emails.{" "}
            <span className="text-red-500" aria-hidden>*</span>
          </span>
        </label>
      </div>

      {/* reCAPTCHA placeholder */}
      <div className="mt-5">
        <div className="inline-flex items-center gap-4 rounded border border-slate-200 bg-slate-50 px-4 py-3">
          <input
            type="checkbox"
            readOnly
            aria-hidden
            className="h-[18px] w-[18px] shrink-0 accent-brand-navy"
          />
          <span className="select-none text-sm text-slate-700">
            I&apos;m not a robot
          </span>
          <div className="ml-4 text-right">
            <p className="text-[10px] font-medium text-slate-500">reCAPTCHA</p>
            <p className="text-[9px] text-slate-400">Privacy · Terms</p>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="mt-7">
        <Button
          type="submit"
          size="lg"
          className="min-w-[160px]"
          disabled={!consent || submitting}
        >
          {submitting ? "Submitting…" : "Submit"}
        </Button>
      </div>
    </form>
  );
}

/* ── Small helpers ─────────────────────────────────────────────────────── */

function Field({
  id,
  label,
  required,
  error,
  className = "",
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[13px] font-medium text-brand-navy"
      >
        {label}
        {required && (
          <span className="ml-0.5 text-red-500" aria-hidden>*</span>
        )}
      </label>
      {children}
    </div>
  );
}

function ErrorMsg({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} role="alert" className="mt-1 text-xs text-red-500">
      {children}
    </p>
  );
}

function ChevronDown() {
  return (
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
  );
}
