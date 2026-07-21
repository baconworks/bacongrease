import type { ComponentPropsWithRef } from 'react';
import type { IconType } from 'react-icons';

/**
 * Provides an interface for the Button component to provide custom styles,
 * pass an icon, set the text, and set the variant and style options.
*/
export interface ButtonProps extends ComponentPropsWithRef<'button'> {
  /** Optional className allowing user to customize the button style */
  className?: string;
  /**
   * Optional React-Icons svg icon. Displays to the right of the label by default.
   * Can be moved to the left with the 'reverse' styleOption.
   * */
  icon?: IconType;
  /**
   * Optional image url. Displays to the right of the label by default.
   * Can be moved to the left with the 'reverse' styleOption.
  */
  image?: string;
  /** Optional button text */
  label?: string;
  /** Additional style options array */
  styleOptions?: ButtonStyleOption[];
  /**
   * Determines the color variant of the button.
   */
  variant?: ButtonVariant;
};

/**
  * Variants set the color and gradient for the button and map to SCSS class modifiers in the button
  * stylesheet. A string-literal union (not an enum) so a consumer just writes `variant="primary"` —
  * no second import. `buttonVariants` is the runtime list (for iterating, e.g. Storybook controls).
*/
export const buttonVariants = [
  'primary',
  'secondary',
  'tertiary',
  'greyscale',
  'microsoft-dark',
  'microsoft-light',
] as const;

export type ButtonVariant = typeof buttonVariants[number];

export const buttonStyles = [
  'circle',
  'gradient',
  'invert',
  'outline',
  'pill',
  'reverse',
  'shadow',
  'text',
] as const;

/**
 * The style options provide an easy interface for setting common
 * button styles. i.e. Circle creates a circular button, gradient
 * applies a gradient, outline removes the background and adds a
 * border, etc. The options map to SCSS class modifiers in the
 * button stylesheet.
 */
export type ButtonStyleOption = typeof buttonStyles[number];
