# CLAUDE.md — bacongrease

Guidance for Claude Code working in this repo. Read this first; it's the handoff.

## What this is

**Bacongrease** is Carter's personal component library + SCSS design system —
"greases the wheels of development." It was extracted from the `ac-booking-ui-v1`
Next.js app (sibling repo at `../ac-booking/ac-booking-ui-v1`) by pulling out the
generic, reusable pieces and **decoupling them from the app** so they can be
imported into other projects.

It is a **pnpm monorepo**. Storybook (React + Vite) at the repo root is the
development, documentation, and dogfooding environment.

## Layout

```
bacongrease/
├── packages/
│   ├── styles/       @bacongrease/styles      SCSS design system (no build yet)
│   │   └── src/      _colors _functions _mixins _variables _typography
│   │                 _base _utils index.scss
│   └── components/   @bacongrease/components   React primitives
│       └── src/
│           ├── index.ts                        barrel (all exports)
│           ├── utils/clean-classes.ts          BEM className helper (bundled)
│           └── <component>/                     button icon linear-gradient
│                                                spinner hamburger modal dropdown
│                                                side-drop link sidenav
├── .storybook/       main.ts preview.ts preview-head.html
├── pnpm-workspace.yaml  tsconfig.base.json  tsconfig.json
└── README.md         (human-facing; this file is agent-facing)
```

Each component folder holds `x.component.tsx`, `x.styles.scss`,
`x.stories.tsx`, plus `types/` / `data/` / `styles/` / `helpers/` where the
original had them (button and linear-gradient are the elaborate ones).

## Commands

```bash
pnpm install
pnpm storybook          # dev explorer → http://localhost:6006
pnpm build-storybook    # static build — the main "does it all compile" check
pnpm typecheck          # tsc --noEmit across the workspace
```

**Verify changes with BOTH `pnpm typecheck` AND `pnpm build-storybook`.** They
catch different things: the Vite/esbuild build transpiles without type-checking
(so it misses type errors), while `tsc` doesn't exercise SCSS resolution or JSX
bundling. Both currently pass. The `"use client"` warnings during the build are
**expected and harmless** — those are Next.js directives that Vite ignores.

## Conventions (match these)

- **Code style: spaces inside `{ }` and `[ ]`.** `{ ...props }`,
  `[ open ? 'a' : 'b' ]`, `import { useState }`, `map(( x, i ) => …)`. Empty
  `{}`/`[]` stay tight; call parens get no inner spaces. This is a hard
  preference — apply it to all JS/TS/TSX. JSON files stay conventional.
