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
