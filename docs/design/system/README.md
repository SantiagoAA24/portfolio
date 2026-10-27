Terminal is the design system for Santiago Acevedo's portfolio site: a dark, technical, mono-accented look for a fullstack engineer who builds AI products. Every value lives in `tokens.json`; pages and components read CSS custom properties generated from it and never hard-code a color, size or space.

## Content fundamentals

- Write in the first person singular and in English first; Spanish is a full translation, not a different voice. "I build AI products end to end." Never "we".
- Be concrete. Name the stack, the role and the result: "Designed and built end to end with the OpenAI API." No filler adjectives, no invented numbers.
- Where a real fact is still missing, write it in square brackets so it cannot ship by accident: "Outcome: [add a measurable result]".
- Headlines are sentences in sentence case and end with a period only when they are a full statement ("Three projects, built end to end."). Section labels are numbered and uppercase: "01 — SELECTED WORK".
- Links and buttons end with a typographic arrow: `→` goes forward, `←` goes back, `↓` downloads, `↗` leaves the site. No emoji anywhere.
- Name clients by sector when the work is confidential: "Energy-sector engineering platform".

## Visual foundations

**Color.** The page is `bg`. Cards and bubbles sit on `surface`; alternate bands use `surface-sunken`. Headings use `text`, paragraphs `text-body`, metadata `text-muted`. `accent` is the only highlight: one or two accent moments per screen (a word in the headline, links, the primary button, diagram highlights). Text on an accent fill is `on-accent`. To try another accent, set `data-accent="cyan"` or `data-accent="lavender"` on the root; do not edit pages.

**Type.** Headlines use `h1`, `h2`, `h3` in Space Grotesk. Body copy uses `body`, `body-lg` and `lead` in Inter. Everything that reads as a label, a path, a date, a tag or a button is mono: `label`, `meta`, `button`. One `h1` per page. Section labels use `label` in `accent`; metadata uses `meta` in `text-muted`.

**Spacing and layout.** Space comes only from the `space-*` scale. Pages use `container-max` with `container-gutter` on each side; home sections get `space-22` above and below, hero and contact `space-24`. Case-study text stops at `measure-article`, notes at `measure-note`. Rows wrap with flex and never rely on a fixed width, so phone layouts stack on their own.

**Borders, not shadows.** Structure comes from 1px `line` borders. Controls use `line-strong`. Never add shadows, gradients or blur. Corners are square (`radius-0`); only the portrait and status dots use `radius-full`.

**States.** Hover lowers a link or button to 85% opacity. Keyboard focus draws a solid 2px `accent` outline with a 3px offset. An active nav link or filter uses `accent`, never a different weight. Form fields use `line-strong` borders and `surface` or `bg` fills.

**Imagery.** The only photograph is the portrait: a circle with a 2px `accent` ring. Client work is never shown as screenshots; show architecture as diagrams built from boxes and arrows (see Pipeline). Alt text is always written.

**Motion.** None beyond the hover change. Do not animate layout.

## Iconography

There is no icon set. Use the text glyphs `→ ← ↓ ↗` in the mono face and small square or round marks built from `accent` (the logo square, status dots). Do not draw icons, and do not use emoji.

## Components

- `Button`: primary (accent fill) and outline. One primary button per screen section.
- `Chip`: a small bordered tag for technologies and filters.
- `Label`: the uppercase mono caption above a heading or under a number.
- `Card`: a bordered `surface` container for decisions, notes and forms.
- `Pipeline`: the architecture diagram: bordered steps joined by accent arrows.
- `Stat`: a big accent number with a mono caption.

Component styles live in `components/bundle.css` and use only token variables.
