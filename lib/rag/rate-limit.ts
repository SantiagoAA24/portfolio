import { getChatRateLimitPerHour } from "./env";

const WINDOW_MS = 60 * 60 * 1000;

type Entry = {
  count: number;
  resetAt: number;
};

const hits = new Map<string, Entry>();

export function checkChatRateLimit(ip: string): {
  ok: boolean;
  remaining: number;
} {
  const max = getChatRateLimitPerHour();
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now >= entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true, remaining: max - 1 };
  }

  if (entry.count >= max) {
    return { ok: false, remaining: 0 };
  }

  entry.count += 1;
  return { ok: true, remaining: max - entry.count };
}
