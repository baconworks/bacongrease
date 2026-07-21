'use client';

// types
import type { ComponentPropsWithRef, MouseEvent } from 'react';

// hooks
import { useEffect, useState } from 'react';

// icons
import { FaMoon, FaSun } from 'react-icons/fa';

// helpers
import { cleanClasses } from '../utils/clean-classes';

// styles
import './theme-toggle.styles.scss';

type Theme = 'light' | 'dark';

interface ThemeToggleProps extends ComponentPropsWithRef<'button'> {
  /** localStorage key the choice persists under. Override per app to avoid cross-app collisions. */
  storageKey?: string;
}

/**
 * Light/dark switch. Stamps `data-theme` on the document root, which the token layer reads to flip
 * the whole tree (light/dark redefine the same custom properties). Persists the choice; until it
 * mounts nothing is stamped, so the app follows the OS (`prefers-color-scheme`) with no forced
 * default. Theming is the library's own concern (the tokens live here), so the toggle does too.
 */
const ThemeToggle = ( { className, storageKey = 'bg-theme', onClick, ...buttonProps }: ThemeToggleProps ) => {
  const [ theme, setTheme ] = useState<Theme | null>( null );

  useEffect( () => {
    const stored = window.localStorage.getItem( storageKey ) as Theme | null;
    if (stored) {
      setTheme( stored );
      document.documentElement.setAttribute( 'data-theme', stored );
    }
  }, [ storageKey ] );

  // Cross-tab sync: the `storage` event fires only in OTHER tabs when our key changes (never the
  // one that made the change — it already updated synchronously in `toggle`), so following it keeps
  // every open tab on the same theme. It rides on the `setItem` above — no separate channel needed.
  useEffect( () => {
    const followOtherTabs = ( event: StorageEvent ) => {
      if (event.key !== storageKey) return;

      const next = event.newValue as Theme | null;
      if (next === 'light' || next === 'dark') {
        setTheme( next );
        document.documentElement.setAttribute( 'data-theme', next );
      }
    };

    window.addEventListener( 'storage', followOtherTabs );
    return () => window.removeEventListener( 'storage', followOtherTabs );
  }, [ storageKey ] );

  const toggle = ( event: MouseEvent<HTMLButtonElement> ) => {
    const resolved: Theme =
      theme ?? ( window.matchMedia( '(prefers-color-scheme: dark)' ).matches ? 'dark' : 'light' );
    const next: Theme = resolved === 'dark' ? 'light' : 'dark';

    setTheme( next );
    document.documentElement.setAttribute( 'data-theme', next );
    window.localStorage.setItem( storageKey, next );

    onClick?.( event );
  };

  return (
    <button
      type="button"
      aria-label="Toggle light or dark theme"
      title="Toggle light or dark theme"
      { ...buttonProps }
      className={ cleanClasses( 'theme-toggle', { classes: className } ) }
      onClick={ toggle }
    >
      { theme === 'dark' ? <FaSun size={ 18 } /> : <FaMoon size={ 18 } /> }
    </button>
  );
};

export default ThemeToggle;
