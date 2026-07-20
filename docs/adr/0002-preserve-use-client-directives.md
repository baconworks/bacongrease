---
status: accepted
date: 2026-07-20
tags: [decision, build, react, nextjs]
---

# 0002 — Preserve `'use client'` per-module so components import into RSCs

## Context

`@bacongrease/components` is dogfooded by a Next.js (App Router) app. The Vite library build bundled
every component into a single `dist/index.js` and, in doing so, **dropped the per-component
`'use client'` directives** (Vite/esbuild treats them as ordinary string statements and strips them
when merging modules). Result: importing the barrel into a Next.js **Server Component** failed —
`useState`/`useEffect` reached a server module with no client boundary.

Two ways out were considered. A blanket `'use client'` **banner** on the bundled entry is one line,
but it marks the *entire* package a client boundary — dragging pure utilities (`cleanClasses`) behind
it so they can't be used in Server Components. That's backwards: pure utils should stay server-safe.

## Decision

**Preserve each module's own directive.** Build the components package with Rollup `preserveModules`
(one output file per source module) plus **`rollup-preserve-directives`**, which keeps the
`'use client'` at the top of the modules that declare it and adds none to the ones that don't. A
per-format output **array** is required (ES + CJS) because `entryFileNames` receives the chunk, which
has no `format` field, so the extension can't be chosen from a callback.

- Interactive components (`Button`, `Modal`, …) → their output keeps `'use client'` → **client boundaries**.
- Pure modules (`cleanClasses`, types) → no directive → **server-safe**, importable into RSCs.
- The barrel (`src/index.ts` → `dist/index.js` / `.cjs`) re-exports everything, so the package
  `exports` map and public API are unchanged. Theming stays in `@bacongrease/styles` (pure SCSS/CSS,
  already server-safe).

## Consequences

**Makes easy**

- The barrel is "smart": `import { Button }` is a client boundary, `import { cleanClasses }` is
  server-safe — both from `@bacongrease/components`, into any Next.js component.
- Per-module output improves tree-shaking (consumers pull only what they import).

**Makes hard**

- The build no longer emits a single file — `dist/` is now a mirror of `src/` per format. Larger file
  count; anything that assumed one bundle must adjust.
- The two-format output must stay an array (the `entryFileNames` chunk has no `format`); a future
  refactor that reverts to a single output object silently drops one format.

**Locked into**

- `preserveModules` + `rollup-preserve-directives` as the components build shape, and per-module
  directive semantics as the public contract (consumers rely on `cleanClasses` being server-safe).
