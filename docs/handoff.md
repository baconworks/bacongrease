---
status: active
date: 2026-07-20
tags: [meta, handoff]
---

# Handoff — start here for a new session

A point-in-time snapshot (dated above). Overwrite it at the end of each working session. The durable
specs are [`../CLAUDE.md`](../CLAUDE.md) (what this is, commands, conventions, decisions), the
[`../README.md`](../README.md) (human-facing intro/setup), and the [ADRs](./adr/README.md).

## Setup (fresh clone)

```bash
nvm use            # Node 20.20.0 (.nvmrc); a hard floor — sass CLI needs ESM chokidar
corepack enable    # Yarn 4 per packageManager
yarn install
yarn storybook     # dev explorer → http://localhost:6006
yarn typecheck && yarn build-storybook   # the "does it all compile" gate
yarn build         # build both packages to dist/
```

## Where we are

A **Yarn 4 monorepo**: `@bacongrease/styles` (SCSS design system) + `@bacongrease/components` (React
primitives — button, dropdown, hamburger, icon, linear-gradient, link, modal, side-drop, sidenav,
spinner, plus the `cleanClasses` util). Storybook is the dev/dogfooding environment. Extracted from
the ac-booking app; being generically re-proven.

**Recent — design tokens + theming (ADR-0003).** `_tokens.scss` now emits the whole design system as
**runtime CSS custom properties** at `:root`, in two tiers: palette **primitives** (`--color-*`) →
**semantic roles** (`--foreground`, `--accent`, `--danger`, …) that flip per theme. Plus full scales:
a **golden-ratio** type scale (step √φ; Elements of Typographic Style), 4px spacing, radius, an
elevation scale (the layered "smooth shadow" = `--shadow-md`), z-index, motion, container widths,
control heights, a readable `--measure`. **Theming:** light at `:root`, dark via
`prefers-color-scheme` + a `[data-theme]` override. Everything is overridable by the consuming app.
Colors moved to **OKLCH** (perceptually uniform → accessible contrast is easier; author in Leonardo,
export OKLCH). Added a **system/status** color family (success/warning/danger/info); renamed the
client-named `ac` family → `custom`; removed the superseded `*Transparent` families (use `color-mix`).
The base reset consumes tokens (themed body, `text-wrap`, `prefers-reduced-motion`). **Button's solid
primary** variant migrated to tokens as the first audit-on-intake (themes via `--accent`, `color-mix`
hover); other variants/components migrate as adopted. Consumed live by **`sales-platform/web`** (rebuild
here → `web` picks up `dist/`).

**Earlier:** ADR-0002 — the components build **preserves `'use client'` per-module**
(`preserveModules` + `rollup-preserve-directives`), so `@bacongrease/components` imports into Next.js
App-Router **Server Components** (how `sales-platform/web` consumes it via Yarn `portal:`).

**Also recent (Button correctness + a11y):** surfaced while first consuming `Button` in `web/`.
Decorative `image` now `alt=""` (was double-announced); `ButtonProps` now `extends
ComponentPropsWithRef` and the component **forwards `ref`** (React 19 — no `forwardRef`), so it can
be focused or given a ref; a handler the caller passes (`onMouseEnter`/`onMouseLeave`) now **also
runs** instead of being silently overwritten.
Two conventions were codified in `CLAUDE.md` from this (owner preferences): **accessibility is a
requirement (WCAG 2.1 AA)** for every component, and **a component built around one HTML element
extends `ComponentPropsWithRef<'el'>`** (forward the `ref`; also run the caller's event handlers;
components made of several elements give each part its own named props instead). No ADR —
component correctness, not an architectural decision.

**Also recent — Sidenav + Hamburger (brought in for `sales-platform/web`).** Tokenized (themes; a
subtree can be theme-pinned since `[data-theme]` now targets any element, not just `:root`). The
**Sidenav** takes a flat list OR `sections` (the app owns role/plan gating, not the nav), uses a
**hamburger-pin** toggle with a `toggle` prop (`none`/`x`/`chevron`), exposes adjustable geometry as
CSS vars (default 48px accessible rail), and no longer hardcodes its grid placement. The action slot
was **removed** (deferred — belongs as a nav-item CTA, not the general Button). **Hamburger** audit
fixes (tokenized bars, `type=button`, real ☰↔✕ morph, invalid CSS dropped). Flagged: the **`Icon`**
component has a latent sizing bug (unsized `.icon` span) to fix on its own intake.

## What's next

- **Migrate remaining components to tokens (audit-on-intake).** Done: Button (primary), Sidenav,
  Hamburger. Still on raw `getColor()`: other Button variants, dropdown / modal / side-drop / link /
  spinner / icon. Migrate each as it's pulled into `web/` — reworking `color.scale()` hovers to
  `color-mix(in oklch, …)` (SCSS color functions can't touch a CSS variable).
- **Regenerate system-color ramps in Leonardo** against real WCAG contrast targets (current ones are
  even OKLCH seeds).
- **Component audit on intake.** The components predate this workflow. When one is *brought into*
  `web/` (or extracted further), audit it for reusability / refactoring and flag best-practice issues
  — don't just import it as-is.
- **JSON:API deserializer (extraction candidate).** A generic JSON:API → flat-typed-object
  deserializer (Zod-validated) is being built and proven in `sales-platform/web`. Per build-here-
  extract-when-proven, lift it here (e.g. a `@bacongrease/json-api` package) once it's stable.
- **Cross-repo DoD.** Changes driven by / affecting `web/` must satisfy both repos' DoD — an ADR +
  doc updates in each. See [`../CLAUDE.md`](../CLAUDE.md) "Definition of done".
