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

**Recent:** ADR-0002 — the components build now **preserves `'use client'` per-module**
(`preserveModules` + `rollup-preserve-directives`, per-format output array). Components are client
boundaries; pure utils (`cleanClasses`) stay server-safe. This unblocks importing
`@bacongrease/components` into **Next.js App-Router Server Components** — which is how the
**`sales-platform/web`** app consumes it (linked locally via Yarn `portal:`; rebuild here → `web`
picks up `dist/`).

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

## What's next

- **Component audit on intake.** The components predate this workflow. When one is *brought into*
  `web/` (or extracted further), audit it for reusability / refactoring and flag best-practice issues
  — don't just import it as-is.
- **JSON:API deserializer (extraction candidate).** A generic JSON:API → flat-typed-object
  deserializer (Zod-validated) is being built and proven in `sales-platform/web`. Per build-here-
  extract-when-proven, lift it here (e.g. a `@bacongrease/json-api` package) once it's stable.
- **Cross-repo DoD.** Changes driven by / affecting `web/` must satisfy both repos' DoD — an ADR +
  doc updates in each. See [`../CLAUDE.md`](../CLAUDE.md) "Definition of done".
