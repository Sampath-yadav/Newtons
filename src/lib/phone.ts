// Phone number normalisation — single source of truth for the whole app.
//
// Parents are Indian mobile subscribers, so the canonical stored form is E.164
// "+91XXXXXXXXXX". A bare 10-digit number (e.g. "9876543210") that MSG91/Twilio
// would silently reject is converted to "+919876543210"; common convenience
// formats (leading 0, "91" prefix, already-"+") are accepted; anything that
// isn't a plausible number is rejected so it can be caught at save/import time
// instead of failing silently at send time.

// Returns the E.164 form, or null if the input can't be turned into a plausible
// number. Use this on the SEND path (a bad number is logged as "skipped").
export function safeNormalizePhone(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = String(raw).trim();

  // Already E.164 — accept any plausible international number as-is.
  if (trimmed.startsWith("+")) {
    const d = trimmed.slice(1).replace(/\D/g, "");
    return d.length >= 11 && d.length <= 15 ? `+${d}` : null;
  }

  // Strip India country code / trunk prefix down to the core subscriber number.
  let digits = trimmed.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  else if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);

  // Core must be exactly 10 digits and a valid Indian mobile (starts 6–9).
  if (digits.length === 10 && /^[6-9]/.test(digits)) return `+91${digits}`;
  return null;
}

// Same rules, but THROWS a clear error on an invalid number. Use this on the
// SAVE/IMPORT path so a bad parent phone is rejected up front with a message
// the admin can act on, never stored to fail silently later.
export function normalizePhone(raw: string | null | undefined): string {
  const e164 = safeNormalizePhone(raw);
  if (!e164) {
    throw new Error(
      `Invalid phone number: "${raw ?? ""}". Expected a 10-digit Indian mobile starting 6–9 (optionally with +91).`
    );
  }
  return e164;
}
