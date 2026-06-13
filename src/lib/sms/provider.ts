// Provider-agnostic messaging interface.
//
// The concrete SMS service is supplied later — code against this interface so
// the orchestration (retry, rate-limit, idempotency, logging) is provider-free.
// Drop a new provider in `index.ts` and nothing else changes.

export interface SmsMessage {
  to: string;        // E.164 destination, e.g. "+919876543210"
  body: string;
  /** Stable key so a provider can dedupe a retried send (e.g. "result:12:34"). */
  idempotencyKey?: string;
}

export interface SmsSendResult {
  providerSid: string; // provider's message id (stored on Notification.providerSid)
  status: string;      // provider status: "queued" | "sent" | ...
}

/**
 * Error thrown by a provider. `retryable` decides whether send-with-retry backs
 * off and tries again (429 / 5xx / network) or fails fast (invalid number, auth).
 */
export class SmsError extends Error {
  constructor(
    message: string,
    public readonly retryable: boolean,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "SmsError";
  }
}

export interface SmsProvider {
  readonly name: string;
  sendSms(msg: SmsMessage): Promise<SmsSendResult>;
  /** Optional — providers without WhatsApp simply omit it (caller falls back to SMS). */
  sendWhatsApp?(msg: SmsMessage): Promise<SmsSendResult>;
}
