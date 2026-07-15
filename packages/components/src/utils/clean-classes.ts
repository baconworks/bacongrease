/**
 * Builds a BEM-friendly className string from a base element name plus optional
 * modifiers and pass-through classes.
 *
 * @example
 * cleanClasses('button', { modifiers: [ 'primary', 'pill' ], classes: 'mt-2' })
 * // 'button button--primary button--pill mt-2'
 */
export const cleanClasses = (
  element: string,
  options?: {
    modifiers?: Array<string | undefined>,
    classes?: string
  }
) => {
  const classNames = [ element ];

  const { modifiers, classes } = options || {};

  if (classes) classNames.push(classes);

  modifiers?.forEach(( modifier ) => {
    if (modifier) classNames.push(`${ element }--${ modifier }`);
  });

  return classNames.join(' ');
};
