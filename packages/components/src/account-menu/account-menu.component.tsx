'use client';

// types
import type { ReactNode } from 'react';
import type { AccountUser } from './account-menu.types';

// hooks
import { useRef, useState } from 'react';

// components
import Dropdown from '../dropdown/dropdown.component';
import ThemeToggle from '../theme-toggle/theme-toggle.component';

// helpers
import { cleanClasses } from '../utils/clean-classes';

// styles
import './account-menu.styles.scss';

interface AccountMenuProps {
  /** Who's signed in. At least one of firstName / lastName is required (enforced by the type). */
  user: AccountUser;
  /** Extra dropdown items above the theme / sign-out rows (Settings, Profile…). */
  menu?: ReactNode;
  /** When provided, renders a "Sign out" item; the app owns what signing out does. */
  onLogout?: () => void;
  /** Render the theme switch in the dropdown (default true). */
  themeToggle?: boolean;
  /** Passed through to the theme switch so the app can namespace its persisted preference. */
  themeStorageKey?: string;
  className?: string;
}

const initials = ( user: AccountUser ) =>
  [ user.firstName?.[ 0 ], user.lastName?.[ 0 ] ].filter( Boolean ).join( '' ).toUpperCase();

const fullName = ( user: AccountUser ) =>
  [ user.firstName, user.lastName ].filter( Boolean ).join( ' ' );

/**
 * The account widget: an initials circle (derived from the name, or an avatar image if given) that
 * opens a dropdown. The dropdown lays out whatever identity fields it was handed — name, username,
 * email, role/department — then the theme switch and sign-out. Owns its own open/closed state and
 * anchoring; everything app-specific (what sign-out does, any extra menu items) is a callback or slot.
 */
const AccountMenu = ( {
  user,
  menu,
  onLogout,
  themeToggle = true,
  themeStorageKey,
  className,
}: AccountMenuProps ) => {
  const [ open, setOpen ] = useState( false );
  const accountRef = useRef<HTMLButtonElement>( null );

  const close = () => setOpen( false );

  return (
    <div className={ cleanClasses( 'account-menu', { classes: className } ) }>
      <button
        type="button"
        ref={ accountRef }
        className="account-menu_avatar"
        aria-haspopup="true"
        aria-expanded={ open }
        aria-label={ `Account menu for ${ fullName( user ) }` }
        title={ fullName( user ) }
        onClick={ () => setOpen( ( isOpen ) => !isOpen ) }
      >
        { user.imageUrl
          ? <img className="account-menu_avatar-image" src={ user.imageUrl } alt="" />
          : <span className="account-menu_initials">{ initials( user ) }</span> }
      </button>

      <Dropdown
        className="account-menu_dropdown"
        targetRef={ accountRef }
        open={ open }
        onClose={ close }
      >
        <div className="account-menu_identity">
          <span className="account-menu_identity-avatar" aria-hidden="true">
            { user.imageUrl
              ? <img src={ user.imageUrl } alt="" />
              : initials( user ) }
          </span>

          <span className="account-menu_identity-text">
            <span className="account-menu_name">{ fullName( user ) }</span>
            { user.username && <span className="account-menu_username">@{ user.username }</span> }
            { user.email && <span className="account-menu_email">{ user.email }</span> }
            { ( user.role || user.department ) && (
              <span className="account-menu_role">
                { [ user.role, user.department ].filter( Boolean ).join( ' · ' ) }
              </span>
            ) }
          </span>
        </div>

        { ( menu || themeToggle || onLogout ) && <hr className="account-menu_divider" /> }

        { menu && <div className="account-menu_items">{ menu }</div> }

        { themeToggle && (
          <div className="account-menu_row">
            <span className="account-menu_row-label">Theme</span>
            <ThemeToggle storageKey={ themeStorageKey } />
          </div>
        ) }

        { onLogout && (
          <button
            type="button"
            className="account-menu_item account-menu_logout"
            onClick={ () => { close(); onLogout(); } }
          >
            Sign out
          </button>
        ) }
      </Dropdown>
    </div>
  );
};

export default AccountMenu;
