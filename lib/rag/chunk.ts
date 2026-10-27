import type { ChunkRecord, CorpusDocument } from "./types";

const CHUNK_SIZE = 700;
const CHUNK_OVERLAP = 100;

/** Strip MDX/JSX noise so embeddings see mostly prose. */
export function cleanMdxBody(raw: string): string {
  return raw
    .replace(/^---[\s\S]*?---\s*/, "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[A-Za-z][\w.]*[^>]*\/>/g, " ")
    .replace(/<\/?[A-Za-z][\w.]*[^>]*>/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_~`>#]+/g, " ")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

export function chunkText(text: string): string[] {
  const normalized = text.trim();
  if (!normalized) return [];

  if (normalized.length <= CHUNK_SIZE) {
    return [normalized];
  }

  const chunks: string[] = [];
  let start = 0;

  while (start < normalized.length) {
    let end = Math.min(start + CHUNK_SIZE, normalized.length);

    if (end < normalized.length) {
      const slice = normalized.slice(start, end);
      const breakAt = Math.max(
        slice.lastIndexOf("\n\n"),
        slice.lastIndexOf(". "),
        slice.lastIndexOf(" "),
      );
      if (breakAt > CHUNK_SIZE * 0.4) {
        end = start + breakAt + (slice[breakAt] === "." ? 1 : 0);
      }
    }

    const piece = normalized.slice(start, end).trim();
    if (piece) chunks.push(piece);

    if (end >= normalized.length) break;
    start = Math.max(0, end - CHUNK_OVERLAP);
  }

  return chunks;
}

export function documentsToChunks(docs: CorpusDocument[]): ChunkRecord[] {
  const records: ChunkRecord[] = [];

  for (const doc of docs) {
    const cleaned =
      doc.source === "cv" ? doc.text.trim() : cleanMdxBody(doc.text);
    const pieces = chunkText(cleaned);

    pieces.forEach((text, chunkIndex) => {
      records.push({
        id: `${doc.locale}:${doc.source}:${doc.slug}:${chunkIndex}`,
        text,
        source: doc.source,
        locale: doc.locale,
        slug: doc.slug,
        title: doc.title,
        chunkIndex,
      });
    });
  }

  return records;
}
