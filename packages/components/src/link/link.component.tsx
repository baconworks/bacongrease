// types
import type {
  ComponentPropsWithRef,
  ElementType,
  ReactElement,
  ReactNode
} from 'react';

// helpers
import { cleanClasses } from '../utils/clean-classes';

// styles
import './link.styles.scss';

export interface LinkProps extends Omit<ComponentPropsWithRef<'a'>, 'href'> {
  /**
   * The element or component to render as the underlying link. Defaults to a
   * native anchor (`'a'`). Pass a framework link component (e.g. the Next.js
   * `Link` or a React Router `Link`) to integrate with client-side routing —
   * the `href`, `ref`, and remaining props are forwarded to it.
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
   * Optional tooltip (native `title`) for the underlying anchor. Use it when the
   * link's visible text doesn't fully say where it goes; leave it off when the
   * text is already self-describing, so screen readers and hover tooltips aren't
   * given a redundant label.
   */
  title?: string;
};

/**
 * A framework-agnostic link. Renders a native anchor by default and adds a
 * meaningful `aria-label` when the link opens somewhere other than the current
 * frame — unless the consumer supplies their own, which always wins. Pass `as`
 * to swap in a router-aware link component; `ref` is forwarded to it.
 */
const Link = ({
  as: Component = 'a',
  active,
  children,
  className,
  icon,
  ref,
  text,
  title,
  target = '_self',
  'aria-label': ariaLabelProp,
  ...linkProps
}: LinkProps) => {
  // A fallback aria-label announcing that the link opens somewhere other than the
  // current frame, so screen-reader users are told about the change. Only used
  // when the consumer hasn't given an explicit aria-label.
  let targetAriaLabel: string | undefined;

  switch (target) {
    case '_blank':
      targetAriaLabel = title ? `${ title } opens in a new tab` : 'Opens in a new tab';
      break;
    case '_parent':
      targetAriaLabel = title ? `${ title } opens in the parent frame` : 'Opens in the parent frame';
      break;
    case '_top':
      targetAriaLabel = title ? `${ title } opens in the full window` : 'Opens in the full window';
      break;
    default:
      targetAriaLabel = undefined;
  };

  return (
    <Component
      { ...linkProps }
      ref={ ref }
      aria-label={ ariaLabelProp ?? targetAriaLabel }
      target={ target === '_self' ? undefined : target }
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
