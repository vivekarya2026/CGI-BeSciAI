# src/imports/

These files are **AI context files** read by Figma Make during code generation.
They are **NOT** imported by any TypeScript or React source file at runtime.

| File | Purpose |
|------|---------|
| `design-system-guidelines.md` | CGI design system rules (colors, typography, spacing, components) |
| `technical-specs-archetypes.md` | Archetype system specification (6 archetypes, traits, colors) |
| `color-palette.css` | Color token reference for AI-assisted code generation |

> Do not delete these files — they guide AI-assisted code generation in this project.
> The canonical design system reference for developers is also available at
> [`tailwind.config.ts`](../../tailwind.config.ts) and [`../styles/design-tokens.css`](../styles/design-tokens.css).
