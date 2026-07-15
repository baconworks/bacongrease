'use client'
// library
import { ComponentPropsWithoutRef, FC } from "react";

// helpers
import { cleanClasses } from "../utils/clean-classes";

// styles
import './hamburger.styles.scss';

// types
export interface HamburgerProps extends ComponentPropsWithoutRef<'button'> {
  bars?: 3;
  open?: boolean;
};

const Hamburger: FC<HamburgerProps> = ({ bars = 3, open = false, ...buttonProps }) => {
  // create an iterable array from bar count
  const hamburgerBars = Array.from(Array(bars));

  return (
    <button
      className={
        cleanClasses(
          'hamburger',
          { modifiers: [ open ? 'open' : 'closed' ] }
        )
      }
      title={ 'Expand/collapse the navigation menu' }
      style={{ gridAutoRows: `repeat(${ bars }, auto)` }}
      { ...buttonProps }
    >
      { hamburgerBars.map(( _, index ) =>
          <span
            key={ index }
            className={
              cleanClasses(
                'hamburger_bar',
                { modifiers: [ open ? 'open' : 'closed' ] }
              )
            }
          />
        )
      }
    </button>
  )
};

export default Hamburger;
