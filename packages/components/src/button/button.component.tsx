'use client'
// library
import {
  MouseEventHandler,
  useEffect,
  useId,
  useState
} from "react";

// components
import Icon from "../icon/icon.component";

// helpers
import { cleanClasses } from "../utils/clean-classes";

// styles
import "./button.styles.scss";

// data
import { buttonIconGradientVariants } from "./data/button.gradients";

// types
import type { ButtonProps } from "./types/button.types";
import { ButtonVariants } from "./types/button.types";

/**
  * Principle UI component for prompting a change in the interface: i.e. open/close,
  * submit, subscribe, trigger, toggle, play/stop, etc. It does not link out to a new resource.
  * It can accept an Icon as a prop and match the icon to its own style properties, including gradient.
*/
const Button = ({
  className,
  disabled,
  icon: ButtonIcon,
  image,
  label,
  styleOptions = [],
  variant = ButtonVariants.primary,
  ...buttonProps
}: ButtonProps) => {
  // icon gradient state
  const [ iconGradient, setIconGradient ] = useState(false);
  const [ gradientStops, setGradientStops ] = useState(
    buttonIconGradientVariants[variant]
  );

  // stable, unique id for the icon gradient (SSR-safe)
  const gradientId = useId();

  // watch for change in button gradient state and reset icon gradient state
  useEffect(() => {
    // does styleOptions include gradient
    const isGradient = styleOptions.includes('gradient');

    // does styleOptions include outline or text
    const isOutlineOrText = styleOptions.includes('outline') ||
          styleOptions.includes('text');

    // this is the scenario for applying a gradient to the icon
    setIconGradient(isGradient && isOutlineOrText);
  }, [ styleOptions ]);

  // set up class names
  const classes = cleanClasses(
    "button",
    {
      modifiers: [ variant, ...styleOptions ],
      classes: className
    }
  );

  // handlers animate the icon gradient stops on hover
  // to match the button hover effect
  const handleMouseEnter: MouseEventHandler = () => {
    if (!iconGradient) return;
    setGradientStops(
      buttonIconGradientVariants[variant + 'Hover']
    );
  };

  const handleMouseLeave: MouseEventHandler = () => {
    if (!iconGradient) return;
    setGradientStops(
      buttonIconGradientVariants[variant]
    );
  };

  return (
    <button
      { ...buttonProps }
      className={ classes }
      disabled={ disabled }
      aria-disabled={ disabled }
      onMouseEnter={ handleMouseEnter }
      onMouseLeave={ handleMouseLeave }
    >
      { label }
      { ButtonIcon &&
          <Icon
            gradientOptions={ iconGradient ?
              {
                id: `button-icon-${ gradientId }`,
                gradientStops: gradientStops,
              } :
              undefined
            }
            icon={ ButtonIcon }
          />
      }
      { (image && !ButtonIcon) &&
          <img
            aria-label="button icon"
            src={ image }
            alt="button icon"
            className="button_image"
            width={ 100 }
            height={ 100 }
          />
      }
    </button>
  )
};

export default Button;
