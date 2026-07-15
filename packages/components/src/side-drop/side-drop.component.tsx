'use client'
// types
import type { ComponentPropsWithoutRef, RefObject } from "react";

// hooks
import { useCallback, useEffect, useRef } from "react";

// helpers
import { cleanClasses } from "../utils/clean-classes";

// styles
import './side-drop.styles.scss';

interface SideDropProps extends ComponentPropsWithoutRef<'div'> {
  direction?: 'left' | 'right';
  open: boolean;
  targetRef: RefObject<HTMLElement | null>;
  onClose: () => void;
  styleOptions?: {
    marginLeft?: number;
    marginRight?: number;
  }
};

/** The side-sideDrop down is designed to automatically position itself
  * centered to the right or left of its target component unless that would cause it to
  * overflow to the top or bottom. In that case, the sideDrop positions
  * itself at the top or bottom edge while the carat maintains center position
  * under the target component.
*/
const SideDrop = ({
  children,
  className,
  direction = 'right',
  open = false,
  onClose,
  styleOptions = {
   marginLeft: 50,
   marginRight: 50
  },
  targetRef,
  ...divProps
}: SideDropProps) => {
  const sideDropRef = useRef<HTMLDivElement>(null);
  const { marginLeft = 50, marginRight = 50 } = styleOptions ?? {};
  const computedStyle = {
    ...( direction === 'right' && { marginLeft } ),
    ...( direction === 'left' && { marginRight } )
  };

  const positionSideDrop = useCallback(() => {
    // exit if components have not mounted yet
    if (!open || !targetRef.current || !sideDropRef.current) return;

    // get references to the components
    const target = targetRef.current;
    const sideDrop = sideDropRef.current;

    // calculate target center position
    const targetRect = target.getBoundingClientRect();
    const targetCenter = targetRect.top + targetRect.height / 2;

    // calculate sideDrop's centered position to the left or right of target
    const sideDropHeight = sideDrop.offsetHeight;
    const offsetParent = sideDrop.offsetParent as HTMLElement | null;
    const offsetParentTop = offsetParent?.getBoundingClientRect().top ?? 0;
    let sideDropTopPosition = targetCenter - offsetParentTop - sideDropHeight / 2;

    // prevent sideDrop from overflowing top/bottom edges
    const offsetParentHeight = offsetParent?.offsetHeight ?? window.innerHeight;
    const topMarginOffset = 10;
    const maxTop = offsetParentHeight - sideDrop.offsetHeight - topMarginOffset;

    sideDropTopPosition = Math.max(0, Math.min(sideDropTopPosition, maxTop));

    // set the top position in the sideDrop's style prop
    sideDrop.style.top = `${ sideDropTopPosition }px`;

    const sideDropRect = sideDrop.getBoundingClientRect();
    const caret = sideDrop.querySelector('.side-drop_caret') as HTMLElement | null;
    const caretTop = targetCenter - sideDropRect.top;

    if (caret) caret.style.top = `${ caretTop - 6 }px`;
  }, [ open, targetRef, sideDropRef ]);

  // position sideDrop on open
  useEffect(() => {
    if (!open || !targetRef.current) return;

    const observer = new ResizeObserver(() => {
      positionSideDrop();
    });

    observer.observe(targetRef.current);

    return () => observer.disconnect();
  }, [ open, positionSideDrop, targetRef ]);

  // position sideDrop on window resizing
  useEffect(() => {
    const handleResize = () => {
      if (open) positionSideDrop();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [ open, positionSideDrop ]);

  // click outside to close sideDrop
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = ( event: MouseEvent ) => {
      const target = event.target as Node;

      if (
        targetRef.current &&
        sideDropRef.current &&
        !targetRef.current.contains(target) &&
        !sideDropRef.current.contains(target)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ open, positionSideDrop, onClose, targetRef ]);

  return (
    <div
      { ...divProps }
      ref={ sideDropRef }
      style={ computedStyle }
      className={
        cleanClasses(
          'side-drop',
          {
            modifiers: open ? [ 'open' ] : [ 'closed' ],
            classes: className
          }
        )
      }
    >
      <div className="side-drop_caret" />
      { children }
    </div>
  )
};

export default SideDrop;
