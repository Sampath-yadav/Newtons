import { sendSMS, sendWhatsApp } from "../twilio";
import type { SmsProvider, SmsMessage, SmsSendResult } from "./provider";
import { SmsError } from "./provider";

// Adapts the existing Twilio client (src/lib/twilio.ts) to the SmsProvider
// interface, normalising errors so the retry layer can tell transient failures
// (back off & retry) from permanent ones (fail fast).
function classify(e: unknown): SmsError {
  const err = e as { message?: string; status?: number; code?: number | string };
  const status = typeof err?.status === "number" ? err.status : undefined;
  const code = err?.code != null ? String(err.code) : undefined;
  // No HTTP status → network/timeout → retryable. 429 (rate limit) or 5xx → retryable.
  // Everything else (bad number, auth, etc.) is permanent.
  const retryable = status === undefined || status === 429 || status >= 500;
  return new SmsError(err?.message ?? "SMS send failed", retryable, code);
}

export const twilioProvider: SmsProvider = {
  name: "twilio",
  async sendSms({ to, body }: SmsMessage): Promise<SmsSendResult> {
    try {
      const r = await sendSMS({ to, body });
      return { providerSid: r.sid, status: r.status };
    } catch (e) {
      throw classify(e);
    }
  },
  async sendWhatsApp({ to, body }: SmsMessage): Promise<SmsSendResult> {
    try {
      const r = await sendWhatsApp({ to, body });
      return { providerSid: r.sid, status: r.status };
    } catch (e) {
      throw classify(e);
    }
  },
};
