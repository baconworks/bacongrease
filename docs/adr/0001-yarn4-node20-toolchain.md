---
status: accepted
date: 2026-07-15
tags: [decision, tooling, build]
---

# 0001 — Yarn 4 + Node 20 as the toolchain baseline

## Context

The repo was scaffolded on pnpm (pnpm-workspace.yaml, pnpm-lock, `pnpm --filter`
build scripts). Carter's standing preference across JS projects is Yarn, and his
global `~/.yarnrc.yml` declares `yarn@4.5.0` as the default package manager.
Because this repo pinned no package manager, Corepack walked up to that global
yarn declaration and *blocked* the `pnpm` shim — pnpm was effectively broken in
the working environment, needing an `npx pnpm@9` workaround every time.

Separately, the dev machine defaulted to **Node 19.3.0**, which is end-of-life
and non-LTS. A fresh install of the `sass` CLI (1.101.0) pulls `chokidar@^5`,
which is ESM-only; `sass`'s CommonJS entry `require()`s it at load time, and
Node < 20.19 cannot `require()` an ESM module (`ERR_REQUIRE_ESM`). So the styles
build failed on Node 19 regardless of package manager — pnpm would have hit the
same wall. `require(ESM)` is unflagged from Node 20.19 onward.

## Decision

Migrate the repo to **Yarn 4** (node-modules linker) and set a **Node ≥ 20.19**
floor.

- `packageManager: yarn@4.5.0` + `workspaces: ["packages/*"]` in root
  package.json; delete pnpm-workspace.yaml, pnpm-lock.yaml, and the pnpm `.npmrc`.
- `.yarnrc.yml` pins `nodeLinker: node-modules` (not PnP) so the component SCSS
  keeps resolving the design system via Vite/sass `loadPaths` against a real
  `node_modules` tree.
- `.nvmrc` pins `20.20.0`; `engines.node` set to `>=20.19`.
- An empty `yarn.lock` marks this repo as its own project root (Carter's home
  dir is itself a yarn project, so yarn would otherwise treat this as a stray
  workspace of home).
- Node 20.19+ makes the `sass`/`chokidar` ESM issue disappear at the root, so
  **no `chokidar` resolution override is carried** — the fix is the Node floor,
  not a patch.

## Consequences

**Makes easy:**
- Matches Carter's default tooling and his other apps (e.g. ac-booking), so
  no per-repo context switch and no Corepack fight.
- Publishing is unaffected — `yarn npm publish` targets the npm registry, and
  the `files` allowlists ship only `src`/`dist`; verified no yarn artifacts leak
  into either pack.
- A modern, supported Node line; the `sass` build works without workarounds.

**Makes hard:**
- Fresh-machine setup now has real prerequisites (Corepack-enabled yarn +
  Node 20.19+) that must stay documented in the README.
- The empty-`yarn.lock`-as-project-root trick is non-obvious; a contributor who
  deletes it will get a confusing "not part of the project declared in ~" error.

**Locked into:**
- Node ≥ 20.19 as a hard floor. Any tool or CI runner below that breaks the
  styles build. Dropping below it again would require re-introducing a
  `chokidar` CJS override.
- Yarn-4-specific workspace ergonomics (`yarn workspace <name> …`,
  `workspace:*` protocol, `.yarnrc.yml`). Moving back to pnpm/npm would mean
  redoing the workspace wiring and lockfile.
