// types
import type { ComponentPropsWithRef, ReactNode } from 'react';

// helpers
import { cleanClasses } from '../utils/clean-classes';

// styles
import './header.styles.scss';

interface HeaderProps extends ComponentPropsWithRef<'header'> {
  /** Brand / logo slot, left. Framework-specific (an app's <Image>/<Link>), so the app owns it. */
  branding?: ReactNode;
  /** Search slot, center. Absent = no search. Behaviour is app-specific, so the app supplies it. */
  search?: ReactNode;
  /** Optional actions cluster, right of search (Help / Notifications / Inbox…). */
  tools?: ReactNode;
  /** The account widget, far right — typically an <AccountMenu />. Absent = signed-out header. */
  account?: ReactNode;
}

/**
 * The app's top bar — a pure layout frame (no state). It renders its own <header> so a layout shell
 * can drop it straight into a grid area, and arranges four optional slots: branding (left), search
 * (center), a tools cluster, and the account widget (right). It knows nothing about users, search,
 * or sign-out — those live in the slotted components — so nothing app- or domain-specific leaks in.
 */
const Header = ( { branding, search, tools, account, className, ...headerProps }: HeaderProps ) => {
  return (
    <header { ...headerProps } className={ cleanClasses( 'header', { classes: className } ) }>
      { branding && <div className="header_branding">{ branding }</div> }

      { search && <div className="header_search">{ search }</div> }

      <div className="header_actions">
        { tools && <div className="header_tools">{ tools }</div> }
        { account && <div className="header_account">{ account }</div> }
      </div>
    </header>
  );
};

export default Header;
