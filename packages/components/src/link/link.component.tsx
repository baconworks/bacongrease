// types
import type {
  ComponentPropsWithoutRef,
  ElementType,
  ReactElement,
  ReactNode
} from 'react';

// helpers
import { cleanClasses } from '../utils/clean-classes';

// styles
import './link.styles.scss';

export interface LinkProps extends Omit<ComponentPropsWithoutRef<'a'>, 'href'> {
  /**
   * The element or component to render as the underlying link. Defaults to a
   * native anchor (`'a'`). Pass a framework link component (e.g. the Next.js
   * `Link` or a React Router `Link`) to integrate with client-side routing —
   * the `href` and remaining props are forwarded to it.
   */
  as?: ElementType;
  /** Destination. Forwarded to the underlying element/component. */
  href: string;
  /** Optional active state */
  active?: boolean;
  /** Optional ReactNode. Renders after any icon/text. */
  children?: ReactNode;
  /** Optional class name */
  className?: string;
  /** Optional icon element (e.g. a Bacongrease <Icon />) rendered before the text */
  icon?: ReactElement;
  /** Optionally sets the underlying element's target attribute */
  target?: '_blank' | '_self' | '_parent' | '_top';
  /** Optional link text. Will be overridden by any children passed to the link. */
  text?: string;
  /**
   * Optional string that passes to the title of the underlying anchor element
   * and displays as a tooltip to the user hovering the link.
   *
   * For accessibility, it should helpfully indicate to the user where the link
   * will take them.
  */
  title: string;
};

/**
 * A framework-agnostic link. Renders a native anchor by default and adds a
 * meaningful `aria-label` when the link opens somewhere other than the current
 * frame. Pass `as` to swap in a router-aware link component.
 */
const Link = ({
  as: Component = 'a',
  active,
  children,
  className,
  icon,
  text,
  title,
  target = '_self',
  ...linkProps
}: LinkProps) => {
  // sets a meaningful aria-label to the link when a target destination other
  // than '_self' is set. Informs users of screen-readers of this behavior.
  let ariaLabel: string | undefined;

  switch (target) {
    case '_blank':
      ariaLabel = `${ title } opens in a new tab`;
      break;
    case '_parent':
      ariaLabel = `${ title } opens in the parent frame`;
      break;
    case '_top':
      ariaLabel = `${ title } opens in the full body of the window`
      break;
    default:
      ariaLabel = undefined
  };

  return (
    <Component
      { ...linkProps }
      aria-label={ ariaLabel }
      target={ target }
      title={ title }
      className={
        cleanClasses(
          'link',
          {
            modifiers: [ active ? 'active' : undefined ],
            classes: className
          }
        )
      }
    >
      { icon }
      { text &&
          <span className={ cleanClasses('link_text') }>
            { text }
          </span>
      }
      { children }
    </Component>
  )
};

export default Link;
