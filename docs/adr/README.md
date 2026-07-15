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

_No ADRs yet — the first architectural decision recorded under this practice
becomes `0001`._
