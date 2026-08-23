'use client'
// types
import type { ComponentPropsWithoutRef, RefObject } from "react";

// hooks
import { useCallback, useEffect, useRef } from "react";

// helpers
import { cleanClasses } from "../utils/clean-classes";

// styles
import './dropdown.styles.scss';

interface DropdownProps extends ComponentPropsWithoutRef<'div'> {
  open: boolean;
  targetRef: RefObject<HTMLElement | null>;
  onClose: () => void;
  styleOptions?: {
    marginTop?: number;
  };
  variant?: 'down' | 'up';
};

/**
 * A floating box that positions itself centred under the control that opened it, and — when centring
 * would run it off the left or right of the SCREEN — shifts to that edge while the caret stays centred
 * under the control, so it still points at what opened it.
 *
 * It clamps to the VIEWPORT. A caller may put the trigger in whatever wrapper suits it, positioned or
 * not, snug or wide: the offsetParent decides only which coordinates the final `left` is written in.
 * (It used to measure the screen edge from the offsetParent, which meant it only stayed on screen when
 * that ancestor happened to span the viewport — see ADR-0005.)
 *
 * It also owns dismissal: click away, Escape, and returning focus to the trigger on close. A caller
 * that adds its own copies of those will have two handlers racing.
 *
 * `targetRef` is the trigger to measure against. `variant` opens it downwards or upwards.
 */
const Dropdown = ({
  children,
  className,
  open = false,
  onClose,
  styleOptions = {
    marginTop: 20
  },
  targetRef,
  variant = 'down',
  ...divProps
}: DropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const positionDropdown = useCallback(() => {
    // exit if components have not mounted yet
    if (!open || !targetRef.current || !dropdownRef.current) return;

    // get references to the components
    const target = targetRef.current;
    const dropdown = dropdownRef.current;

    // calculate target center position
    const targetRect = target.getBoundingClientRect();
    const targetCenter = targetRect.left + targetRect.width / 2;

    const dropdownWidth = dropdown.offsetWidth;

    // WHERE IT WANTS TO BE, in VIEWPORT coordinates: centred under the trigger.
    const wantedLeft = targetCenter - dropdownWidth / 2;

    // CLAMPED TO THE VIEWPORT — not to the offsetParent, which is what this used to do. The offsetParent
    // is only the coordinate system the `left` is finally written in; it has nothing to do with where the
    // screen ends. Measuring the edge from it meant the component only stayed on screen when its
    // offsetParent happened to span the viewport, and collapsed to `left: 0` (opening at the trigger and
    // running off the side) whenever a caller wrapped the trigger in a snug positioned box — which is the
    // ordinary thing to do, and what AccountMenu carried a comment to warn against.
    // `clientWidth` rather than `innerWidth`: it excludes a vertical scrollbar, so the box does not tuck
    // underneath one.
    const edgeMargin = 10;
    const viewportWidth = document.documentElement.clientWidth;
    const maxLeft = viewportWidth - dropdownWidth - edgeMargin;
    // `max` last, so a dropdown wider than the viewport pins to the left edge rather than off the left.
    const left = Math.max(edgeMargin, Math.min(wantedLeft, maxLeft));

    // Written back in the offsetParent's coordinates. Null offsetParent means a fixed-position ancestor,
    // where the viewport IS the coordinate system — so an offset of 0 is already right.
    const offsetParent = dropdown.offsetParent as HTMLElement | null;
    const offsetParentLeft = offsetParent?.getBoundingClientRect().left ?? 0;
    dropdown.style.left = `${ left - offsetParentLeft }px`;

    // THE CARET HOLDS ITS PLACE UNDER THE TRIGGER wherever the box ended up — that is what keeps the menu
    // pointing at the control that opened it once it has shifted to an edge. It is kept a caret's width in
    // from either end, so it never hangs off the box's own corner when the trigger is near the screen edge.
    const caret = dropdown.querySelector('.dropdown_caret') as HTMLElement | null;
    if (caret) {
      const caretWidth = caret.offsetWidth || 12;
      const wantedCaretLeft = targetCenter - left - caretWidth / 2;
      const maxCaretLeft = dropdownWidth - caretWidth * 2;
      caret.style.left = `${ Math.max(caretWidth, Math.min(wantedCaretLeft, maxCaretLeft)) }px`;
    }
  }, [ open, targetRef, dropdownRef ]);

  // position dropdown on open
  useEffect(() => {
    if (!open || !targetRef.current) return;

    const observer = new ResizeObserver(() => {
      positionDropdown();
    });

    observer.observe(targetRef.current);

    return () => observer.disconnect();
  }, [ open, positionDropdown, targetRef ]);

  // position dropdown on window resizing
  useEffect(() => {
    const handleResize = () => {
      if (open) positionDropdown();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [ open, positionDropdown ]);

  // Reposition after layout settles on open. The target's ResizeObserver misses a shift where the
  // trigger only MOVES (not resizes) — e.g. a web font swapping in reflows the header and slides the
  // trigger sideways, so the first-open caret would otherwise point at the pre-swap position. A rAF
  // (post-layout) and `document.fonts.ready` cover that; the cancelled flag ignores a late resolve
  // after close.
  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    const reposition = () => { if (!cancelled) positionDropdown(); };

    const frame = requestAnimationFrame(reposition);
    document.fonts?.ready.then(reposition);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [ open, positionDropdown ]);

  // click outside to close dropdown
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = ( event: MouseEvent ) => {
      const target = event.target as Node;

      if (
        targetRef.current &&
        dropdownRef.current &&
        !targetRef.current.contains(target) &&
        !dropdownRef.current.contains(target)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ open, positionDropdown, onClose, targetRef ]);

  // Keyboard: Escape closes (a keyboard/screen-reader user must be able to dismiss it, not only
  // click away).
  useEffect(() => {
    if (!open) return;

    const handleEscape = ( event: KeyboardEvent ) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [ open, onClose ]);

  // Focus management: on open, move focus into the dropdown (its first focusable child, else the
  // container) so keyboard users land inside it; on close, return focus to the trigger. Without this
  // a keyboard user opens the menu but focus stays on the page behind it.
  useEffect(() => {
    if (!open) return;

    const trigger = targetRef.current;
    const dropdown = dropdownRef.current;
    const firstFocusable = dropdown?.querySelector<HTMLElement>(
      'a[href], button:not(:disabled), input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    // preventScroll: opening the menu shouldn't scroll the page to bring the focus target into view.
    ( firstFocusable ?? dropdown )?.focus({ preventScroll: true });

    return () => trigger?.focus?.({ preventScroll: true });
  }, [ open, targetRef ]);

  return (
    <div
      { ...divProps }
      ref={ dropdownRef }
      tabIndex={ -1 }
      style={{ marginTop: styleOptions.marginTop }}
      className={
        cleanClasses(
          'dropdown',
          {
            modifiers: [
              open ? 'open' : 'closed',
              variant === 'down' ? 'down' : 'up'
             ],
            classes: className
          }
        )
      }
    >
      <div
        className={
          cleanClasses(
            'dropdown_caret',
            { modifiers: [ variant === 'down' ? 'down' : 'up' ] }
          )
        }
      />
      { children }
    </div>
  )
};

export default Dropdown;
