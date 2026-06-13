import { SmsError } from "./provider";

// Retry wrapper for a single provider send. Retries only errors marked
// retryable (429 / 5xx / network) with exponential backoff + jitter; permanent
// errors (bad number, auth) fail immediately.

const MAX_ATTEMPTS = Number(process.env.SMS_MAX_ATTEMPTS ?? 3);
const BASE_DELAY_MS = Number(process.env.SMS_RETRY_BASE_MS ?? 300);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function sendWithRetry<T>(fn: () => Promise<T>): Promise<T> {
  let attempt = 0;
  for (;;) {
    attempt += 1;
    try {
      return await fn();
    } catch (e) {
      const retryable = e instanceof SmsError ? e.retryable : true;
      if (!retryable || attempt >= MAX_ATTEMPTS) throw e;
      const backoff = BASE_DELAY_MS * 2 ** (attempt - 1);
      const jitter = Math.random() * BASE_DELAY_MS;
      await sleep(backoff + jitter);
    }
  }
}

// Bounded-concurrency map — process `items` `limit` at a time. Default limit 1
// (sequential) keeps us safe against an unknown provider's rate limit; bump via
// SMS_CONCURRENCY once the provider's limits are known.
export const SMS_CONCURRENCY = Math.max(1, Number(process.env.SMS_CONCURRENCY ?? 1));

export async function mapLimit<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    for (;;) {
      const i = next++;
      if (i >= items.length) return;
      results[i] = await fn(items[i], i);
    }
  });
  await Promise.all(workers);
  return results;
}
