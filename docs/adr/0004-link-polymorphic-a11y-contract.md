---
status: accepted
date: 2026-07-22
tags: [decision, components, accessibility, react]
---

# 0004 — Link: polymorphic, ref-forwarding, and consumer a11y wins

## Context

`Link` is the library's navigation primitive, dogfooded by `sales-platform/web` (a Next.js App Router
app). Its first real consumer wiring surfaced three problems, found in an audit:

1. **A consumer's `aria-label` was silently dropped.** The render spread `{ ...linkProps }` and then set
   `aria-label={ ariaLabel }` *after* it. For a same-frame link (`target="_self"`) `ariaLabel` is
   `undefined`, so any consumer-supplied `aria-label` was overwritten with `undefined` — the a11y
   escape hatch was broken in the common case.
2. **No `ref` forwarding.** The component neither typed nor forwarded `ref`, against this library's own
   convention (a single-element component extends that element's props and forwards `ref`, React 19).
   With `as={NextLink}`, a dropped ref means no access to the underlying anchor.
3. **`title` was required.** Every link got a native `title` tooltip, even when its visible text
   already said where it goes (a table title, a "← Back" link) — a redundant tooltip and a
   double-announce for screen readers.

`Link` is deliberately **polymorphic** (`as` swaps in a framework link — Next.js, React Router — for
client routing). That is the right shape; the fixes had to preserve it.

## Decision

Keep `Link` polymorphic and make its contract correct:

- **Consumer `aria-label` always wins.** Destructure `aria-label` out of props and render
  `aria-label={ ariaLabelProp ?? targetAriaLabel }`. The generated "opens in a new tab / parent /
  window" label is now only a **fallback** for non-`_self` targets when the consumer gave none.
- **Forward `ref`.** Props extend `ComponentPropsWithRef<'a'>`; `ref` is destructured and passed to the
  underlying element/component (so it reaches the anchor, or Next's `Link`).
- **`title` is optional.** Use it only when the visible text isn't self-describing. The target-aware
  aria-label falls back to a title-free phrasing ("Opens in a new tab") when no title is given.
- **`target="_self"` is not emitted.** Only a non-default target reaches the DOM (`target={ target ===
  '_self' ? undefined : target }`) — no needless attribute.

## Consequences

**Easier**
- Consumers can label a link for screen readers (or leave text-only links untooltipped) and the
  component respects it.
- `as={NextLink}` links can take a `ref`, matching every other single-element component here.
- `web/` can dogfood `Link` for real navigation (title only where it adds meaning).

**Harder**
- `title` moving from required to optional is a **widening** (backward-compatible) — existing callers
  passing `title` are unaffected — but authors must now *decide* when a tooltip helps rather than
  always supplying one.

**Locked in**
- `Link` stays polymorphic via `as`; routing integration remains the consumer's (pass the framework
  link), the library never depends on a router.
- Precedence is fixed: an explicit consumer `aria-label` overrides the generated target-change label.
