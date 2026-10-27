/** Canonical site origin (no trailing slash). */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) {
    return raw.replace(/\/$/, "");
  }
  return "http://localhost:3000";
}

export const PERSON = {
  shortName: "Santiago Acevedo",
  fullName: "Andres Santiago Acevedo Mancera",
  email: "santiago.acevedo.m24@gmail.com",
  brand: "santiago.acevedo",
  linkedInUrl:
    "https://www.linkedin.com/in/andres-santiago-acevedo-mancera",
  portraitPath: "/portrait.png",
  locality: "Bogotá",
  country: "CO",
} as const;

export function personImageUrl(): string {
  return `${getSiteUrl()}${PERSON.portraitPath}`;
}

export function personEmailMailto(): string {
  return `mailto:${PERSON.email}`;
}
