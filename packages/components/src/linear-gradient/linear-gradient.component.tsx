// library
import { ComponentPropsWithoutRef } from 'react';

// helpers
import { cleanClasses } from '../utils/clean-classes';
import {
  calculateOffset,
  calculateXYFromAngle
} from './helpers/linear-gradient.helpers';

// styles
import './linear-gradient.styles.scss';

// types
export type LinearGradientStop = {
  /**
   * The colorClass string maps to a variant family or custom class defined in the LinearGradient
   * stop-colors stylesheet. The form should follow: `.stop-color-${ variant }-${ number }`.
   */
  colorClass: string;
  /**
   * The offset determines the distance between 0 and 100 the stop color will be placed
   * along the gradient x-axis. By default stop colors are placed evenaly along the axis.
   */
  offset?: number;
  /**
   * Optionally sets stop-color opacity
   */
  opacity?: number;
};

export interface LinearGradientProps extends ComponentPropsWithoutRef<'linearGradient'> {
  /**
   * Sets the direction of the gradient with a number between 0 - 360.
   * By default it's set to start at 305 degrees, or the top-left.
   */
  gradientAngle?: number;
  /**
   * An array of LinearGradientStop objects, each containing a color class and
   * optional offset and opacity values
   */
  gradientStops: LinearGradientStop[];
};

/**
 * The Linear Gradient component extends the SVG Gradient component to allow for
 * dynamic generation of stop colors, opacity and offsets.
 *
 * It accepts an array of LinearGradientStop objects, consisting of a stop color class
 * and optional offset and opacity values. The stop color classes map to SCSS classes defined
 * in the Linear Gradient stylesheet. If only one color class is provided, the component
 * will set the color to both 0 and 1 offsets, creating a solid color gradient.
 * Unless offsets are provided, the stop color offsets are distributed evenly across
 * the x-axis based on the number of color classes provided.
 *
 * Use Case: SVG linear gradients are appropriate when a simple CSS linear gradient is
 * not sufficient and granular control over the gradient behavior is necessary,
 * such as creating complex shapes or animating stop colors. SVG Icon fills cannot be
 * animated so using an SVG gradient and animating the color stops is an alternative.
 *
 * The gradient should have a unique id when it is linked to as a source for fill
 * or stroke color.
 *
 * To adhere to accessibility standards and perceptually uniform color spaces,
 * utilize HCL/LCH or Lab color calculations. Use a tool like leonardo.io to check
 * that selected colors have accessible contrast ratios.
 *
 * Gradient Tips: Stick with Analogous or Monochromatic colors. Avoid complementary
 * colors. Aim for smooth transitions. Play with stop-color opacity. The light source
 * should generally be placed at the top/top-left. Only apply gradients to headings,
 * stand-out text or graphic elements, not to copy. Maintain subtlety.
 */
const LinearGradient = ({
  gradientAngle = 305, // sets light source to top left by default
  gradientStops,
  ...gradientProps
}: LinearGradientProps) => {
  const stopCount = gradientStops.length;
  const { x1, x2, y1, y2 } = calculateXYFromAngle(gradientAngle);

  return (
    <linearGradient
      className={ cleanClasses('linear-gradient') }
      x1={ x1 }
      x2={ x2 }
      y1={ y1 }
      y2={ y2 }
      { ...gradientProps }
    >
      { gradientStops.map(( gradientStop, index ) =>
        { if (stopCount === 1) {
            return (
              <>
                <stop
                  key={ 0 }
                  className={ gradientStop.colorClass }
                  offset={ 0 }
                />
                <stop
                  key={ 1 }
                  className={ gradientStop.colorClass }
                  offset={ 1 }
                />
              </>
            )
          }
          return (
            <stop
              key={ index }
              className={ gradientStop.colorClass }
              offset={ gradientStop.offset ?? calculateOffset(stopCount, index) }
            />
          )
        }
      )}
    </linearGradient>
  )
};

export default LinearGradient;
