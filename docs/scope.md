---
status: active
date: 2026-07-15
tags: [scope, decision]
---

# Scope — what we're deliberately NOT doing

The out-of-scope list. Each entry has a one-line reason. This is distinct from
the README's "Not built yet" (things we *intend* to build): these are choices
*against*, current until a documented decision reverses them.

## Not porting

- **`header` component** — app-specific layout, not a reusable primitive.
- **`table` component** — tables resist genericization; the source app's is too
  coupled to its data shapes to be worth extracting yet.

## Not adopting (config)

- **`noUncheckedIndexedAccess`** — the ported code wasn't written for it;
  retrofitting is churn without a driver.
- **`declaration` in `tsconfig.base.json`** — triggers "cannot be named"
  portability errors on Storybook `meta` inference; it belongs in a dedicated
  build tsconfig, and the build pipeline already sets it there.

## Not fixing (known, intentional)

- **Greyscale button-icon gradient no-op** — the icon gradient references
  `stop-color-grey-*` but linear-gradient emits `stop-color-greyscale-*`. A
  faithful carry-over of a pre-existing app bug; primary/secondary/tertiary work.
  Low value, left as-is until someone needs the greyscale icon gradient.

## Not now (tooling)

- **CI** — no GitHub Actions yet; the repo is solo and low-traffic. Verification
  is `pnpm typecheck` + `pnpm build-storybook` run locally before a PR.
