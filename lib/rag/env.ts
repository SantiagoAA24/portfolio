export function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getChatMaxInputChars(): number {
  const raw = process.env.CHAT_MAX_INPUT_CHARS;
  const parsed = raw ? Number.parseInt(raw, 10) : 500;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 500;
}

export function getChatRateLimitPerHour(): number {
  const raw = process.env.CHAT_RATE_LIMIT_PER_HOUR;
  const parsed = raw ? Number.parseInt(raw, 10) : 10;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 10;
}

export function getChatDailyBudgetUsd(): number {
  const raw = process.env.CHAT_DAILY_BUDGET_USD;
  const parsed = raw ? Number.parseFloat(raw) : 1;
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 1;
}

export function getOpenAiChatModel(): string {
  return process.env.OPENAI_CHAT_MODEL?.trim() || "gpt-4o-mini";
}

export function getOpenAiEmbeddingModel(): string {
  return process.env.OPENAI_EMBEDDING_MODEL?.trim() || "text-embedding-3-small";
}
