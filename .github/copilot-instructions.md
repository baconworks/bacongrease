# Copilot instructions — bacongrease

You are working in a personal React component library + SCSS design-system monorepo. A **human reviews
every PR you open** — optimize for a small, correct, convention-matching change that's easy to review.
`CLAUDE.md` at the repo root is the **source of truth** (conventions, commands, decisions, and the full
Definition of Done); read it and follow it. This file is a short pointer plus the hard guardrails.

## Hard guardrails (never violate)

- **No real or client data, ever.** All fixtures/examples are synthetic — invented names and values.
  Never introduce real-looking data. (Project HARD RULE.)
- **Stay in the repo.** Don't fetch or depend on anything outside it for data or context.
- **Don't change a public component API or the design-token layer** (ADR-0003) unless the issue asks
  for exactly that. These are consumed by another app.
- Keep the PR **scoped to the issue**. Don't opportunistically refactor unrelated code.

## Conventions (see CLAUDE.md for detail)

- **TypeScript/React:** `const` function components (never `function` decls); **spaces inside `{ }`
  and `[ ]`** (`{ ...props }`, `map(( x, i ) => …)`); `interface` for component props, `type` for data.
- **A component wrapping one element** extends `ComponentPropsWithRef<'el'>`, forwards `ref`, and also
  runs the caller's event handlers. **Accessibility is required** (WCAG 2.1 AA).
- **SCSS + BEM** (`block`, `block_element`, `block--modifier`). Components read **design tokens**
  (`var(--foreground)`, `var(--accent)`, `var(--space-4)` …), **not** raw `getColor()` (ADR-0003).
- **File naming:** `name.component.tsx` / `name.styles.scss` / `name.stories.tsx` / `name.types.ts`;
  SCSS partials `_name.scss`. Components default-exported, re-exported named from the barrel.
- **`'use client'`** per interactive component; pure utilities stay directive-free (server-safe).
- **No jargon** in code/comments/PR text — plain language.

## Definition of done (before opening the PR)

- **Green:** `yarn typecheck` AND `yarn build-storybook` both pass (Node 20 via `.nvmrc`, Yarn 4 via
  Corepack). Run them; report failures with output.
- **Docs current:** update whatever the change touches — `README`, `docs/handoff.md`, `CLAUDE.md` — so
  nothing is left stale.
- **ADR:** an architecturally-significant decision ships a Nygard ADR in `docs/adr/` in the same PR.
- Add/adjust a **Storybook story** for a new or changed component.
