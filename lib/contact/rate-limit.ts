import { getClientIp } from "@/lib/http/ip";

export { getClientIp };

const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS = 5;

type Entry = {
  count: number;
  resetAt: number;
};

const hits = new Map<string, Entry>();

export function checkRateLimit(ip: string): {
  ok: boolean;
  remaining: number;
} {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now >= entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true, remaining: MAX_REQUESTS - 1 };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { ok: false, remaining: 0 };
  }

  entry.count += 1;
  return { ok: true, remaining: MAX_REQUESTS - entry.count };
}
