import type { ChatSource, RetrievedChunk } from "./types";

export function dedupeSources(chunks: RetrievedChunk[]): ChatSource[] {
  const seen = new Set<string>();
  const sources: ChatSource[] = [];

  for (const chunk of chunks) {
    const key = `${chunk.source}:${chunk.slug}`;
    if (seen.has(key)) continue;
    seen.add(key);
    sources.push({
      label: chunk.title,
      source: chunk.source,
      slug: chunk.source === "cv" ? undefined : chunk.slug,
    });
  }

  return sources;
}

export function formatContext(chunks: RetrievedChunk[]): string {
  if (chunks.length === 0) return "";

  return chunks
    .map((chunk, index) => {
      return `[${index + 1}] ${chunk.title} (${chunk.source}/${chunk.slug})\n${chunk.text}`;
    })
    .join("\n\n");
}

export function buildSystemPrompt(locale: "en" | "es"): string {
  const language =
    locale === "es"
      ? "Responde en español."
      : "Answer in English.";

  return [
    "You are a portfolio assistant for Santiago Acevedo.",
    "Answer ONLY using the provided context fragments about his CV, projects, and notes.",
    "If the context does not contain enough information, say clearly that you do not know.",
    "Do not invent clients, metrics, employers, or achievements.",
    "Keep answers concise and concrete.",
    language,
  ].join(" ");
}
