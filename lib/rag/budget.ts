import { getChatDailyBudgetUsd } from "./env";

/** Rough USD per 1M tokens — conservative for gpt-4o-mini + text-embedding-3-small. */
const EMBED_USD_PER_1M = 0.02;
const CHAT_INPUT_USD_PER_1M = 0.15;
const CHAT_OUTPUT_USD_PER_1M = 0.6;

const MAX_OUTPUT_TOKENS = 600;

type DayBucket = {
  dayKey: string;
  spentUsd: number;
};

let bucket: DayBucket | null = null;

function utcDayKey(now = Date.now()): string {
  return new Date(now).toISOString().slice(0, 10);
}

function getBucket(): DayBucket {
  const dayKey = utcDayKey();
  if (!bucket || bucket.dayKey !== dayKey) {
    bucket = { dayKey, spentUsd: 0 };
  }
  return bucket;
}

function tokensFromChars(chars: number): number {
  return Math.max(1, Math.ceil(chars / 4));
}

export function estimateRequestCostUsd(params: {
  queryChars: number;
  contextChars: number;
}): number {
  const embedTokens = tokensFromChars(params.queryChars);
  const inputTokens =
    tokensFromChars(params.queryChars) +
    tokensFromChars(params.contextChars) +
    400; /* system + overhead */
  const outputTokens = MAX_OUTPUT_TOKENS;

  return (
    (embedTokens / 1_000_000) * EMBED_USD_PER_1M +
    (inputTokens / 1_000_000) * CHAT_INPUT_USD_PER_1M +
    (outputTokens / 1_000_000) * CHAT_OUTPUT_USD_PER_1M
  );
}

export function costFromUsage(params: {
  embeddingTokens?: number;
  promptTokens?: number;
  completionTokens?: number;
}): number {
  const embed = params.embeddingTokens ?? 0;
  const prompt = params.promptTokens ?? 0;
  const completion = params.completionTokens ?? 0;
  return (
    (embed / 1_000_000) * EMBED_USD_PER_1M +
    (prompt / 1_000_000) * CHAT_INPUT_USD_PER_1M +
    (completion / 1_000_000) * CHAT_OUTPUT_USD_PER_1M
  );
}

export function checkDailyBudget(estimatedUsd: number): {
  ok: boolean;
  spentUsd: number;
  budgetUsd: number;
} {
  const budgetUsd = getChatDailyBudgetUsd();
  const current = getBucket();
  const ok = current.spentUsd + estimatedUsd <= budgetUsd;
  return { ok, spentUsd: current.spentUsd, budgetUsd };
}

export function recordSpend(usd: number): void {
  if (usd <= 0) return;
  const current = getBucket();
  current.spentUsd += usd;
}

export function getMaxOutputTokens(): number {
  return MAX_OUTPUT_TOKENS;
}
