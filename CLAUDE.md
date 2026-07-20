# CLAUDE.md — bacongrease

Guidance for Claude Code working in this repo. Read this first; it's the handoff.

## What this is

**Bacongrease** is Carter's personal component library + SCSS design system —
"greases the wheels of development." It was extracted from the `ac-booking-ui-v1`
Next.js app (sibling repo at `../ac-booking/ac-booking-ui-v1`) by pulling out the
generic, reusable pieces and **decoupling them from the app** so they can be
imported into other projects.

It is a **Yarn 4 monorepo** (node-modules linker). Storybook (React + Vite) at the repo root is the
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
├── .yarnrc.yml  .nvmrc  tsconfig.base.json  tsconfig.json
└── README.md         (human-facing; this file is agent-facing)
```

Each component folder holds `x.component.tsx`, `x.styles.scss`,
`x.stories.tsx`, plus `types/` / `data/` / `styles/` / `helpers/` where the
original had them (button and linear-gradient are the elaborate ones).

## Commands

Toolchain: **Node ≥ 20.19** (`.nvmrc` pins 20.20.0) and **Yarn 4** (Corepack; the
root `packageManager` field pins the version). Node 20.19 is a hard floor — the
`sass` CLI `require()`s an ESM-only `chokidar`, which older Node can't load (see
ADR [`0001`](./docs/adr/0001-yarn4-node20-toolchain.md)).

```bash
nvm use                 # Node 20.20.0 per .nvmrc
yarn install
yarn storybook          # dev explorer → http://localhost:6006
yarn build-storybook    # static build — the main "does it all compile" check
yarn typecheck          # tsc --noEmit across the workspace
yarn build              # build both packages to dist/
```

**Verify changes with BOTH `yarn typecheck` AND `yarn build-storybook`.** They
catch different things: the Vite/esbuild build transpiles without type-checking
(so it misses type errors), while `tsc` doesn't exercise SCSS resolution or JSX
bundling. Both currently pass.

**`'use client'` directives are PRESERVED per-module in the build (ADR-0002).** The
components package builds with `preserveModules` + `rollup-preserve-directives`, so
each interactive component keeps its own `'use client'` (a client boundary) while
pure utilities (`cleanClasses`) stay directive-free and server-safe. This is what
lets `@bacongrease/components` be imported into Next.js (App Router) Server
Components. Do not add a blanket `'use client'` banner — it would drag the pure
utils behind a client boundary.

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

## Working conventions (how to operate here)

Standing preferences for how work gets done in this repo — general, not
app-specific. The detail for the docs vault lives in [`docs/README.md`](./docs/README.md).

**Working style.**
- No sycophancy. If a plan is wrong, say so and why — don't validate to agree.
- Flag best-practice violations proactively; the convention may be unknown. When
  the ask and the right thing differ, do the right thing or say so.
- State uncertainty and give options — don't guess fluently. Never fabricate
  specifics (APIs, config keys, versions); verify or ask.
- Verify before claiming done — exercise the change (here: `yarn typecheck` +
  `yarn build-storybook`, and run the affected flow), don't just typecheck.
  Report failures with output.
- Cut scope when in doubt; flag drift.

**Git workflow.** One short-lived branch per change off `main`, one at a time —
never stack. PR every change (code *and* docs); the PR is the self-review
checkpoint. Squash-merge, then delete the branch. Never merge red. **Commit/push
only when asked.**

**docs/ as a vault.** `docs/` is for thinking about the code (decisions,
standards, scope) — if code loads it at runtime, it's code and ships elsewhere.
Front-matter on every `.md`; relative Markdown links, never wikilinks; reuse the
tag vocabulary. `docs/scope.md` is the NOT-DOING list. Don't write ahead of
reality. See [`docs/README.md`](./docs/README.md).

**ADRs.** Architecturally significant decisions get an ADR in `docs/adr/`,
shipped in the same PR as the code it decides — immutable, superseded not
edited. Settled pre-existing decisions stay as prose here; don't backfill.
Format in [`docs/adr/README.md`](./docs/adr/README.md).

**README honesty.** The README describes what runs *today*, never aspirational.
A new fresh-machine requirement gets documented in the same change. Unbuilt
things go under "Not built yet."

**CLAUDE.md maintenance.** Keep "Current status" honest — move Done /
Not-done / open-questions in the same change that moves them. A hard rule may get
a cheap mechanical guard (gitignore line, hook), but the guard isn't the policy —
this file is.

## Definition of done — verify before every PR

A change isn't done until the repo is honest about it. Before opening a PR:

- **ADR** — a forced/architecturally-significant decision ships its ADR in the same PR
  (`docs/adr/NNNN-slug.md`, Nygard body; see [`docs/adr/README.md`](./docs/adr/README.md)). Don't
  batch or backfill.
- **Docs current** — update the **README** (what it is / setup, if a capability or setup step changed),
  **[`docs/handoff.md`](./docs/handoff.md)** (the "where we are / what's next" snapshot), **this CLAUDE.md**
  (conventions, commands, decisions), and the docs vault (scope/adr). Don't leave a note stale
  (e.g. a build change that invalidates a CLAUDE.md statement — fix it in the same PR).
- **Green** — `yarn typecheck` AND `yarn build-storybook` pass (and `yarn build` if the dist output
  changed).
- **Cross-repo (bacongrease ↔ sales-platform `web/`)** — bacongrease is dogfooded by `web/`, so a
  change driven by or affecting `web/` means **both repos' DoD apply**: an ADR + doc updates in EACH
  affected repo, separate branches/PRs. Operate as if you're in both repos at once — don't fix
  bacongrease and leave `web/`'s notes (or vice versa) stale.

## How SCSS resolution works (important)

Component stylesheets reference the design system with **bare specifiers**:
`@use 'mixins' as globalMixins;`, `@use 'functions';`, `@use 'variables';`.
These resolve because `.storybook/main.ts` sets
`css.preprocessorOptions.scss.loadPaths` to `packages/styles/src`. Inside the
styles package, files use relative `@use './variables'` etc.

Consequence: **any bundler/build must reproduce those loadPaths**, or the bare
`@use`s won't resolve. The lib build already does (see "Build pipeline" below) —
this was the open publishing question and it's now closed. Intra-package
`@use '../hamburger/hamburger.styles'` (sidenav) uses normal relative paths and
is fine.

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

## Build pipeline (how packages are built for publishing)

Run `yarn build` at the root — it builds `styles` then `components` (via
`yarn workspace <name> build`).

- **`@bacongrease/components`** builds with **Vite lib mode**
  (`packages/components/vite.config.ts`). It emits to `dist/`: `index.js` (ESM),
  `index.cjs` (CJS), `index.d.ts` + a per-component `.d.ts` tree (via
  `vite-plugin-dts`), and `style.css` (all component SCSS compiled — gradient
  generation intact). The config **reproduces Storybook's scss `loadPaths`**
  (`../styles/src`) so the bare `@use 'mixins'`/`'functions'`/`'variables'`
  specifiers resolve at build time — this is how we closed the open resolution
  question. react/react-dom/react-icons are externalized (peer deps);
  react-icons is type-only in the source so it's elided from runtime JS and kept
  in the `.d.ts`.
- **No `@vitejs/plugin-react`** in the lib build — deliberate. A lib build needs
  no fast-refresh, esbuild transpiles TSX via tsconfig's `"jsx": "react-jsx"`
  (automatic runtime), and dropping it avoids a Vite-version peer conflict
  (`plugin-react@6` wants Vite 8; we're on Vite 6). Storybook still uses its own
  internal react plugin, unaffected.
- **`@bacongrease/styles`** ships SCSS **source** (its scoped exports
  `@bacongrease/styles/mixins` etc. already existed) **plus** a compiled
  `dist/index.css` (via the `sass` CLI, `build` script) exported at
  `./style.css` for plain-CSS consumers.
- Build tooling (vite, vite-plugin-dts, sass) lives at the **workspace root**
  devDeps and resolves via the hoisted `node_modules/.bin` — same pattern as the
  Storybook deps.
- `dist/` is gitignored; it's a build artifact, not committed.

**Consumer contract:**
```js
import { Button } from '@bacongrease/components'
import '@bacongrease/components/style.css'   // component styles
// SCSS authors can also: @use '@bacongrease/styles/mixins' as *;
```

Note: because component SCSS is compiled to CSS at **our** build time, consumers
never resolve the bare `@use` specifiers — that concern only applies to authors
consuming the **styles** package's SCSS, which the scoped exports handle.

## Current status & where to pick up

Everything below the line is **done and verified** (typecheck + Storybook build
both green, committed on `main`):

- ✅ Monorepo scaffold, Yarn 4 workspace, git initialized
- ✅ `@bacongrease/styles` — full system ported + modernized
- ✅ `@bacongrease/components` — 10 primitives ported + decoupled + barrel
- ✅ Storybook wired, a story per component
- ✅ **Build + publish pipeline** — both packages build to `dist/` and `yarn
  pack` cleanly (see "Build pipeline" section below). `yarn build` at the root
  runs both. Verified: typecheck + build-storybook + pack dry-run all green.
- ✅ **Working conventions + `docs/` vault** — standing process preferences
  documented above; `docs/` holds decisions/standards/scope with an ADR log
  (`docs/adr/`) and the NOT-DOING list (`docs/scope.md`).
- ✅ **Yarn 4 + Node 20 toolchain** — migrated off pnpm to Yarn 4 (node-modules
  linker) and set a Node ≥ 20.19 floor. Recorded in ADR
  [`0001`](./docs/adr/0001-yarn4-node20-toolchain.md). Verified: install +
  typecheck + build + build-storybook + pack dry-runs all green.

**Not done yet — likely next steps, roughly in priority order:**

1. **Dogfood into ac-booking.** The build works and `yarn pack` produces valid
   tarballs, but we have NOT yet consumed the built packages back into a real
   app. That's the true end-to-end test — do it next (either `yarn add` the
   packed tarballs, or a `link:`/`portal:` dep, into `../ac-booking`).
2. **CSS custom-property token layer.** Expose the palette/key tokens as CSS
   variables so consumers theme at runtime without recompiling Sass. This is the
   recommended upgrade that makes it a real library vs. "my styles."
3. **Port tests.** The source app has Vitest + Testing Library tests for these
   components (`*.component.test.tsx`); they weren't brought over.
4. **Publish for real.** Packages are still `version: 0.0.0` and unpublished.
   Bump versions and `npm publish` (or set up a release flow) when ready. A repo
   now exists on GitHub under the `baconworks` org (pushed this session).
5. **Rename the `ac` color family** to something brand-neutral (it's the old app
   brand name; spinner/hamburger/utils reference `getColor(ac, …)`).

## Source of truth for the original components

When porting more components or checking fidelity, the originals live in
`../ac-booking/ac-booking-ui-v1/app/components/<name>/` and the original global
SCSS in `../ac-booking/ac-booking-ui-v1/app/styles/`. Components NOT yet ported
that were floated as candidates: `header`, `table` (deferred — tables resist
genericization). Everything else in that app is app-specific.
