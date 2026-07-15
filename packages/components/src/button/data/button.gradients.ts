import { LinearGradientStop } from "../../linear-gradient/linear-gradient.component";

/**
 * This object configures the gradient variants for the button icon. SVG gradients
 * can't be set as backgrounds and animated like css linear-gradients. Instead,
 * the color stops can be targeted with css classes and animated that way.
 *
 * Here, there is an array of stop-color classes from the LinearGradient stylesheet
 * for each variant and a corresponding hover variant. The color classes map to the
 * global color families defined in the global color variables stylesheet.
 *
 * Having a button-icon-specific configuration allows for granular control of the
 * icon gradient to ensure it displays uniformly with the button gradient for
 * each variant.
 */
export const buttonIconGradientVariants: {
  [ variant: string ]: LinearGradientStop[]
} = {
  primary: [
    { colorClass: 'stop-color-primary-400' },
    { colorClass: 'stop-color-primary-500' },
    { colorClass: 'stop-color-primary-600' },
  ],
  primaryHover: [
    { colorClass: 'stop-color-primary-100' },
    { colorClass: 'stop-color-primary-200' },
    { colorClass: 'stop-color-primary-300' },
  ],
  secondary: [
    { colorClass: 'stop-color-secondary-400' },
    { colorClass: 'stop-color-secondary-500' },
    { colorClass: 'stop-color-secondary-600' },
  ],
  secondaryHover: [
    { colorClass: 'stop-color-secondary-100' },
    { colorClass: 'stop-color-secondary-200' },
    { colorClass: 'stop-color-secondary-300' },
  ],
  tertiary: [
    { colorClass: 'stop-color-tertiary-400' },
    { colorClass: 'stop-color-tertiary-500' },
    { colorClass: 'stop-color-tertiary-600' },
  ],
  tertiaryHover: [
    { colorClass: 'stop-color-tertiary-100' },
    { colorClass: 'stop-color-tertiary-200' },
    { colorClass: 'stop-color-tertiary-300' },
  ],
  greyscale: [
    { colorClass: 'stop-color-grey-100' },
    { colorClass: 'stop-color-grey-200' },
    { colorClass: 'stop-color-grey-300' },
    { colorClass: 'stop-color-grey-400' },
    { colorClass: 'stop-color-grey-500' },
    { colorClass: 'stop-color-grey-600' },
    { colorClass: 'stop-color-grey-700' },
    { colorClass: 'stop-color-grey-800' },
    { colorClass: 'stop-color-grey-900' },
    { colorClass: 'stop-color-grey-1000' },
    { colorClass: 'stop-color-grey-1100' },
    { colorClass: 'stop-color-grey-1200' },
  ],
  greyscaleHover: [
    { colorClass: 'stop-color-grey-100' },
    { colorClass: 'stop-color-grey-200' },
    { colorClass: 'stop-color-grey-300' },
    { colorClass: 'stop-color-grey-400' },
    { colorClass: 'stop-color-grey-500' },
    { colorClass: 'stop-color-grey-600' },
  ],
}
