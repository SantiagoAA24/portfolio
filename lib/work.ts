import fs from "node:fs/promises";
import path from "node:path";
import { compileMDX } from "next-mdx-remote/rsc";
import type { ReactNode } from "react";
import { mdxComponents } from "@/components/mdx";

export const WORK_SLUGS = [
  "ai-chatbot",
  "robotics-interfaces",
  "akontrol",
] as const;

export type WorkSlug = (typeof WORK_SLUGS)[number];

export type HomeWorkKey = "intelisoft" | "candelasoft" | "akontrol";

export const homeKeyToSlug: Record<HomeWorkKey, WorkSlug> = {
  intelisoft: "ai-chatbot",
  candelasoft: "robotics-interfaces",
  akontrol: "akontrol",
};

export const slugToHomeKey: Record<WorkSlug, HomeWorkKey> = {
  "ai-chatbot": "intelisoft",
  "robotics-interfaces": "candelasoft",
  akontrol: "akontrol",
};

export type ArchitectureStep = {
  label: string;
  accent?: boolean;
};

export type ArchitectureNode =
  | ArchitectureStep
  | { parallel: ArchitectureStep[] };

export type CaseFrontmatter = {
  title: string;
  titleAccent: string;
  lead: string;
  category: string;
  order: number;
  role: string;
  context: string;
  metaThird: {
    label: string;
    value: string;
    accent?: boolean;
  };
  stackSummary: string[];
  builtWith: string[];
  architecture: {
    caption: string;
    rows: ArchitectureNode[][];
  };
  next: {
    kind: "case" | "path";
    slug?: WorkSlug;
    path?: string;
    label: string;
    title: string;
  };
  contactHeadline: string;
};

export function isWorkSlug(value: string): value is WorkSlug {
  return (WORK_SLUGS as readonly string[]).includes(value);
}

export function getWorkSlugs(): readonly WorkSlug[] {
  return WORK_SLUGS;
}

function contentPath(locale: string, slug: WorkSlug): string {
  return path.join(
    process.cwd(),
    "docs/content/work",
    locale,
    `${slug}.mdx`,
  );
}

export async function getCase(
  locale: string,
  slug: WorkSlug,
): Promise<{ frontmatter: CaseFrontmatter; content: ReactNode }> {
  const filePath = contentPath(locale, slug);
  const source = await fs.readFile(filePath, "utf8");

  const { content, frontmatter } = await compileMDX<CaseFrontmatter>({
    source,
    components: mdxComponents,
    options: { parseFrontmatter: true },
  });

  return { content, frontmatter };
}

export async function getCaseFrontmatter(
  locale: string,
  slug: WorkSlug,
): Promise<CaseFrontmatter> {
  const { frontmatter } = await getCase(locale, slug);
  return frontmatter;
}
