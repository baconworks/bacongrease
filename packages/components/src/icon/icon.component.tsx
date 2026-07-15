'use client'
// library
import { useEffect, useState } from "react";

// components
import LinearGradient from "../linear-gradient/linear-gradient.component";

// helpers
import { cleanClasses } from "../utils/clean-classes";

// styles
import './icon.styles.scss';

// types
import { IconType, IconBaseProps } from "react-icons";
import { LinearGradientStop } from "../linear-gradient/linear-gradient.component";

export interface IconProps extends IconBaseProps {
  gradientOptions?: {
    gradientStops: LinearGradientStop[];
    id: string;
  };
  icon: IconType;
};

const Icon = ({
  className,
  gradientOptions,
  icon: SVGIcon,
  ...iconBaseProps
}: IconProps) => {
  // set gradient fill and stroke to currentColor by default
  const [ iconFill, setIconFill ] = useState('currentColor');
  const [ iconStroke, setIconStroke ] = useState('currentColor');

  // activate gradient when gradientOptions are provided
  useEffect(() => {
    if (gradientOptions) {
      // set gradient url
      const { id: gradientId } = gradientOptions;
      const gradientURL = `url(#${ gradientId })`;

      // set fill & stroke to gradient
      setIconFill(gradientURL);
      setIconStroke(gradientURL);
    } else {
      // set fill & stroke to currentColor
      setIconFill('currentColor');
      setIconStroke('currentColor')
    }
  }, [ gradientOptions ]);

  return (
    <span className={ cleanClasses('icon', { classes: className }) }>
      { gradientOptions &&
          <svg width="0" height="0">
            <defs>
              <LinearGradient { ...gradientOptions } />
            </defs>
          </svg>
      }

      <SVGIcon
        className="icon_content"
        fill={ iconFill }
        role="img"
        stroke={ iconStroke }
        { ...iconBaseProps }
      />
    </span>
  )
};

export default Icon;
