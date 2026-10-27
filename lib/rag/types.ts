export type CorpusSource = "work" | "notes" | "cv";

export type CorpusLocale = "en" | "es";

export type CorpusDocument = {
  source: CorpusSource;
  locale: CorpusLocale;
  slug: string;
  title: string;
  text: string;
};

export type ChunkRecord = {
  id: string;
  text: string;
  source: CorpusSource;
  locale: CorpusLocale;
  slug: string;
  title: string;
  chunkIndex: number;
};

export type RetrievedChunk = {
  text: string;
  source: CorpusSource;
  locale: CorpusLocale;
  slug: string;
  title: string;
  score: number;
};

export type ChatSource = {
  label: string;
  source: CorpusSource;
  slug?: string;
};
