import { Pinecone, type RecordMetadata } from "@pinecone-database/pinecone";
import { requireEnv } from "./env";
import type {
  ChunkRecord,
  CorpusLocale,
  CorpusSource,
  RetrievedChunk,
} from "./types";

type ChunkMetadata = RecordMetadata & {
  text: string;
  source: CorpusSource;
  locale: CorpusLocale;
  slug: string;
  title: string;
  chunkIndex: number;
};

let pinecone: Pinecone | null = null;

function getPinecone(): Pinecone {
  if (!pinecone) {
    pinecone = new Pinecone({ apiKey: requireEnv("PINECONE_API_KEY") });
  }
  return pinecone;
}

export function getPineconeIndex() {
  return getPinecone().index({ name: requireEnv("PINECONE_INDEX") });
}

export async function upsertChunks(
  chunks: ChunkRecord[],
  vectors: number[][],
): Promise<void> {
  if (chunks.length !== vectors.length) {
    throw new Error("Chunk and vector counts do not match");
  }

  const index = getPineconeIndex();
  const batchSize = 100;

  for (let i = 0; i < chunks.length; i += batchSize) {
    const slice = chunks.slice(i, i + batchSize);
    const records = slice.map((chunk, offset) => {
      const values = vectors[i + offset];
      if (!values) {
        throw new Error(`Missing embedding for chunk ${chunk.id}`);
      }
      const metadata: ChunkMetadata = {
        text: chunk.text,
        source: chunk.source,
        locale: chunk.locale,
        slug: chunk.slug,
        title: chunk.title,
        chunkIndex: chunk.chunkIndex,
      };
      return {
        id: chunk.id,
        values,
        metadata,
      };
    });
    await index.upsert({ records });
  }
}

export async function deleteAllVectors(): Promise<void> {
  const index = getPineconeIndex();
  await index.deleteAll();
}

export async function queryChunks(
  vector: number[],
  locale: CorpusLocale,
  topK = 5,
): Promise<RetrievedChunk[]> {
  const index = getPineconeIndex();
  const result = await index.query({
    vector,
    topK,
    includeMetadata: true,
    filter: { locale: { $eq: locale } },
  });

  const matches = result.matches ?? [];
  const chunks: RetrievedChunk[] = [];

  for (const match of matches) {
    const meta = match.metadata as ChunkMetadata | undefined;
    if (!meta?.text || !meta.source || !meta.locale || !meta.slug || !meta.title) {
      continue;
    }
    chunks.push({
      text: String(meta.text),
      source: meta.source as CorpusSource,
      locale: meta.locale as CorpusLocale,
      slug: String(meta.slug),
      title: String(meta.title),
      score: match.score ?? 0,
    });
  }

  return chunks;
}
