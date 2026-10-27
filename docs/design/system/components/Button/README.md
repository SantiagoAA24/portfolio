A square mono button in two forms: a filled `btn-primary` and an outlined `btn-outline`.

Render it as an `<a>` for navigation and a `<button>` for actions, with class `btn` plus the form. The consumer provides the label, which ends with an arrow glyph when it navigates (`Contact me →`, `Download CV ↓`).

- Use one `btn-primary` per section, for the action you most want taken: contact, or download the CV.
- Pair it with a `btn-outline` for the secondary action.
- Do not round the corners, add shadows or change the fill; swap the accent through `data-accent` instead.
- Keep the visible focus outline.
