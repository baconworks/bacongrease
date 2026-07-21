'use client'
// types
import type {
  ComponentPropsWithoutRef,
  ElementType,
  ReactElement
} from 'react';

// hooks
import { useId, useState } from 'react';

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

export type SideNavSection = {
  /** Optional group heading, shown when the nav is expanded. */
  label?: string;
  links: SideNavLinkData[];
};

export interface SideNavProps extends ComponentPropsWithoutRef<'nav'> {
  /** Flat list of links — the simple case. Ignored when `sections` is given. */
  linksData?: SideNavLinkData[];
  /**
   * Grouped links, each with an optional heading. The component only renders
   * what it's handed — deciding which links/sections a user may see (role or
   * plan gating) is the host app's job, not the nav's.
   */
  sections?: SideNavSection[];
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
  /**
   * The expand/collapse control at the top of the nav:
   * - `'none'` — a plain static hamburger that toggles the nav, no morph (default)
   * - `'x'` — a hamburger that morphs to an ✕ when expanded
   * - `'chevron'` — a standalone chevron that flips direction (points in to collapse, out to expand)
   */
  toggle?: 'x' | 'chevron' | 'none';
};

const Sidenav = ({
  className,
  linksData,
  sections,
  linkAs,
  pathname,
  toggle = 'none',
  ...navProps
}: SideNavProps) => {
  // The toggle pins the expanded/collapsed state (no hover-to-expand: it mis-fires and reflows
  // content — a pinned toggle is deliberate).
  const [ expanded, setExpanded ] = useState(false);
  const toggleExpanded = () => setExpanded(( prev ) => !prev);

  // id for the links region so the hamburger's aria-controls points at a real element.
  const linksId = useId();

  // Normalise whatever we're handed into sections; a flat list is one unlabelled section.
  const groups: SideNavSection[] = sections ?? [ { links: linksData ?? [] } ];

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
            modifiers: [ expanded ? 'expanded' : 'collapsed' ]
          }
        )
      }
    >
      {/* the expand/collapse control — a chevron, or a hamburger (morphing to an ✕ when 'x') */}
      { toggle === 'chevron' ?
          <button
            type='button'
            className={
              cleanClasses(
                'sidenav_toggle',
                { modifiers: [ expanded ? 'expanded' : 'collapsed' ] }
              )
            }
            onClick={ toggleExpanded }
            aria-expanded={ expanded }
            aria-controls={ linksId }
            aria-label='Toggle sidebar navigation menu'
            title='Expand/collapse the navigation menu'
          >
            <span className='sidenav_chevron' aria-hidden='true' />
          </button> :
          <Hamburger
            open={ toggle === 'x' && expanded }
            onClick={ toggleExpanded }
            aria-expanded={ expanded }
            aria-controls={ linksId }
            aria-label='Toggle sidebar navigation menu'
          />
      }

      <div className='sidenav_sections' id={ linksId }>
        {
          groups.map(( section, sectionIndex ) =>
            <div
              className='sidenav_section'
              key={ section.label ?? sectionIndex }
            >
              { section.label &&
                  <span className='sidenav_section-label'>{ section.label }</span>
              }
              <ul className='sidenav_nav-links-ul'>
                {
                  section.links.map(( linkData ) =>
                    <li
                      key={ linkData.href }
                      className='sidenav_nav-links-li'
                    >
                      <Link
                        href={ linkData.href }
                        text={ linkData.text }
                        title={ linkData.title }
                        as={ linkAs }
                        active={ resolveActive(linkData) }
                        className='sidenav_nav-link'
                        icon={ linkData.icon }
                      />
                    </li>
                  )
                }
              </ul>
            </div>
          )
        }
      </div>
    </nav>
  )
};

export default Sidenav;
