import { join } from "node:path";
import { readFile } from "node:fs/promises";

type FontCache = {
  display: ArrayBuffer;
  mono: ArrayBuffer;
};

let cache: FontCache | null = null;

/**
 * Load brand fonts for ImageResponse.
 * Prefer local files under public/fonts if present; else fetch TTF from jsDelivr.
 */
export async function loadOgFonts(): Promise<FontCache> {
  if (cache) return cache;

  const localDisplay = join(
    process.cwd(),
    "public/fonts/SpaceGrotesk-Bold.ttf",
  );
  const localMono = join(
    process.cwd(),
    "public/fonts/JetBrainsMono-Medium.ttf",
  );

  try {
    const [display, mono] = await Promise.all([
      readFile(localDisplay),
      readFile(localMono),
    ]);
    cache = {
      display: display.buffer.slice(
        display.byteOffset,
        display.byteOffset + display.byteLength,
      ),
      mono: mono.buffer.slice(
        mono.byteOffset,
        mono.byteOffset + mono.byteLength,
      ),
    };
    return cache;
  } catch {
    // Fall through to CDN
  }

  const [displayRes, monoRes] = await Promise.all([
    fetch(
      "https://cdn.jsdelivr.net/fontsource/fonts/space-grotesk@5.2.5/latin-700-normal.ttf",
    ),
    fetch(
      "https://cdn.jsdelivr.net/fontsource/fonts/jetbrains-mono@5.2.5/latin-500-normal.ttf",
    ),
  ]);

  if (!displayRes.ok || !monoRes.ok) {
    throw new Error("Failed to load OG fonts");
  }

  cache = {
    display: await displayRes.arrayBuffer(),
    mono: await monoRes.arrayBuffer(),
  };
  return cache;
}
