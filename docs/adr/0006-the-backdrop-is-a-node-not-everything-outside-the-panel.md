---
status: accepted
date: 2026-09-02
tags: [decision, components, events]
---

# 0006 — The backdrop is a node, not everything outside the panel

## Context

`Modal` closes when someone clicks the backdrop. It already tracked where the press STARTED, because
closing on the release alone threw away whatever the user had typed: select some text inside the panel,
drag past its edge, let go, and the dialog vanished. Tracking the press origin fixed that, and it still
holds here.

The test it used to decide "backdrop" was **everything outside the panel**:

```js
pressedOnBackdrop.current = !modalRef.current?.contains(event.target as Node);
```

That reads as a definition of the backdrop, and it is not one. It is the definition of *not the panel*,
which is a larger set — and it grew larger the moment a consumer put a portaled control inside a dialog.

A dropdown belonging to a field in the panel is routinely portaled to `<body>` so it can escape the
panel's clipping and scrolling — ADR-0005 names that as the answer for a box anchored inside its own
scroll area, and the consuming app took it (its ADR-0211 moved both comboboxes onto a portaled,
viewport-clamped list for exactly this reason). Such a menu is **a React child of the modal and not a DOM
descendant of the panel.** Those two facts are usually stated separately; together they are the bug.
Because React routes events through the *React* tree rather than the DOM tree, a press on that menu
bubbles into these very handlers — and because the node really does sit at `<body>`,
`modalRef.contains(target)` answers **no**. Every press on an option was therefore a backdrop press, and
the dialog closed underneath the option being chosen.

It never showed while a second bug was live. In the consuming app the portaled list was destroying the
option before the click landed, so nothing reached this handler at all; the two bugs cancelled into "the
picker does nothing," which is why neither was diagnosable from the symptom.

## Decision

**The backdrop is the modal's own root element, so the test is `event.target === event.currentTarget`.**
A press lands on the backdrop only when it lands on the backdrop NODE. Anything the modal owns — panel
content, or a menu portaled out of it — has some other target, and answers no without the handler needing
to know that portaling happened.

Both handlers use the same test, so the drag-select protection is unchanged: press and release must
**both** be the backdrop node itself.

`modalRef` is gone. It existed only to be interrogated with `contains`, and nothing asks that question now.

**The doc comment states why the test is identity rather than containment**, since `!contains(panel)` is
the form a reader would otherwise write back in — it looks equivalent and is not.

## Consequences

### Easy

- A consumer can put any portaled control — combobox, currency picker, date popup — inside a dialog, and
  the dialog stops closing under it. The Modal needs to know nothing about the control.
- One fewer ref and one fewer node relationship to reason about; the handlers are now two identity checks.
- The rule generalises: **anything the modal owns is inside it, wherever the DOM put it.**

### Hard

- **It depends on the portaled node being a React child of the modal.** That is what makes its events
  bubble here at all. A menu portaled from a component rendered *outside* the modal's tree never reaches
  these handlers — it is neither protected nor able to close the dialog. That is the correct boundary, but
  it is a boundary, and it is invisible in the markup.
- **A consumer that renders an element as a direct child of the modal ROOT** — rather than inside
  `modal_content` — would now read as the backdrop, where before it read as "not the panel" and also
  closed. The behaviour is the same for that case; the reason differs, which matters when debugging.
- **There is no regression test, because this package has no test runner** (`typecheck`, `build`,
  `storybook`). The guard is the doc comment plus the consuming app's own coverage. Adding a runner here is
  worth doing and is not this change.

### Locked in

- **The root element IS the backdrop.** A future restructure that inserts a wrapper between the root and
  `modal_content`, or that paints the backdrop as its own sibling node, must move these handlers onto
  whichever node is actually the backdrop — the identity test is exact, so it fails closed (the dialog
  stops closing) rather than silently, which is the failure direction to want.
- Dismissal stays the Modal's, alongside Escape and focus return; a consumer adding its own click-away
  will have two handlers racing.
