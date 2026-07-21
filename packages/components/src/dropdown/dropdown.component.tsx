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

/** The dropdown down is designed to automatically position itself
  * centered underneath its target component unless that would cause it to
  * overflow to the right or left. In that case, the dropdown positions
  * itself at the right or left edge while the carat maintains center position
  * under the target component. It extends ComponentPropsWithRef to allow it to
  * accept a ref prop in order to make these calculations.
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

    // calculate dropdown's centered position under target
    const dropdownWidth = dropdown.offsetWidth;
    const offsetParent = dropdown.offsetParent as HTMLElement | null;
    const offsetParentLeft = offsetParent?.getBoundingClientRect().left ?? 0;
    let dropdownLeftPosition = targetCenter - offsetParentLeft - dropdownWidth / 2;

    // prevent dropdown from overflowing left/right edges
    const offsetParentWidth = offsetParent?.offsetWidth ?? window.innerWidth;
    const rightMarginOffset = 10;
    const maxLeft = offsetParentWidth - dropdown.offsetWidth - rightMarginOffset;

    dropdownLeftPosition = Math.max(0, Math.min(dropdownLeftPosition, maxLeft));

    // set the left position in the dropdown's style prop
    dropdown.style.left = `${ dropdownLeftPosition }px`;

    const dropdownRect = dropdown.getBoundingClientRect();
    const caret = dropdown.querySelector('.dropdown_caret') as HTMLElement | null;
    const caretLeft = targetCenter - dropdownRect.left;

    if (caret) caret.style.left = `${ caretLeft - 6 }px`;
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

    ( firstFocusable ?? dropdown )?.focus();

    return () => trigger?.focus?.();
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
