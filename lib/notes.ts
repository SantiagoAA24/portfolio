import fs from "node:fs/promises";
import path from "node:path";
import { compileMDX } from "next-mdx-remote/rsc";
import type { ReactNode } from "react";
import { noteMdxComponents } from "@/components/mdx/notes";

export const NOTE_SLUGS = [
  "semantic-search-chatbot",
  "hexagonal-backend",
  "physics-debugging",
] as const;

export type NoteSlug = (typeof NOTE_SLUGS)[number];

export const NOTE_CATEGORIES = ["AI", "Architecture", "Career"] as const;

export type NoteCategory = (typeof NOTE_CATEGORIES)[number];

export type NoteFrontmatter = {
  title: string;
  summary: string;
  category: NoteCategory;
  date: string;
  featured: boolean;
  nextSlug: NoteSlug | null;
  draft: boolean;
};

export type NoteMeta = NoteFrontmatter & {
  slug: NoteSlug;
  readingMinutes: number;
};

const WORDS_PER_MINUTE = 200;

export function isNoteSlug(value: string): value is NoteSlug {
  return (NOTE_SLUGS as readonly string[]).includes(value);
}

export function isNoteCategory(value: string): value is NoteCategory {
  return (NOTE_CATEGORIES as readonly string[]).includes(value);
}

export function getNoteSlugs(): readonly NoteSlug[] {
  return NOTE_SLUGS;
}

function contentPath(locale: string, slug: NoteSlug): string {
  return path.join(
    process.cwd(),
    "docs/content/notes",
    locale,
    `${slug}.mdx`,
  );
}

export function readingTimeMinutes(source: string): number {
  const withoutFrontmatter = source.replace(/^---[\s\S]*?---\s*/, "");
  const words = withoutFrontmatter
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

async function readSource(locale: string, slug: NoteSlug): Promise<string> {
  return fs.readFile(contentPath(locale, slug), "utf8");
}

export async function getNote(
  locale: string,
  slug: NoteSlug,
): Promise<{
  frontmatter: NoteFrontmatter;
  content: ReactNode;
  readingMinutes: number;
}> {
  const source = await readSource(locale, slug);
  const { content, frontmatter } = await compileMDX<NoteFrontmatter>({
    source,
    components: noteMdxComponents,
    options: { parseFrontmatter: true },
  });

  return {
    content,
    frontmatter,
    readingMinutes: readingTimeMinutes(source),
  };
}

export async function getNoteFrontmatter(
  locale: string,
  slug: NoteSlug,
): Promise<NoteFrontmatter> {
  const { frontmatter } = await getNote(locale, slug);
  return frontmatter;
}

export async function getAllNoteMeta(locale: string): Promise<NoteMeta[]> {
  const notes = await Promise.all(
    NOTE_SLUGS.map(async (slug) => {
      const source = await readSource(locale, slug);
      const { frontmatter } = await compileMDX<NoteFrontmatter>({
        source,
        components: noteMdxComponents,
        options: { parseFrontmatter: true },
      });

      return {
        ...frontmatter,
        slug,
        readingMinutes: readingTimeMinutes(source),
      };
    }),
  );

  return notes;
}

export function filterNotesByCategory(
  notes: NoteMeta[],
  category: NoteCategory | "All",
): NoteMeta[] {
  if (category === "All") {
    return notes;
  }
  return notes.filter((note) => note.category === category);
}

export function getFeaturedNote(
  notes: NoteMeta[],
  category: NoteCategory | "All",
): NoteMeta | undefined {
  if (category !== "All" && category !== "AI") {
    return undefined;
  }
  return notes.find((note) => note.featured);
}
