---
status: active
date: 2026-09-02
tags: [meta, handoff]
---

# Handoff — start here for a new session

A point-in-time snapshot (dated above). Overwrite it at the end of each working session. The durable
specs are [`../CLAUDE.md`](../CLAUDE.md) (what this is, commands, conventions, decisions), the
[`../README.md`](../README.md) (human-facing intro/setup), and the [ADRs](./adr/README.md).

## Setup (fresh clone)

```bash
nvm use            # Node 20.20.0 (.nvmrc); a hard floor — sass CLI needs ESM chokidar
corepack enable    # Yarn 4 per packageManager
yarn install
yarn storybook     # dev explorer → http://localhost:6006
yarn typecheck && yarn build-storybook   # the "does it all compile" gate
yarn build         # build both packages to dist/
```

## Where we are

A **Yarn 4 monorepo**: `@bacongrease/styles` (SCSS design system) + `@bacongrease/components` (React
primitives — button, dropdown, hamburger, icon, linear-gradient, link, modal, side-drop, sidenav,
spinner, plus the `cleanClasses` util). Storybook is the dev/dogfooding environment. Extracted from
the ac-booking app; being generically re-proven.

**Latest — two `Button` defects, surfaced building `sales-platform/web`'s deal command bar.** Both are
fixes, not decisions, so **no ADR** (the owner's call: *"I dont think we need a whole adr just for fixing
the button outline size"*).

- **An outlined button was bigger than a filled one.** The base button has no border, so
  `setButtonOutlineStyles` drawing a 2px one added 4px to both dimensions — **39px against 35px** where the
  two sat side by side in a row. The border now comes **out of the padding**
  (`calc($button-padding - $borderWidth)`), so an outline is a change of look and never a change of size.
  Bootstrap reserves a transparent border on every button for the same reason; taking it from the padding
  instead keeps filled buttons, the common case, at exactly the size they already were. **Nothing used
  `outline` before this** (one Storybook story), so nothing existing shifts.
- **The primary variant looked like it had no hover transition.** It ran at `0.2s ease-out` while every other
  variant runs at `0.5s ease-in-out`; ease-out front-loads, so it was ~70% of the way there in the first
  85ms, and beside a 0.5s neighbour that reads as an instant jump. It now uses
  `$button-transition-timing` / `$button-transition-function` like the rest. **It was never broken** — a
  frame-accurate probe (`requestAnimationFrame` + `performance.now()`) shows it always interpolated cleanly:
  0.599 → 0.615 → 0.635 → 0.651 → 0.659, settled at 237ms. Probing with `setTimeout` in headless Chrome is
  what made it look like a jump; `setTimeout` does not advance animation frames.

**Considered and reverted:** giving the outline hover a background wash of its own colour. The owner: *"The
background is not supposed to change. the outline and the text are supposed to. That's how it was designed."*
Reverted whole — `background: none` in both states, `color` and `border` alone transitioned.

**Open, for a later call:** the greyscale outline's hover is nearly invisible by consequence of that design —
`color.scale` on pure black lightens it to `#484848`, moving the button's only two marks *toward* a white
page, so it reads as receding rather than lifting. It is far more legible on the primary outline
(`#057abd` → `#53b1f8`), which lightens a saturated colour. Options within the design: darken instead of
lighten on a light theme, thicken the border on hover, or stop using black for a neutral outline. Also open:
**`Button` renders its `icon` at the icon's own size**, so an icon button is ~1.3px taller than a plain one
(16px icon in a 15px text line box) — `web/`'s "Actions" menu trigger measures 36.3px against its row's 35.0.
Fixing it means deciding how `Button` sizes icons, which touches every icon button in both apps.

**Latest — the backdrop is a node, not everything outside the panel** (ADR-0006; driven by
`sales-platform`'s contact pickers, where choosing a contact closed the whole dialog). `Modal` decided
"backdrop" with `!modalRef.contains(event.target)` — *not the panel*, which is a bigger set than *the
backdrop*. A consumer that portals a dropdown to `<body>` to escape the panel's clipping (ADR-0005 names
that as the answer for a box in its own scroll area, and the app took it) makes a node that is **a React
child of the modal and not a DOM descendant of the panel** — so its events bubble into these handlers,
`contains` answers no, and every press on an option read as a backdrop press. Both handlers now test
**`event.target === event.currentTarget`**, so anything the modal owns answers no wherever the DOM put it;
the drag-select protection (press AND release both on the backdrop) is unchanged, and `modalRef` is gone.

**It hid behind a second bug.** In the app the portaled list was destroying the option before the click
landed, so nothing reached this handler at all — the two cancelled into "the picker does nothing", which is
why the symptom was undiagnosable. The app-side half is `sales-platform`'s ADR-0227.

**No regression test — this package has no test runner** (`typecheck`, `build`, `storybook`). Worth adding
one; it is the obvious next infrastructure gap and it is what would have caught this.

**Recent — `Dropdown` clamps to the viewport** (ADR-0005; driven by `sales-platform`'s deal-page Actions
menu, which ran off the right of the screen). It measured the screen edge from its **offsetParent**, which
only equals the viewport when that ancestor happens to span it — as it did for `AccountMenu` inside a
full-width `Header`, the one consumer it was proven against. Wrap the trigger in a snug positioned box (the
ordinary popover recipe) and the arithmetic inverts to a silent `left: 0`, opening at the trigger and
running off the side. It now clamps in viewport coordinates (`documentElement.clientWidth`, so a scrollbar
is excluded) and converts to offsetParent coordinates only to write `left`; the caret is clamped a caret's
width in from either end. **A consumer may now wrap a trigger however it likes** — the warning
`account-menu.styles.scss` carried about not giving it a positioning context is gone.

**Recent — `Modal` drag-select close fix** (driven by `sales-platform/web`, where it cost real data
entry). `Modal` closed on any `click` whose target sat outside the panel. But a `click` fires on the
nearest common ancestor of press and release, so **selecting text in a field by dragging** — press
inside the panel, release a few pixels past its edge — produced a click targeting the backdrop, and the
modal closed, discarding a half-filled form. It now tracks whether the press *started* on the backdrop
(`onMouseDown`) and closes only when press **and** release were both outside: a drag begun inside never
closes it, a genuine backdrop click still does. No ADR (a bug fix restoring intended behaviour, like the
Dropdown reposition fix); no API change.

**Recent — `Link` audit fix** (ADR-0004; driven by `sales-platform/web` dogfooding it for real
navigation). Kept `Link` polymorphic (`as` swaps in Next.js/React Router) and fixed its contract:
**consumer `aria-label` now wins** (a same-frame link previously had its `aria-label` clobbered with
`undefined`; the "opens in a new tab" phrasing is now only a fallback), **`ref` is forwarded**
(`ComponentPropsWithRef`, per our React-19 convention — it wasn't before), **`title` is optional** (was
required, forcing redundant tooltips on self-describing links), and `target="_self"` is no longer
emitted. Backward-compatible (title widening). `web/` consumes it via `<Link as={ NextLink } … >`.

**Earlier — Dropdown keyboard a11y + theme anti-flash helper** (follow-ups to the header slice):
- **`Dropdown` a11y** — **Escape closes** it (a keyboard/SR user could only click away before), and
  **focus is managed**: on open, focus moves into the dropdown (first focusable child, else the
  container via `tabIndex=-1`); on close, focus returns to the trigger. Meets the WCAG-AA keyboard
  requirement for the account menu. A follow-up (PR #11) also fixed a first-open caret
  miscentre — the positioner now recomputes on `requestAnimationFrame` + `document.fonts.ready`, since
  a late web-font swap can slide the trigger sideways (the target ResizeObserver only catches resizes,
  not moves); plus `focus({ preventScroll: true })` so opening never scrolls the page.
- **`themeInitScript( storageKey )`** — a server-safe helper returning the inline `<head>` script
  that stamps `data-theme` from the persisted choice **before first paint**, killing the theme flash
  (FOUC). Mirrors `ThemeToggle`'s mount rule (stamp only on an explicit stored choice) so they can't
  drift. It MUST be a synchronous inline script — a `useEffect` runs after paint (that's the flash);
  this is the pattern next-themes / Chakra `ColorModeScript` / Theme UI ship (ref: Josh Comeau, "The
  Perils of Rehydration"). Consumed by `web/`'s root-html shell.

**Recent — Header + AccountMenu + ThemeToggle** (the app's top bar, for `sales-platform/web`). Three
new primitives, composed like the Sidenav (generic here, app-wrapped there):
- **`Header`** — a pure-layout `<header>` frame (grid: branding | search | actions), all four slots
  optional (`branding` / `search` / `tools` / `account`); search absent = off. Knows nothing about
  users or sign-out — those live in the slotted components. Exposes `--header-height` and drives the
  account avatar size (`--account-avatar-size`) proportionally off it.
- **`AccountMenu`** — the account widget: an initials circle (derived from the name; `AccountUser`
  type **requires at least one of firstName/lastName** via a union, so an empty user can't compile;
  avatar image overrides) that opens the `Dropdown`, laying out only the identity fields it's given
  (name / username / email / role · department), plus an optional `menu` slot, the theme switch, and
  sign-out. Standalone-usable (own state/anchoring).
- **`ThemeToggle`** — moved here from `web` (theming is the library's own concern — `data-theme` is
  the token convention). Stamps `data-theme` on the root, persists to localStorage (namespaced via
  `storageKey`), and **syncs across tabs via the `storage` event** (not BroadcastChannel — the event
  is purpose-built for a persisted value, fires only in other tabs, and rides the `setItem` for free).
- **`Dropdown` fixes (audit-on-intake):** tokenized (`var(--surface)`/`--foreground`, was hardcoded
  `white`) so it follows the theme; and a **bug fix** — it was spraying the consumer's `className`
  onto the internal caret too, so a consumer's box sizing (e.g. `min-width`) blew the caret up. The
  caret no longer receives the consumer class. (Kept the box **shadow-only**, no border: in light
  theme `--surface` == `--background`, so a box border with a border-less caret made the caret read
  as absent. A crisp bordered dropdown would need the caret bordered too — a later, visually-verified
  step.)
- No ADR: composition + a bug fix, not an architectural decision. The one mild call — theme
  persistence living here — follows naturally from ADR-0003 (tokens/theming are bacongrease's).

**Earlier — Button polish** (surfaced consuming it in `web/`): `variant` is now a **string-literal
union** (`variant="primary"`, no `ButtonVariants` import) via `buttonVariants` + `ButtonVariant`;
gradient buttons **brighten** on hover (were darkening) — the gradient stop order was reversed to
light→dark; added an `--accent-hover` interactive-state token (a resolved palette shade, since a
`color-mix()` target doesn't animate in a transition). **KNOWN ISSUE — #7:** the **primary** variant
(and pill/shadow, and the app Sign-out) still **snaps** on hover instead of animating, even after its
transition was made a literal `0.2s ease-out` identical to the working `secondary` variant. Cause not
found (color-mix, var-timing, and shorthand were all ruled out via browser isolation; the sandboxed
artifact wouldn't let me drive a real hover). **First step on revisit: a fresh dev-server restart** —
a stale HMR build is the top suspect (testing was on a long-running server).

**Also — `.github/copilot-instructions.md`** added, aligning the Copilot coding agent to CLAUDE.md +
the DoD + the no-corpus/synthetic-data guardrail (for when the agent is enabled; #7 is the pilot).

**Recent — design tokens + theming (ADR-0003).** `_tokens.scss` now emits the whole design system as
**runtime CSS custom properties** at `:root`, in two tiers: palette **primitives** (`--color-*`) →
**semantic roles** (`--foreground`, `--accent`, `--danger`, …) that flip per theme. Plus full scales:
a **golden-ratio** type scale (step √φ; Elements of Typographic Style), 4px spacing, radius, an
elevation scale (the layered "smooth shadow" = `--shadow-md`), z-index, motion, container widths,
control heights, a readable `--measure`. **Theming:** light at `:root`, dark via
`prefers-color-scheme` + a `[data-theme]` override. Everything is overridable by the consuming app.
Colors moved to **OKLCH** (perceptually uniform → accessible contrast is easier; author in Leonardo,
export OKLCH). Added a **system/status** color family (success/warning/danger/info); renamed the
client-named `ac` family → `custom`; removed the superseded `*Transparent` families (use `color-mix`).
The base reset consumes tokens (themed body, `text-wrap`, `prefers-reduced-motion`). **Button's solid
primary** variant migrated to tokens as the first audit-on-intake (themes via `--accent`, `color-mix`
hover); other variants/components migrate as adopted. Consumed live by **`sales-platform/web`** (rebuild
here → `web` picks up `dist/`).

**Earlier:** ADR-0002 — the components build **preserves `'use client'` per-module**
(`preserveModules` + `rollup-preserve-directives`), so `@bacongrease/components` imports into Next.js
App-Router **Server Components** (how `sales-platform/web` consumes it via Yarn `portal:`).

**Also recent (Button correctness + a11y):** surfaced while first consuming `Button` in `web/`.
Decorative `image` now `alt=""` (was double-announced); `ButtonProps` now `extends
ComponentPropsWithRef` and the component **forwards `ref`** (React 19 — no `forwardRef`), so it can
be focused or given a ref; a handler the caller passes (`onMouseEnter`/`onMouseLeave`) now **also
runs** instead of being silently overwritten.
Two conventions were codified in `CLAUDE.md` from this (owner preferences): **accessibility is a
requirement (WCAG 2.1 AA)** for every component, and **a component built around one HTML element
extends `ComponentPropsWithRef<'el'>`** (forward the `ref`; also run the caller's event handlers;
components made of several elements give each part its own named props instead). No ADR —
component correctness, not an architectural decision.

**Also recent — Sidenav + Hamburger (brought in for `sales-platform/web`).** Tokenized (themes; a
subtree can be theme-pinned since `[data-theme]` now targets any element, not just `:root`). The
**Sidenav** takes a flat list OR `sections` (the app owns role/plan gating, not the nav), uses a
**hamburger-pin** toggle with a `toggle` prop (`none`/`x`/`chevron`), exposes adjustable geometry as
CSS vars (default 48px accessible rail), and no longer hardcodes its grid placement. The action slot
was **removed** (deferred — belongs as a nav-item CTA, not the general Button). **Hamburger** audit
fixes (tokenized bars, `type=button`, real ☰↔✕ morph, invalid CSS dropped). Flagged: the **`Icon`**
component has a latent sizing bug (unsized `.icon` span) to fix on its own intake.

## What's next

- **Migrate remaining components to tokens (audit-on-intake).** Done: Button (primary), Sidenav,
  Hamburger, Dropdown. Still on raw `getColor()`: other Button variants, modal / side-drop / link /
  spinner / icon. Migrate each as it's pulled into `web/` — reworking `color.scale()` hovers to
  `color-mix(in oklch, …)` (SCSS color functions can't touch a CSS variable).
- **Regenerate system-color ramps in Leonardo** against real WCAG contrast targets (current ones are
  even OKLCH seeds).
- **Component audit on intake.** The components predate this workflow. When one is *brought into*
  `web/` (or extracted further), audit it for reusability / refactoring and flag best-practice issues
  — don't just import it as-is.
- **JSON:API deserializer (extraction candidate).** A generic JSON:API → flat-typed-object
  deserializer (Zod-validated) is being built and proven in `sales-platform/web`. Per build-here-
  extract-when-proven, lift it here (e.g. a `@bacongrease/json-api` package) once it's stable.
- **Cross-repo DoD.** Changes driven by / affecting `web/` must satisfy both repos' DoD — an ADR +
  doc updates in each. See [`../CLAUDE.md`](../CLAUDE.md) "Definition of done".
