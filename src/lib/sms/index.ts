import type { SmsProvider, SmsMessage, SmsSendResult } from "./provider";
import { twilioProvider } from "./twilio-provider";

export type { SmsProvider, SmsMessage, SmsSendResult } from "./provider";
export { SmsError } from "./provider";
export { sendWithRetry, mapLimit, SMS_CONCURRENCY } from "./send-with-retry";

// A provider that pretends to send (logs only). Lets the full publish → send →
// audit pipeline run end-to-end before the real SMS service is wired in, and is
// used in automated tests.
let noopCounter = 0;
const noopProvider: SmsProvider = {
  name: "noop",
  async sendSms({ to }: SmsMessage): Promise<SmsSendResult> {
    noopCounter += 1;
    console.log(`[sms:noop] would send SMS to ${to}`);
    return { providerSid: `noop-${Date.now()}-${noopCounter}`, status: "sent" };
  },
  async sendWhatsApp({ to }: SmsMessage): Promise<SmsSendResult> {
    noopCounter += 1;
    console.log(`[sms:noop] would send WhatsApp to ${to}`);
    return { providerSid: `noop-${Date.now()}-${noopCounter}`, status: "sent" };
  },
};

// Resolve the active provider:
//   SMS_PROVIDER=noop    → always noop (safe local/testing)
//   SMS_PROVIDER=twilio  → Twilio
//   unset                → Twilio if its creds exist, otherwise noop
// Swap in the real provider here when it's supplied — nothing else changes.
export function getSmsProvider(): SmsProvider {
  const explicit = process.env.SMS_PROVIDER;
  if (explicit === "noop") return noopProvider;
  if (explicit === "twilio" || process.env.TWILIO_ACCOUNT_SID) return twilioProvider;
  return noopProvider;
}
