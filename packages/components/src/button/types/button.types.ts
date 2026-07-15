import type { ComponentPropsWithoutRef } from 'react';
import type { IconType } from 'react-icons';

/**
 * Provides an interface for the Button component to provide custom styles,
 * pass an icon, set the text, and set the variant and style options.
*/
export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
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
  variant?: ButtonVariants;
};

/**
  * Variants set the color and gradient for the button and map to
  * SCSS class modifiers in the button stylesheet
*/
export enum ButtonVariants {
  primary = 'primary',
  secondary = 'secondary',
  tertiary = 'tertiary',
  greyscale = 'greyscale',
  microsoftDark = 'microsoft-dark',
  microsoftLight = 'microsoft-light'
};

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
