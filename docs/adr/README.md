---
status: active
date: 2026-07-15
tags: [meta, process, decision]
---

# Architecture Decision Records

Flat, numbered records of architecturally significant decisions. One file per
decision: `NNNN-slug.md` (e.g. `0001-css-custom-property-tokens.md`).

## When to write one

An ADR captures a decision that's costly to reverse or shapes the codebase —
not every choice. **An ADR ships in the same PR as the code it decides.** Don't
batch-write ADRs for unforced or past decisions; settled history that predates
this practice stays as prose in [`CLAUDE.md`](../../CLAUDE.md), not backfilled
here.

## Format (Nygard)

- **Context** — the forces at play; why a decision is needed.
- **Decision** — what we're doing, stated plainly.
- **Consequences** — split three ways, and *write the downsides honestly*:
  - *makes easy* — what this unlocks
  - *makes hard* — what it costs or forecloses
  - *locked into* — what's now expensive to undo

## Rules

- **Immutable.** Don't edit a decision away — supersede it with a new ADR and set
  the old one's `status: superseded-by-NNNN`. History stays legible.
- **Solo repo ⇒ no `proposed` status.** A recorded ADR is `accepted`.
- Add a one-line [Y-statement](https://medium.com/olzzio/y-statements-10eb07b5a177)
  to the index below when you add an ADR — *"In the context of X, facing Y, we
  chose Z, to achieve W, accepting that V."*

## Template

```markdown
---
status: accepted
date: YYYY-MM-DD
tags: [decision]
---

# NNNN — Title

## Context
...

## Decision
...

## Consequences
**Makes easy:** ...
**Makes hard:** ...
**Locked into:** ...
```

## Index

- [`0001`](./0001-yarn4-node20-toolchain.md) — In the context of aligning the
  repo with Carter's default tooling and fixing a Node-19 ESM build failure, we
  chose **Yarn 4 (node-modules linker) + a Node ≥ 20.19 floor**, to get a
  consistent, supported toolchain, accepting a documented fresh-machine
  prerequisite and a hard Node-version lower bound.
- [`0002`](./0002-preserve-use-client-directives.md) — In the context of the Vite
  bundle stripping per-component `'use client'` so the barrel couldn't import into
  Next.js Server Components, facing a blanket-banner fix that would trap pure utils
  behind a client boundary, we chose **`preserveModules` + `rollup-preserve-directives`
  (per-module directives, per-format output array)**, to make components client
  boundaries while `cleanClasses` stays server-safe, accepting a per-module `dist/`
  and a build that must keep the two-format output array.
- [`0003`](./0003-design-tokens-css-custom-properties.md) — In the context of a
  compile-time-only SCSS system that couldn't theme at runtime or let a consumer
  override anything, facing a real app (`sales-platform/web`) that needed both, we
  chose a **two-tier CSS-custom-property token layer** (palette primitives → semantic
  roles) emitted from the SCSS, in **OKLCH**, with full scales (golden-ratio type, 4px
  spacing, elevation, z-index, motion) and light/dark via `prefers-color-scheme` +
  `[data-theme]`, to get runtime theming and per-layer overrides, accepting more
  indirection than `getColor()`, seed system-colour ramps that still need Leonardo
  contrast verification, and an incremental per-component migration to the tokens.
- [`0004`](./0004-link-polymorphic-a11y-contract.md) — In the context of `Link`'s first
  real consumer (`sales-platform/web`), facing an audit that found a consumer `aria-label`
  silently dropped on same-frame links, no `ref` forwarding (against our own React-19
  convention), and a required `title` forcing redundant tooltips, we chose to keep `Link`
  **polymorphic (`as`)** and fix the contract — **consumer `aria-label` wins** (the
  target-change label is only a fallback), **forward `ref`** (`ComponentPropsWithRef`), make
  **`title` optional**, and stop emitting `target="_self"` — to make it correct and
  dogfoodable, accepting only a backward-compatible widening of `title`.
- [`0005`](./0005-dropdown-clamps-to-the-viewport.md) — In the context of `Dropdown`
  promising to shift to a screen edge rather than overflow it, facing a consumer
  (`sales-platform`'s deal Actions menu) whose menu ran off the right anyway, we found it
  measured the edge from its **offsetParent** rather than the viewport — the two agree only
  when that ancestor spans the screen, as it did for the one consumer it was proven against,
  and a snug positioned wrapper inverts the arithmetic into a silent `left: 0`. We chose to
  **clamp to the viewport** (`documentElement.clientWidth`, so a scrollbar is excluded) and
  convert into offsetParent coordinates only to write `left`, and to **clamp the caret** a
  caret's width in from either end — to let a consumer wrap a trigger however it likes,
  accepting that a dropdown inside a scrolling container is now clamped to the screen rather
  than that container (which wants a portal, not a different clamp) and that `overflow: hidden`
  on an ancestor still clips. Removes the warning `account-menu.styles.scss` had to carry.
- [`0006`](./0006-the-backdrop-is-a-node-not-everything-outside-the-panel.md) — In the
  context of `Modal` closing on a backdrop click, facing a consumer
  (`sales-platform`'s contact pickers) whose dialog closed underneath the option being
  chosen, we found the backdrop test was **`!panel.contains(target)`** — *not the panel*,
  which is a larger set than *the backdrop*: a dropdown portaled to `<body>` to escape the
  panel's clipping is a React child of the modal (so its events bubble to these handlers)
  while sitting outside the panel in the DOM, and so read as a backdrop press. We chose
  **`event.target === event.currentTarget`** on both the press and the release — the
  backdrop is a NODE — to make any portaled control usable inside a dialog without the
  Modal knowing it portals, accepting that this relies on the menu being rendered inside
  the modal's React tree, that the root element is now locked in as the backdrop, and that
  the package has no test runner to guard it. Drops `modalRef`; keeps the drag-select
  protection unchanged.
