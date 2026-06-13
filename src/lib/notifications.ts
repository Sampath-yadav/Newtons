import { prisma } from "~/lib/prisma";
import { getSmsProvider, sendWithRetry } from "~/lib/sms";
import { safeNormalizePhone } from "~/lib/phone";

// High-level notification service.
//
// Delivery channel: SMS only. Every attempt is logged to the Notification table
// for tracking/accountability.
//
// Test mode (NOTIFICATION_TEST_MODE=true): every message is redirected to
// NOTIFICATION_TEST_NUMBER regardless of the parent number on the student, so
// the workflow can be validated end-to-end without messaging real parents.
// Set NOTIFICATION_TEST_MODE=false in production to send to each parentPhone.

export type NotificationType = "result" | "attendance" | "announcement";

export interface SendOutcome {
  ok: boolean;
  channel: "sms" | null;               // "sms" when an attempt was made, null when skipped
  status: "sent" | "failed" | "skipped";
  to: string | null;                   // E.164 number actually targeted
  error?: string;
}

export function isTestMode(): boolean {
  return process.env.NOTIFICATION_TEST_MODE === "true";
}

// Normalise an Indian mobile number to E.164 (+91XXXXXXXXXX).
// Delegates to the shared phone utility so the SEND path and the SAVE/IMPORT
// path apply identical rules. Returns null if the number isn't plausible.
export function normalizeE164(raw: string | null | undefined): string | null {
  return safeNormalizePhone(raw);
}

// Resolve the destination number, honouring test mode.
export function resolveDestination(parentPhone: string | null | undefined): string | null {
  if (isTestMode()) {
    return normalizeE164(process.env.NOTIFICATION_TEST_NUMBER);
  }
  return normalizeE164(parentPhone);
}

// ── Twilio free-trial allowlist ──────────────────────────────────────────────
// A Twilio trial account can only message numbers verified in the Twilio
// console. While SMS_ALLOWLIST is set (comma-separated E.164/Indian numbers),
// the pipeline still resolves each student's REAL parentPhone from the database
// — so unique links and the student↔parent mapping are exactly as in production
// — but only DISPATCHES to numbers on the list; everyone else is logged as
// "skipped". Clear SMS_ALLOWLIST to message every parent in production: no code
// change, just an env change.
export function getAllowlist(): string[] | null {
  const raw = process.env.SMS_ALLOWLIST;
  if (!raw) return null;
  const list = raw
    .split(",")
    .map((s) => normalizeE164(s.trim()))
    .filter((n): n is string => n !== null);
  return list.length > 0 ? list : null;
}

export function isAllowedDestination(to: string): boolean {
  const allow = getAllowlist();
  if (!allow) return true; // no allowlist configured → full production behaviour
  return allow.includes(to);
}

export interface SendTarget {
  to: string | null;     // E.164 number to actually send to, or null if skipped
  skipReason?: string;   // why it was skipped (recorded on the Notification row)
}

// Single place that turns a parent's stored phone into a final, gated send
// target so the single-send and batch paths behave identically: test-mode
// redirect → phone validation → trial allowlist check.
export function resolveSendTarget(parentPhone: string | null | undefined): SendTarget {
  const to = resolveDestination(parentPhone);
  if (!to) return { to: null, skipReason: "No valid phone number to send to." };
  if (!isAllowedDestination(to)) {
    return {
      to: null,
      skipReason: "Recipient not in SMS_ALLOWLIST — skipped during Twilio trial (only verified numbers are messaged).",
    };
  }
  return { to };
}

interface SendArgs {
  studentId: number;
  examId: number | null;
  type: NotificationType;
  parentPhone: string | null;
  body: string;
}

// Pure delivery result — what happened on the wire, with NO database writes.
// The caller decides how to record it (single-send creates a row; the batch
// updates its pre-created claim row). This keeps the SMS send + retry logic in
// one place and reusable.
export interface DeliveryResult {
  ok: boolean;
  channel: "sms" | null;
  providerSid: string | null;
  error?: string;
  errorCode?: string;
}

// Send an SMS to an already-resolved E.164 number, wrapped in retry/backoff.
// Does NOT touch the database.
export async function deliverMessage(opts: {
  to: string;
  body: string;
  idempotencyKey: string;
}): Promise<DeliveryResult> {
  const provider = getSmsProvider();
  const { to, body, idempotencyKey } = opts;

  try {
    const res = await sendWithRetry(() => provider.sendSms({ to, body, idempotencyKey }));
    return { ok: true, channel: "sms", providerSid: res.providerSid };
  } catch (smsErr) {
    return {
      ok: false,
      channel: "sms",
      providerSid: null,
      error: `SMS failed: ${errMessage(smsErr)}`,
      errorCode: errCode(smsErr),
    };
  }
}

// Core send + log routine for the single-student path. Sends one SMS and
// records one Notification row with the outcome.
export async function sendNotification(args: SendArgs): Promise<SendOutcome> {
  const { studentId, examId, type, parentPhone, body } = args;
  const { to, skipReason } = resolveSendTarget(parentPhone);

  // No usable / not-allowed number → record as skipped, do not call the provider.
  if (!to) {
    await prisma.notification.create({
      data: {
        studentId, examId, type,
        channel: "sms",
        status: "skipped",
        errorMessage: skipReason ?? "No valid phone number to send to.",
      },
    });
    return { ok: false, channel: null, status: "skipped", to: null, error: skipReason ?? "No valid phone number." };
  }

  const d = await deliverMessage({ to, body, idempotencyKey: `result:${examId ?? "none"}:${studentId}` });

  await prisma.notification.create({
    data: {
      studentId, examId, type,
      channel: "sms",
      status: d.ok ? "sent" : "failed",
      providerSid: d.providerSid,
      toNumber: to,
      errorCode: d.errorCode,
      errorMessage: d.ok ? null : (d.error ?? "Send failed."),
      sentAt: d.ok ? new Date() : null,
    },
  });

  return {
    ok: d.ok,
    channel: d.channel,
    status: d.ok ? "sent" : "failed",
    to,
    error: d.error,
  };
}

// Convenience wrapper for the result-link use case.
export async function sendResultNotification(args: {
  studentId: number;
  examId: number;
  parentPhone: string | null;
  body: string;
}): Promise<SendOutcome> {
  return sendNotification({ ...args, type: "result" });
}

// Build the parent-facing message for a published result.
export function buildResultMessage(opts: {
  examName: string;
  studentName: string;
  className: string;
  section: string;
  link: string;
}): string {
  return (
    `Newton's High School\n` +
    `${opts.examName} Results Published\n\n` +
    `Student: ${opts.studentName}\n` +
    `Class: ${opts.className}-${opts.section}\n\n` +
    `View Result:\n${opts.link}`
  );
}

// ── helpers ──────────────────────────────────────────────────────────────────
function errMessage(e: unknown): string {
  if (e && typeof e === "object" && "message" in e) return String((e as { message: unknown }).message);
  return String(e);
}
function errCode(e: unknown): string | undefined {
  if (e && typeof e === "object" && "code" in e) return String((e as { code: unknown }).code);
  return undefined;
}
