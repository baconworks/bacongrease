# @bacongrease/styles

The Bacongrease SCSS design system: a color-family map (OKLCH), programmatic
gradient functions, hover/shape mixins, a **runtime design-token layer**, a reset,
and utility classes.

Built on the modern Sass module system (`@use` / `@forward`) — no legacy `@import`.

## Two layers

- **Authoring (SCSS, compile-time):** the `$color-families` map + functions/mixins/
  variables. This is where the system is *defined* (paste Leonardo-generated OKLCH
  families into `_colors.scss`).
- **Runtime (CSS custom properties):** `_tokens.scss` emits the whole system as CSS
  variables at `:root`, so a consuming app **themes and overrides at runtime** — no
  recompile. This is the layer apps and components should read (ADR-0003).

## Layout

| File | Emits CSS? | Purpose |
| --- | --- | --- |
| `_colors.scss` | no | `$color-families` map — **OKLCH**; brand (primary/secondary/tertiary), **system** (success/warning/danger/info), greyscale, decorative `custom` |
| `_functions.scss` | no | `getColor()`, `createGradientFromColorMap()`, `modularScale()`, `token()` |
| `_mixins.scss` | no | `setColors`, `hoverScaleColorLightness`, `hoverAnimateLinearGradient`, `generateColorClasses`, `circle` |
| `_variables.scss` | no | breakpoints, gradient defs, shadow, sizing, type-scale base/ratio |
| `_tokens.scss` | **yes** | **the CSS-variable token layer** — primitives, semantic roles, scales, light/dark theming |
| `_typography.scss` | no | font-family reference/notes |
| `_base.scss` | **yes** | reset + themed base element styles (consumes tokens) |
| `_utils.scss` | **yes** | `.text-link`, `.tabular-nums`, `.measure`, `.bg-gradient-*` |
| `index.scss` | **yes** | forwards the authoring layer **and** emits tokens + base + utils |

## Tokens

Emit everything once at your app entry, then read the CSS variables anywhere:

```scss
@use '@bacongrease/styles'; // emits tokens (:root) + base reset + utils
```

```css
.card {
  background: var(--surface);
  color: var(--foreground);
  padding: var(--space-4);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  font-size: var(--font-size-lg);
}
```

Token groups: **primitives** `--color-<family>-<shade>` · **semantic** `--background`
`--surface` `--foreground` `--muted` `--border` `--accent` `--accent-contrast`
`--danger/success/warning/info` (+ `*-surface` tints) `--focus-ring` `--overlay`
`--shadow` · **type** `--font-size-xs…3xl` (golden √φ scale) `--line-height-*`
`--font-body/heading/mono` `--font-weight-*` `--letter-spacing-*` `--measure` ·
**space** `--space-1…8` `--radius-*` `--container*` `--control-height-*` ·
**depth/motion** `--shadow-sm/md/lg` `--z-*` `--duration-*` `--ease-*` · **gradients**
`--gradient-*`.

**Override** any of them from your app — a single primitive, a role, or a scale:

```css
:root { --accent: oklch(60% 0.15 275); --space-4: 1.4rem; }
```

**Theming:** light at `:root` by default; dark applies under
`@media (prefers-color-scheme: dark)`, and an explicit `[data-theme="dark|light"]`
on the root always wins (for a manual switch).

## SCSS authoring API (when CSS vars can't do the job)

Pull functions/variables/mixins without emitting CSS — mainly for **breakpoints in
media queries** (custom properties are illegal in `@media`) and mixins:

```scss
@use '@bacongrease/styles/variables' as vars;
@use '@bacongrease/styles/functions' as fns;

.card {
  @media (max-width: vars.$breakpoint-md) { /* ... */ }
  color: fns.token(foreground);      // -> var(--foreground)
}
```

For **color / spacing / type, prefer the CSS-variable tokens** (`var(--foreground)`)
— they theme; raw `getColor()` values are baked at compile time and don't.

## Resolving bare specifiers

Component stylesheets in this repo reference the system with **bare** names
(`@use 'mixins'`, `@use 'functions'`). That resolves because the bundler is told
where to look (Storybook's `.storybook/main.ts` and the Vite lib build set
`scss.loadPaths` to `packages/styles/src`). Consumers of the published package
should either add the same `loadPaths`, or use the scoped specifiers above
(`@use '@bacongrease/styles/mixins'`).

## Notes

- Colors are **OKLCH** — perceptually uniform (equal lightness reads as equally light
  across hues, so contrast is easier to keep accessible). Generate families in
  [Leonardo](https://leonardocolor.io/) (interpolate in OKLCH; export OKLCH custom
  properties) and paste into `_colors.scss`.
- The **system** color ramps are even OKLCH seeds — regenerate in Leonardo against
  real WCAG contrast targets before trusting a shade for text.
- Per-color transparency is derived on demand with `color-mix(in oklch, …)`; there are
  no pre-baked transparent color families.
