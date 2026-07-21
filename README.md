# 🥓 Bacongrease

A personal component library and SCSS design system — the generic parts of my
projects, extracted so they grease the wheels of the next build.

Pulled out of the `ac-booking` app and decoupled from it. Two packages:

| Package | What |
| --- | --- |
| [`@bacongrease/styles`](./packages/styles) | SCSS design system: color-family map, gradient functions, mixins, tokens, reset, utilities. Modern `@use`/`@forward` modules. |
| [`@bacongrease/components`](./packages/components) | React primitives: Button, Icon, LinearGradient, Spinner, Hamburger, Modal, Dropdown, SideDrop, Link, Sidenav, Header, AccountMenu, ThemeToggle. BEM class names, styled with the design system. |

## Getting started

Requires **Node ≥ 20.19** (see `.nvmrc`) and **Yarn 4** (via Corepack — the
`packageManager` field pins the version).

```bash
nvm use             # Node 20.20.0 per .nvmrc
corepack enable     # once per machine, if yarn isn't already available
yarn install
yarn storybook      # dev — component explorer at http://localhost:6006
yarn build-storybook
yarn typecheck
yarn build          # build both packages to dist/
```

Storybook (React + Vite) is the development and documentation environment.
Every component has a `*.stories.tsx`.

## Conventions

- **Structure** — one folder per component: `x.component.tsx`, `x.styles.scss`,
  `x.stories.tsx`, plus `types/` / `data/` / `styles/` where needed.
- **Styling** — SCSS with BEM (`block__element--modifier` written as
  `block_element` / `block--modifier`). Component stylesheets pull tokens from
  the design system with bare `@use 'mixins'` / `'functions'` / `'variables'`;
  the Storybook Vite config resolves those via `loadPaths`
  (see `.storybook/main.ts`).
- **Code style** — spaces inside `{ }` and `[ ]`.

## Decoupling notes (vs. the original app)

These changed during extraction so the primitives don't drag the app with them:

- **Button** — `uuid` → React 19 `useId()`; `next/image` → plain `<img>`.
- **Link** — `next/link` → polymorphic `as` prop (defaults to `<a>`; pass a
  router link to keep client-side navigation).
- **Sidenav** — dropped the app's `Compose`, `useAppContext`, `iconMap`, and
  `next/navigation`. The action area is now an `action` slot, active state comes
  from an optional `pathname` prop (or a per-link `active`), and link icons come
  from the link data.
- **Modal** — falls back to `document.body` when there's no `#modal-root`.
- **Styles** — fixed the `xyFromRadians` bug, moved to `sass:math` / `sass:list`
  module functions, and removed the app-specific root grid from the base reset.

## Not built yet

What runs today: both packages build to `dist/` (`pnpm build`) and pack cleanly;
Storybook is the dev/docs environment. Still ahead:

- **Dogfood into a real app** — consume the built/packed packages back into
  `ac-booking` as the true end-to-end test.
- A **CSS custom property** token layer so consumers can theme at runtime
  without recompiling Sass.
- Port the component **tests** (Vitest) from the source app.
- **Publish** — packages are still `0.0.0` and unpublished; bump + `npm publish`.
- Rename the `ac` color family to something brand-neutral.

Decisions and standards live in [`docs/`](./docs) (a git-tracked vault); the
things we've deliberately chosen *not* to do are in [`docs/scope.md`](./docs/scope.md).
