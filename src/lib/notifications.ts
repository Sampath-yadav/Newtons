import { prisma } from "~/lib/prisma";
import { getSmsProvider, sendWithRetry } from "~/lib/sms";
import { safeNormalizePhone } from "~/lib/phone";

// High-level notification service.
//
// Delivery strategy: WhatsApp first, automatic SMS fallback if the WhatsApp
// send throws immediately (bad number, sandbox not joined, no WA capability).
// Every attempt is logged to the Notification table for tracking/accountability.
//
// Test mode (NOTIFICATION_TEST_MODE=true): every message is redirected to
// NOTIFICATION_TEST_NUMBER regardless of the parent number on the student, so
// the workflow can be validated end-to-end without messaging real parents.
// Set NOTIFICATION_TEST_MODE=false in production to send to each parentPhone.

export type NotificationType = "result" | "attendance" | "announcement";

export interface SendOutcome {
  ok: boolean;
  channel: "whatsapp" | "sms" | null; // channel that actually delivered (or attempted)
  status: "sent" | "failed" | "skipped";
  fellBack: boolean;                   // true if WhatsApp failed and SMS was used
  to: string | null;                   // E.164 number actually targeted
  error?: string;
}

export function isTestMode(): boolean {
  return process.env.NOTIFICATION_TEST_MODE === "true";
}

// Whether to attempt WhatsApp first. Set NOTIFICATION_WHATSAPP_ENABLED=false to
// send SMS only (e.g. during trial testing without the WhatsApp sandbox).
// Defaults to true so production keeps the WhatsApp-first → SMS-fallback flow.
export function whatsAppEnabled(): boolean {
  return process.env.NOTIFICATION_WHATSAPP_ENABLED !== "false";
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

interface SendArgs {
  studentId: number;
  examId: number | null;
  type: NotificationType;
  parentPhone: string | null;
  body: string;
}

// Pure delivery result — what happened on the wire, with NO database writes.
// The caller decides how to record it (single-send creates a row; the batch
// updates its pre-created claim row). This keeps the WhatsApp→SMS fallback +
// retry logic in one place and reusable.
export interface DeliveryResult {
  ok: boolean;
  channel: "whatsapp" | "sms" | null;
  providerSid: string | null;
  fellBack: boolean;
  error?: string;
  errorCode?: string;
}

// Attempt delivery to an already-resolved E.164 number: WhatsApp first (if
// enabled & supported), automatic SMS fallback, each wrapped in retry/backoff.
// Does NOT touch the database.
export async function deliverMessage(opts: {
  to: string;
  body: string;
  idempotencyKey: string;
}): Promise<DeliveryResult> {
  const provider = getSmsProvider();
  const { to, body, idempotencyKey } = opts;

  let waReason: string | null = null;
  if (whatsAppEnabled() && provider.sendWhatsApp) {
    try {
      const res = await sendWithRetry(() => provider.sendWhatsApp!({ to, body, idempotencyKey }));
      return { ok: true, channel: "whatsapp", providerSid: res.providerSid, fellBack: false };
    } catch (waErr) {
      waReason = errMessage(waErr);
    }
  }

  const fellBack = waReason !== null;
  try {
    const res = await sendWithRetry(() => provider.sendSms({ to, body, idempotencyKey }));
    return {
      ok: true,
      channel: "sms",
      providerSid: res.providerSid,
      fellBack,
      error: fellBack ? `WhatsApp failed, sent via SMS. WhatsApp error: ${waReason}` : undefined,
    };
  } catch (smsErr) {
    const smsReason = errMessage(smsErr);
    return {
      ok: false,
      channel: "sms",
      providerSid: null,
      fellBack,
      error: fellBack ? `WhatsApp failed: ${waReason} | SMS failed: ${smsReason}` : `SMS failed: ${smsReason}`,
      errorCode: errCode(smsErr),
    };
  }
}

// Core send + log routine for the single-student path. WhatsApp-first with
// automatic SMS fallback; records one Notification row with the outcome.
export async function sendNotification(args: SendArgs): Promise<SendOutcome> {
  const { studentId, examId, type, parentPhone, body } = args;
  const to = resolveDestination(parentPhone);

  // No usable number → record as skipped, do not call the provider.
  if (!to) {
    await prisma.notification.create({
      data: {
        studentId, examId, type,
        channel: "whatsapp",
        status: "skipped",
        errorMessage: "No valid phone number to send to.",
      },
    });
    return { ok: false, channel: null, status: "skipped", fellBack: false, to: null, error: "No valid phone number." };
  }

  const d = await deliverMessage({ to, body, idempotencyKey: `result:${examId ?? "none"}:${studentId}` });

  await prisma.notification.create({
    data: {
      studentId, examId, type,
      channel: d.channel ?? "sms",
      status: d.ok ? "sent" : "failed",
      providerSid: d.providerSid,
      toNumber: to,
      errorCode: d.errorCode,
      errorMessage: d.ok ? (d.fellBack ? d.error ?? null : null) : (d.error ?? "Send failed."),
      sentAt: d.ok ? new Date() : null,
    },
  });

  return {
    ok: d.ok,
    channel: d.channel,
    status: d.ok ? "sent" : "failed",
    fellBack: d.fellBack,
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