- **SCSS + BEM.** `block`, `block_element`, `block--modifier`. Keep it. The
  rationale (SCSS is *not* a dinosaur here because the value is compile-time
  logic — gradient generation, color scaling, class generation — which native
  CSS can't do) is settled; don't relitigate it unless asked.
- **File naming:** `name.component.tsx`, `name.styles.scss`, `name.stories.tsx`,
  `name.types.ts`. SCSS partials are `_name.scss`.
- **Components** are default-exported; the barrel re-exports them as named
  (`Button`, `Modal`, …) plus their prop types.

## How SCSS resolution works (important)

Component stylesheets reference the design system with **bare specifiers**:
`@use 'mixins' as globalMixins;`, `@use 'functions';`, `@use 'variables';`.
These resolve because `.storybook/main.ts` sets
`css.preprocessorOptions.scss.loadPaths` to `packages/styles/src`. Inside the
styles package, files use relative `@use './variables'` etc.

Consequence: **any future bundler/build must reproduce those loadPaths**, or the
bare `@use`s won't resolve. This is the main open design question for publishing
(see TODO). Intra-package `@use '../hamburger/hamburger.styles'` (sidenav) uses
normal relative paths and is fine.

## Decoupling decisions already made (don't undo without reason)

These changed vs. the source app during extraction:

- **Button** — `uuid` → React 19 `useId()`; `next/image` → plain `<img>`.
- **Link** — `next/link` → polymorphic `as` prop (defaults to `<a>`; pass a
  router link component to keep client-side nav). Gained a small base stylesheet
  it didn't have before.
- **Sidenav** — removed the app's `Compose`, `useAppContext`, `iconMap`,
  form-options, and `next/navigation`. Now: `action` is a `ReactNode` slot,
  active state comes from an optional `pathname` prop (or per-link `active`),
  link icons come from `linksData`, and `linkAs` forwards a router link.
- **Modal** — falls back to `document.body` when `#modal-root` is absent.
- **Styles** — fixed the `xyFromRadians` bug (returned undefined vars), moved
  global `pi()/cos()/sin()/nth()` to `sass:math` / `sass:list` module functions,
  and removed the app-specific root grid from the `body` reset.
- `cleanClasses` was copied from the app's `global.helpers` into
  `components/src/utils/clean-classes.ts`.

Known latent quirk carried over faithfully: the greyscale button-icon gradient
references `stop-color-grey-*` classes, but linear-gradient generates
`stop-color-greyscale-*`. Primary/secondary/tertiary gradients work; greyscale
icon gradient is a pre-existing no-op. Left as-is intentionally.

## Config notes

- `tsconfig.base.json` deliberately does **not** set `declaration` or
  `noUncheckedIndexedAccess`. `declaration` was removed because there's no build
  yet and it triggered "cannot be named" portability errors on Storybook `meta`
  inference; `noUncheckedIndexedAccess` was removed because the ported code
  wasn't written for it. Re-add `declaration` in a dedicated build tsconfig when
  the publish pipeline lands.
- Stories for components with required props (Modal, Dropdown, SideDrop,
  LinearGradient) put placeholder `args` on the `meta` and drive real state via
  `render`. Dropdown/SideDrop triggers wrap the Button in a `<span ref=…>`
  because Button doesn't forward a ref.

## Current status & where to pick up

Everything below the line is **done and verified** (typecheck + Storybook build
both green, committed on `main`):

- ✅ Monorepo scaffold, pnpm workspace, git initialized (2 commits)
- ✅ `@bacongrease/styles` — full system ported + modernized
- ✅ `@bacongrease/components` — 10 primitives ported + decoupled + barrel
- ✅ Storybook wired, a story per component

**Not done yet — likely next steps, roughly in priority order:**

1. **Build + publish pipeline.** Right now packages are consumed from source via
   the workspace only; you can't `pnpm add @bacongrease/*` elsewhere. Needs a
   bundler (tsup or Vite lib mode) that emits JS + `.d.ts` and ships/compiles the
   SCSS, and a story for how consumers resolve the bare `@use` specifiers
   (either document loadPaths, or switch component SCSS to
   `@use '@bacongrease/styles/mixins'` scoped specifiers, or a Sass `pkg:`
   importer). Then dogfood by consuming it back into ac-booking.
2. **CSS custom-property token layer.** Expose the palette/key tokens as CSS
   variables so consumers theme at runtime without recompiling Sass. This is the
   recommended upgrade that makes it a real library vs. "my styles."
3. **Port tests.** The source app has Vitest + Testing Library tests for these
   components (`*.component.test.tsx`); they weren't brought over.
4. **Git remote / publish target.** `gh` CLI is NOT installed locally, so nothing
   is pushed. To wire it: `brew install gh` then create+push, or the user creates
   an empty GitHub repo and we add the remote.
5. **Rename the `ac` color family** to something brand-neutral (it's the old app
   brand name; spinner/hamburger/utils reference `getColor(ac, …)`).

## Source of truth for the original components

When porting more components or checking fidelity, the originals live in
`../ac-booking/ac-booking-ui-v1/app/components/<name>/` and the original global
SCSS in `../ac-booking/ac-booking-ui-v1/app/styles/`. Components NOT yet ported
that were floated as candidates: `header`, `table` (deferred — tables resist
genericization). Everything else in that app is app-specific.
