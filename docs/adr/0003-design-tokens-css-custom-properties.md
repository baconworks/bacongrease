---
status: accepted
date: 2026-07-20
tags: [design-system, styles, tokens, theming, color]
---

# 0003 — Design tokens as overridable CSS custom properties (OKLCH + theming)

## Context

`@bacongrease/styles` was a **compile-time** SCSS system: a `$color-families` map read through
`getColor()`, plus one-off SCSS variables. That has two limits the moment a real app consumes it:

- **No runtime theming.** SCSS values are baked at build time, so light/dark (or a per-tenant theme)
  is impossible without recompiling — and the consuming app can't override anything.
- **No system-level vocabulary.** There were raw colours and a few sizing variables, but no semantic
  roles (what's "text" vs "background"), no spacing/type scale, no z-index ladder, no elevation
  scale — so every consumer reinvents those and they drift.

Consuming the library in `sales-platform/web` forced the issue: the app had only hand-rolled CSS and
no way to theme.

## Decision

**Emit a two-tier design-token layer as CSS custom properties, authored from the existing SCSS.**

- **Tier 1 — primitives** (`--color-<family>-<shade>`): the palette, emitted from `$color-families`
  so an app can retune a raw colour. Families: brand (`primary`/`secondary`/`tertiary`), **system/
  status** (`success`/`warning`/`danger`/`info` — a new group, so brand ramps stop moonlighting as
  status), and `greyscale`. The decorative `custom` family (renamed from the old client-specific `ac`)
  stays SCSS-only.
- **Tier 2 — semantic roles** (`--foreground`, `--background`, `--surface`, `--muted`, `--border`,
  `--accent`, `--danger`, …): roles that **point at** primitives and **flip per theme**. Components
  and app CSS read these, never raw hex.
- **Full token set** beyond colour: a 4px **spacing** scale, **radius**, a golden-ratio **type** scale
  (step √φ; display lands on base·φ² ≈ 4.19rem — Elements of Typographic Style), **line-heights**
  (loose = φ), a readable **measure** (66ch), **font weights**, **letter-spacing**, **font families**
  (incl. `--font-mono` for tabular figures), an **elevation** scale (the original layered "smooth
  shadow" = `--shadow-md`), a **z-index** ladder, **container** widths, **control heights**, a
  **motion** scale, and **gradients** (brand only). Everything is a CSS variable → all overridable.
- **Colour space: OKLCH.** The palette and semantic colours are OKLCH — perceptually uniform (equal L
  reads as equally light across hues, so contrast is easier to keep accessible), wider P3 gamut, and
  better `color-mix`/gradient interpolation. Authoring stays in Leonardo (which interpolates in OKLCH
  and exports OKLCH custom properties); derived tints use `color-mix(in oklch, …)`. This supersedes the
  old `*Transparent` colour families (a pre-`color-mix` workaround) — removed.
- **Theming:** light at `:root` by default; dark via `@media (prefers-color-scheme: dark)` (unless the
  root pins `[data-theme="light"]`); an explicit `[data-theme="dark|light"]` on the root always wins,
  so an app can offer a manual switch. Emitted once at the app top level via `@use '@bacongrease/styles'`.
- The base reset now consumes tokens (themed `body`, token type, `text-wrap: balance/pretty`,
  `prefers-reduced-motion`). SCSS remains the **authoring** layer; the tokens are the **runtime** layer.

## Consequences

**Makes easy** — runtime theming (light/dark/per-tenant) with zero recompile; apps override any layer
(one primitive, a role, the spacing step) by redeclaring a variable; a shared vocabulary so components
stop drifting; accessible colour work (OKLCH + Leonardo) and on-demand transparency (`color-mix`).

**Makes hard** — two tiers is more indirection than raw `getColor()`; the seeded system-colour ramps
are stepped evenly in OKLCH, **not** Leonardo-verified, so a shade must be regenerated against real
WCAG targets before it's trusted for text; components still read `getColor()` internally and migrate to
`var(--token)` incrementally (audit-on-intake), so the system isn't fully theme-reactive until they do.

**Locked into** — CSS custom properties as the runtime contract (an app may depend on token names);
OKLCH as the colour notation; a golden-ratio type scale and 4px spacing grid as the default shape;
`[data-theme]` + `prefers-color-scheme` as the theming mechanism.
