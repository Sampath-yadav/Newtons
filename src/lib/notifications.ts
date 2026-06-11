import { prisma } from "~/lib/prisma";
import { sendWhatsApp, sendSMS } from "~/lib/twilio";

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
// Returns null if the input cannot be turned into a plausible number.
export function normalizeE164(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  // Already E.164 (has +).
  if (trimmed.startsWith("+")) {
    const digits = trimmed.slice(1).replace(/\D/g, "");
    return digits.length >= 11 && digits.length <= 15 ? `+${digits}` : null;
  }
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length === 10) return `+91${digits}`;            // bare 10-digit
  if (digits.length === 11 && digits.startsWith("0")) return `+91${digits.slice(1)}`; // leading 0
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;           // 91XXXXXXXXXX
  return null;
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

// Core send + log routine. WhatsApp-first with synchronous SMS fallback.
export async function sendNotification(args: SendArgs): Promise<SendOutcome> {
  const { studentId, examId, type, parentPhone, body } = args;
  const to = resolveDestination(parentPhone);

  // No usable number → record as skipped, do not call Twilio.
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

  // 1) Try WhatsApp first — unless it's disabled (SMS-only mode).
  let waReason: string | null = null;
  if (whatsAppEnabled()) {
    try {
      const res = await sendWhatsApp({ to, body });
      await prisma.notification.create({
        data: {
          studentId, examId, type,
          channel: "whatsapp",
          status: "sent",
          providerSid: res.sid,
          toNumber: to,
          sentAt: new Date(),
        },
      });
      return { ok: true, channel: "whatsapp", status: "sent", fellBack: false, to };
    } catch (waErr) {
      waReason = errMessage(waErr);
      // fall through to SMS
    }
  }

  // 2) SMS — either WhatsApp is disabled, or it failed and we're falling back.
  const fellBack = waReason !== null;
  try {
    const res = await sendSMS({ to, body });
    await prisma.notification.create({
      data: {
        studentId, examId, type,
        channel: "sms",
        status: "sent",
        providerSid: res.sid,
        toNumber: to,
        errorMessage: fellBack ? `WhatsApp failed, sent via SMS. WhatsApp error: ${waReason}` : null,
        sentAt: new Date(),
      },
    });
    return { ok: true, channel: "sms", status: "sent", fellBack, to };
  } catch (smsErr) {
    const smsReason = errMessage(smsErr);
    await prisma.notification.create({
      data: {
        studentId, examId, type,
        channel: "sms",
        status: "failed",
        toNumber: to,
        errorCode: errCode(smsErr),
        errorMessage: fellBack ? `WhatsApp failed: ${waReason} | SMS failed: ${smsReason}` : `SMS failed: ${smsReason}`,
      },
    });
    return { ok: false, channel: "sms", status: "failed", fellBack, to, error: smsReason };
  }
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
