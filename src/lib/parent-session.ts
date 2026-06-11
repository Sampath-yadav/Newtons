import { createHmac, timingSafeEqual } from "crypto";

// Lightweight, self-contained session for the Parent Portal — deliberately
// separate from NextAuth (which authenticates User rows: teachers/admins).
// A parent is not a User; the principal here is a Student id.
//
// The cookie value is `base64url(payload).base64url(hmac)`, signed with
// NEXTAUTH_SECRET. No DB lookup needed to validate the signature.

export const PARENT_COOKIE = "parent_session";
export const PARENT_SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days (seconds)

interface ParentPayload {
  sid: number; // studentId
  iat: number; // issued-at (seconds)
}

function secret(): string {
  const s = process.env.NEXTAUTH_SECRET;
  if (!s) throw new Error("NEXTAUTH_SECRET is required to sign parent sessions.");
  return s;
}

function b64url(buf: Buffer): string {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function sign(payloadB64: string): string {
  return b64url(createHmac("sha256", secret()).update(payloadB64).digest());
}

// Create a signed session token for a student.
export function signParentSession(studentId: number): string {
  const payload: ParentPayload = { sid: studentId, iat: Math.floor(Date.now() / 1000) };
  const payloadB64 = b64url(Buffer.from(JSON.stringify(payload)));
  return `${payloadB64}.${sign(payloadB64)}`;
}

// Verify a token and return the studentId, or null if invalid/expired/tampered.
export function verifyParentSession(token: string | undefined | null): number | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadB64, providedSig] = parts;

  const expectedSig = sign(payloadB64);
  // Constant-time comparison to avoid timing leaks.
  const a = Buffer.from(providedSig);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const json = Buffer.from(payloadB64.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
    const payload = JSON.parse(json) as ParentPayload;
    if (typeof payload.sid !== "number") return null;
    // Expiry check.
    const ageSeconds = Math.floor(Date.now() / 1000) - payload.iat;
    if (ageSeconds > PARENT_SESSION_MAX_AGE) return null;
    return payload.sid;
  } catch {
    return null;
  }
}
