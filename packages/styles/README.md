# @bacongrease/styles

The Bacongrease SCSS design system: a color-family map, programmatic gradient
functions, hover/shape mixins, design tokens, a reset, and utility classes.

Built on the modern Sass module system (`@use` / `@forward`) — no legacy
`@import`.

## Layout

| File | Emits CSS? | Purpose |
| --- | --- | --- |
| `_colors.scss` | no | `$color-families` map (default + 100–600/1200 shades) |
| `_functions.scss` | no | `getColor()`, `createGradientFromColorMap()` |
| `_mixins.scss` | no | `setColors`, `hoverScaleColorLightness`, `hoverAnimateLinearGradient`, `generateColorClasses`, `circle` |
| `_variables.scss` | no | breakpoints, gradient tokens, shadow, sizing, type scale |
| `_typography.scss` | no | font-family reference/notes |
| `_base.scss` | **yes** | reset + base element styles |
| `_utils.scss` | **yes** | `.text-link`, `.bg-gradient-*` helpers |
| `index.scss` | **yes** | forwards the token layer **and** emits base + utils |

## Usage

Pull tokens/helpers without emitting any CSS:

```scss
@use '@bacongrease/styles/functions' as fns;
@use '@bacongrease/styles/mixins' as mx;
@use '@bacongrease/styles/variables' as vars;

.card {
  color: fns.getColor(primary, 400);
  @include mx.circle;
  @media (max-width: vars.$breakpoint-md) { /* ... */ }
}
```

Emit the reset + utilities once at your app entry:

```scss
@use '@bacongrease/styles'; // base + utils + forwarded tokens
```

## Resolving bare specifiers

Component stylesheets in this repo reference the system with **bare** names
(`@use 'mixins'`, `@use 'functions'`). That resolves because the bundler is told
where to look. Storybook does this in `.storybook/main.ts`:

```ts
css.preprocessorOptions.scss.loadPaths = [ '<repo>/packages/styles/src' ]
```

Consumers of the published package should either add the same `loadPaths`, or
use the scoped specifiers shown above (`@use '@bacongrease/styles/mixins'`).

## Notes / TODO

- `xyFromRadians` was fixed (returned undefined vars in the original) and math/
  list globals were moved to `sass:math` / `sass:list` module functions.
- The app-specific root grid was removed from the `body` reset — layout is a
  host-app concern.
- A CSS-custom-property token layer (so consumers can theme at runtime without
  recompiling Sass) is a recommended future addition.
