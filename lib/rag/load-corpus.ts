import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { PDFParse } from "pdf-parse";
import type { CorpusDocument, CorpusLocale } from "./types";

const LOCALES: CorpusLocale[] = ["en", "es"];
const CONTENT_ROOT = path.join(process.cwd(), "docs/content");

async function listMdxFiles(dir: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries
      .filter((e) => e.isFile() && e.name.endsWith(".mdx"))
      .map((e) => path.join(dir, e.name));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

async function loadWorkDocs(): Promise<CorpusDocument[]> {
  const docs: CorpusDocument[] = [];

  for (const locale of LOCALES) {
    const files = await listMdxFiles(path.join(CONTENT_ROOT, "work", locale));
    for (const file of files) {
      const raw = await fs.readFile(file, "utf8");
      const { data, content } = matter(raw);
      const slug = path.basename(file, ".mdx");
      const title =
        typeof data.title === "string" && data.title.trim()
          ? data.title.trim()
          : slug;
      const lead = typeof data.lead === "string" ? data.lead : "";
      const text = [title, lead, content].filter(Boolean).join("\n\n");
      docs.push({
        source: "work",
        locale,
        slug,
        title,
        text,
      });
    }
  }

  return docs;
}

async function loadNoteDocs(): Promise<CorpusDocument[]> {
  const docs: CorpusDocument[] = [];

  for (const locale of LOCALES) {
    const files = await listMdxFiles(path.join(CONTENT_ROOT, "notes", locale));
    for (const file of files) {
      const raw = await fs.readFile(file, "utf8");
      const { data, content } = matter(raw);
      if (data.draft === true) continue;

      const slug = path.basename(file, ".mdx");
      const title =
        typeof data.title === "string" && data.title.trim()
          ? data.title.trim()
          : slug;
      const summary = typeof data.summary === "string" ? data.summary : "";
      const text = [title, summary, content].filter(Boolean).join("\n\n");
      docs.push({
        source: "notes",
        locale,
        slug,
        title,
        text,
      });
    }
  }

  return docs;
}

async function extractPdfText(filePath: string): Promise<string> {
  const buffer = await fs.readFile(filePath);
  const parser = new PDFParse({ data: new Uint8Array(buffer) });
  try {
    const result = await parser.getText();
    return result.text.trim();
  } finally {
    await parser.destroy();
  }
}

async function loadCvDocs(): Promise<CorpusDocument[]> {
  const docs: CorpusDocument[] = [];
  const cvs: { locale: CorpusLocale; filename: string; title: string }[] = [
    { locale: "en", filename: "cv-en.pdf", title: "CV (EN)" },
    { locale: "es", filename: "cv-es.pdf", title: "CV (ES)" },
  ];

  for (const cv of cvs) {
    const filePath = path.join(CONTENT_ROOT, cv.filename);
    try {
      const text = await extractPdfText(filePath);
      if (!text) continue;
      docs.push({
        source: "cv",
        locale: cv.locale,
        slug: cv.filename.replace(/\.pdf$/i, ""),
        title: cv.title,
        text,
      });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") continue;
      throw error;
    }
  }

  return docs;
}

export async function loadCorpus(): Promise<CorpusDocument[]> {
  const [work, notes, cvs] = await Promise.all([
    loadWorkDocs(),
    loadNoteDocs(),
    loadCvDocs(),
  ]);
  return [...work, ...notes, ...cvs];
}
