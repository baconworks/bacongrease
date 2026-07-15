---
status: active
date: 2026-07-15
tags: [meta, process]
---

# docs/ — the bacongrease vault

A git-tracked [Obsidian](https://obsidian.md) vault for **thinking about the
code**: decisions, standards, and scope. Open the `docs/` folder as a vault; the
files are plain Markdown and read fine on GitHub too.

## The boundary rule

> If code loads it at runtime, it is **code** — it ships with the code, not here.

`docs/` is for reasoning *about* the code. Runtime artifacts (config, data the
app reads, generated output) live next to the code that consumes them. When in
doubt: does something `import`/read this file when the library runs? If yes, it's
code.

## Rules

- **Front-matter on every `.md`** — `status`, `date`, `tags` (see template
  below).
- **Relative Markdown links, never wikilinks.** Use `[text](./scope.md)`, not
  `[[scope]]` — GitHub doesn't render wikilinks.
- **Reuse the tag vocabulary** below. Grep before inventing a new tag:
  `grep -rh '^tags:' docs/`.
- **Don't write ahead of reality.** No decision or definition doc for something
  that isn't true yet. If it's future work, it belongs in the README's
  "Not built yet" or, if it's a deliberate non-goal, in [`scope.md`](./scope.md).
- **`docs/.obsidian/`** (Obsidian's per-vault workspace state) stays gitignored.

## Front-matter template

```yaml
---
status: active        # active | draft | superseded
date: 2026-07-15      # ISO date, created or last-meaningfully-changed
tags: [styles]        # from the vocabulary below
---
```

ADRs use their own `status` values (`accepted` / `superseded-by-NNNN`) — see
[`adr/README.md`](./adr/README.md).

## Tag vocabulary

Starter set — extend deliberately, not casually:

- `meta` — about the vault/docs process itself
- `process` — how we work (git, review, releases)
- `decision` — captures a choice (most ADRs carry this)
- `scope` — in/out-of-scope boundaries
- `styles` — the `@bacongrease/styles` package
- `components` — the `@bacongrease/components` package
- `build` — build/publish pipeline
- `tooling` — Storybook, TS, editor, repo config

## What's here

- [`scope.md`](./scope.md) — the NOT-DOING list, each entry with a one-line why.
- [`adr/`](./adr/) — Architecture Decision Records (see its README for format).
