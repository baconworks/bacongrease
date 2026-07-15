# @bacongrease/components

React component primitives, styled with [`@bacongrease/styles`](../styles) and
named with BEM.

```tsx
import { Button, Modal, Sidenav } from '@bacongrease/components';
import { ButtonVariants } from '@bacongrease/components';
```

`react`, `react-dom`, and `react-icons` are **peer dependencies**.

## Components

| Component | Notes |
| --- | --- |
| `Button` | variant + `styleOptions` (gradient / outline / text / pill / circle / …); optional `icon` (react-icons) or `image` |
| `Icon` | wraps a react-icons icon; optional animated SVG gradient fill |
| `LinearGradient` | SVG `<linearGradient>` with programmatic stops (used by `Icon`) |
| `Spinner` | multi-color orbit loader; `grid` / `modal` / `note` variants |
| `Hamburger` | animated open/closed menu toggle |
| `Modal` | portal into `#modal-root` (falls back to `<body>`); closes on backdrop / Escape |
| `Dropdown` | auto-positions + caret under a `targetRef`; closes on outside click |
| `SideDrop` | like `Dropdown` but flanks the target left/right |
| `Link` | polymorphic (`as`) anchor with a11y target labels + active state |
| `Sidenav` | collapsible sidebar; `action` slot, `pathname`-driven active links, `linkAs` for routing |

## Styling requirement

Component stylesheets are imported for their side effects (`import
'./x.styles.scss'`) and reference the design system with bare `@use`
specifiers. Whatever bundles these files must resolve those — see the repo
Storybook config (`css.preprocessorOptions.scss.loadPaths`) for the pattern.
Also `@use '@bacongrease/styles'` once at your app entry for the reset +
utilities.
