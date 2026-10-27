import OpenAI from "openai";
import { getOpenAiEmbeddingModel, requireEnv } from "./env";

let client: OpenAI | null = null;

export function getOpenAI(): OpenAI {
  if (!client) {
    client = new OpenAI({ apiKey: requireEnv("OPENAI_API_KEY") });
  }
  return client;
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];

  const openai = getOpenAI();
  const model = getOpenAiEmbeddingModel();
  const vectors: number[][] = [];

  const batchSize = 64;
  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const response = await openai.embeddings.create({
      model,
      input: batch,
    });
    const sorted = [...response.data].sort((a, b) => a.index - b.index);
    for (const item of sorted) {
      vectors.push(item.embedding);
    }
  }

  return vectors;
}

export async function embedQuery(text: string): Promise<number[]> {
  const [vector] = await embedTexts([text]);
  if (!vector) {
    throw new Error("Failed to embed query");
  }
  return vector;
}
