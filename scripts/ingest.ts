import { documentsToChunks } from "../lib/rag/chunk";
import { embedTexts } from "../lib/rag/embeddings";
import { requireEnv } from "../lib/rag/env";
import { loadCorpus } from "../lib/rag/load-corpus";
import { deleteAllVectors, upsertChunks } from "../lib/rag/pinecone";

async function main() {
  requireEnv("OPENAI_API_KEY");
  requireEnv("PINECONE_API_KEY");
  requireEnv("PINECONE_INDEX");

  console.log("Loading corpus from docs/content…");
  const docs = await loadCorpus();
  console.log(`Loaded ${docs.length} document(s).`);

  const chunks = documentsToChunks(docs);
  console.log(`Split into ${chunks.length} chunk(s).`);

  if (chunks.length === 0) {
    console.error("No chunks to ingest. Aborting.");
    process.exit(1);
  }

  console.log("Clearing existing vectors…");
  await deleteAllVectors();

  console.log("Generating embeddings…");
  const vectors = await embedTexts(chunks.map((c) => c.text));

  console.log("Upserting to Pinecone…");
  await upsertChunks(chunks, vectors);

  console.log(`Done. Uploaded ${chunks.length} chunk(s).`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
