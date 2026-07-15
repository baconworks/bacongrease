// types
import { ComponentPropsWithoutRef } from 'react';

// helpers
import { cleanClasses } from '../utils/clean-classes';

// styles
import './spinner.styles.scss';

const defaultSpinnerColors = [
  'black',
  'grey',
  'pink',
  'red',
  'orange',
  'yellow',
  'teal',
  'green',
  'light-blue',
  'blue',
  'purple',
  'white',
];

interface SpinnerProps extends ComponentPropsWithoutRef<'div'> {
  colors?: string[];
  variant?: 'grid' | 'modal' | 'note';
};

const Spinner = ({
  className,
  colors = defaultSpinnerColors,
  variant,
  ...divProps
}: SpinnerProps) => {
  return (
    <div
      className={ cleanClasses('spinner', { classes: className, modifiers: [ variant ] }) }
      { ...divProps }
    >
      {
        colors.map(( color, index ) =>
          <div
            key={ `${ color }-${ index.toString() }` }
            className={ cleanClasses('spinner_circle', { modifiers: [ color ] }) }
          />
        )
      }
      <span>Loading...</span>
    </div>
  )
};

export default Spinner;
