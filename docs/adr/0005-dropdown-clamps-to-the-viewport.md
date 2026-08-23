---
status: accepted
date: 2026-08-22
tags: [decision, components, layout]
---

# 0005 — Dropdown clamps to the viewport, not to its offsetParent

## Context

`Dropdown` centres itself under the control that opened it and, when centring would run it off the side,
shifts to the edge while the caret stays centred under the control. That is what it says it does, and it is
what a consumer expects of it.

What it actually did was measure the edge from its **offsetParent**:

```js
const offsetParentWidth = offsetParent?.offsetWidth ?? window.innerWidth;
const maxLeft = offsetParentWidth - dropdown.offsetWidth - rightMarginOffset;
dropdownLeftPosition = Math.max(0, Math.min(dropdownLeftPosition, maxLeft));
```

Those are two different things. The offsetParent is only the coordinate system the final `left` is written
in; where the screen ends has nothing to do with it. The two agree only when the offsetParent happens to
span the viewport — which was true of the one consumer it was proven against, `AccountMenu` inside a
full-width `Header`.

Give the trigger a snug positioned wrapper — the ordinary thing to do, and what the `position: relative`
recipe in every popover tutorial tells you to do — and the arithmetic inverts. For a 200px menu on a 100px
button, `maxLeft` is `100 - 200 - 10 = -110`; `Math.min` takes it, `Math.max(0, -110)` returns `0`, and the
box opens at the trigger's left edge and runs off the screen. Silently: no error, no clamp, the exact
failure the clamp exists to prevent.

The library already knew. `account-menu.styles.scss` carried a comment telling the next person not to give
the wrapper a positioning context. A component whose correct use depends on a warning in a *consumer's*
stylesheet has put the constraint in the wrong place — the next consumer will not read it, and did not:
`sales-platform`'s deal-page Actions menu hit this the first time it wrapped the trigger.

## Decision

**Clamp to the viewport.** The wanted position is computed in viewport coordinates, clamped against
`document.documentElement.clientWidth` (not `innerWidth` — `clientWidth` excludes a vertical scrollbar, so
the box does not tuck under one), and only then converted into the offsetParent's coordinates for the
`left` it writes. A null offsetParent means a fixed-position ancestor, where the viewport already *is* the
coordinate system and an offset of zero is correct.

`Math.max` is applied last, so a dropdown wider than the viewport pins to the left edge rather than
disappearing off it.

**A consumer may wrap the trigger however it likes.** Positioned or not, snug or wide — the offsetParent no
longer changes whether the box stays on screen. The warning comment in `account-menu.styles.scss` is
replaced with a note that the constraint is gone.

**The caret is clamped too**, to a caret's width in from either end of the box, so a trigger hard against
the screen edge cannot push it off the box's own corner. Before, the caret took whatever offset the
arithmetic produced.

**The component's doc comment now states the contract it keeps** — that it clamps to the viewport, that the
wrapper is the consumer's business, and that it owns dismissal (click-away, Escape, focus return) so a
consumer adding its own copies will have two handlers racing. The previous comment described the intent
without the caveat that made it wrong.

## Consequences

### Easy

- A consumer can anchor a dropdown to any trigger, in any wrapper, and it stays on screen.
- `AccountMenu` is unaffected in behaviour and loses a constraint it had to document.
- The caret can no longer detach from the box's edge.

### Hard

- Positioning is now viewport-relative, so a dropdown inside a **scrolling container** is clamped to the
  screen rather than to that container. That is right for the page-level menus this serves and wrong for a
  box anchored inside its own scroll area — which is not a case this component has, and which wants a
  portal rather than a different clamp.
- Still `position: absolute`, so an ancestor with `overflow: hidden` can clip it. Viewport clamping does
  not change that; a consumer whose trigger sits inside a clipping ancestor needs a portalled control
  instead.
- **A CLOSED dropdown had to stop occupying the layout, and this change is what exposed it.** Freeing the
  consumer from wrapping its trigger in a positioned ancestor meant the account menu stopped doing so — and
  a closed box, hidden with `visibility: hidden` but never yet positioned (the positioning pass returns
  early unless `open`), then sat at its STATIC place, which for a menu anchored near the right edge is off
  the side of the page. Every route in the consuming app carried a 160px horizontal scrollbar for a menu
  nobody had opened. Closed is now `display: none`: nothing measures the box while it is closed, so
  removing it from the layout costs nothing, and it is measured normally on the open commit that follows.

### Locked in

- Two reads of layout per positioning pass (the trigger's rect, the box's own width). Unchanged in count
  from before, but the arithmetic now assumes the box has been laid out at its natural width before it is
  measured — which the existing rAF / `fonts.ready` repositioning already guarantees.
