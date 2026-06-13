import twilio from "twilio";
import type { Twilio } from "twilio";

// Lazy singleton Twilio client. Mirrors the globalForPrisma pattern in
// src/lib/prisma.ts so dev hot-reload does not recreate the client each time.
// Server-only — never import this into a client component.

const globalForTwilio = globalThis as unknown as { twilio?: Twilio };

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable "${name}". Set it in .env.local (see the Twilio block).`
    );
  }
  return value;
}

function getClient(): Twilio {
  if (globalForTwilio.twilio) return globalForTwilio.twilio;
  const client = twilio(requireEnv("TWILIO_ACCOUNT_SID"), requireEnv("TWILIO_AUTH_TOKEN"));
  if (process.env.NODE_ENV !== "production") globalForTwilio.twilio = client;
  return client;
}

export interface SendResult {
  sid: string;
  status: string; // Twilio message status: queued | sent | ...
}

// Send a plain SMS. Throws on immediate API errors.
export async function sendSMS({ to, body }: { to: string; body: string }): Promise<SendResult> {
  const from = requireEnv("TWILIO_SMS_FROM");
  const msg = await getClient().messages.create({ from, to, body });
  return { sid: msg.sid, status: msg.status };
}
