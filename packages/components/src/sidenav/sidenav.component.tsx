'use client'
// types
import type {
  ComponentPropsWithoutRef,
  ElementType,
  ReactElement,
  ReactNode
} from 'react';

// hooks
import { useState } from 'react';

// components
import Hamburger from '../hamburger/hamburger.component';
import Link from '../link/link.component';

// helpers
import { cleanClasses } from '../utils/clean-classes';

// styles
import './sidenav.styles.scss';

export type SideNavLinkData = {
  href: string;
  text: string;
  title: string;
  /** Optional icon element rendered before the link text */
  icon?: ReactElement;
  /** Optional explicit active state. Overrides the `pathname` computation. */
  active?: boolean;
};

export interface SideNavProps extends ComponentPropsWithoutRef<'nav'> {
  linksData: SideNavLinkData[];
  /**
   * Optional slot rendered above the nav links — e.g. a compose/new action
   * button. The host app owns whatever goes here.
   */
  action?: ReactNode;
  /**
   * Current pathname. When provided, each link's active state is computed
   * automatically: exact match for '/', `startsWith` for everything else.
   * A link's own `active` field takes precedence.
   */
  pathname?: string;
  /**
   * Optional custom link component forwarded to each Link's `as` prop (e.g. the
   * Next.js `Link`) so navigation stays client-side.
   */
  linkAs?: ElementType;
};

const Sidenav = ({
  action,
  className,
  linksData,
  linkAs,
  pathname,
  ...navProps
}: SideNavProps) => {
  // handle expand and collapse state
  const [ open, setOpen ] = useState(false);
  const [ collapsed, setCollapsed ] = useState(true);

  const toggleOpen = () => {
    if (open) {
      setOpen(false);
      setCollapsed(true);
    } else {
      setOpen(true);
      setCollapsed(false);
    }
  };

  const handleMouseEnter = () => {
    setCollapsed(false);
  };

  const handleMouseLeave = () => {
    if (!open) setCollapsed(true);
  };

  // resolve a link's active state: explicit override first, then pathname match
  const resolveActive = ( link: SideNavLinkData ) => {
    if (link.active !== undefined) return link.active;
    if (pathname === undefined) return false;
    return link.href === '/' ?
      pathname === '/' :
      pathname.startsWith(link.href);
  };

  return (
    <nav
      { ...navProps }
      aria-label='Sidebar navigation'
      className={
        cleanClasses(
          'sidenav',
          {
            classes: className,
            modifiers: [ `${ open || !collapsed ? 'expanded' : 'collapsed' }` ]
          }
        )
      }
    >
      {/* hamburger toggles collapsed/expanded state */}
      <Hamburger
        onClick={ toggleOpen }
        aria-expanded={ open }
        aria-controls='Sidebar navigation'
        aria-label='Toggle sidebar navigation menu'
      />

      { action &&
          <div
            className={
              cleanClasses(
                'sidenav_action',
                { modifiers: [ collapsed ? 'collapsed' : 'expanded' ] }
              )
            }
          >
            { action }
          </div>
      }

      <ul className={ cleanClasses('sidenav_nav-links-ul') }>
        {
          linksData.map(( linkData, index ) =>
            <li
              key={ index }
              className={ cleanClasses('sidenav_nav-links-li') }
              onMouseEnter={ handleMouseEnter }
              onMouseLeave={ handleMouseLeave }
            >
              <Link
                href={ linkData.href }
                text={ linkData.text }
                title={ linkData.title }
                as={ linkAs }
                active={ resolveActive(linkData) }
                className={ cleanClasses('sidenav_nav-link') }
                icon={ linkData.icon }
              />
            </li>
          )
        }
      </ul>
    </nav>
  )
};

export default Sidenav;
