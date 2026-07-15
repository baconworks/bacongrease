// calculate equidistant gradient stop offset based on the number of stops
// and position in color array
export const calculateOffset = ( stopCount: number, index: number ) => {
  if (stopCount <= 1) return 0;
  const stopIncrement = 100 / ( stopCount - 1 );
  const offset = ( index * stopIncrement ) / 100;
  return offset;
};

// convert degrees to radians
export const degreesToRadians = ( degrees: number ) => {
  return degrees * ( Math.PI / 180 );
};

// get x and y axis on unit circle from radian value
export const getXandYFromRadians = ( radians: number ) => {
  const x = Math.cos(radians);
  const y = Math.sin(radians);

  return [ x, y ];
};

export const calculateXYFromAngle = ( angleInDegrees: number ) => {
  // ensure angle is between 0 - 360
  const angle = angleInDegrees % 360;

  // smallest floating point threshhold
  const epsilon = .0000000000000001;

  const startRadians = degreesToRadians(180 - angle);
  const endRadians = degreesToRadians(360 - angle);

  const start = getXandYFromRadians(startRadians);
  const end = getXandYFromRadians(endRadians);

  if (start[0] <= epsilon) { start[0] = 0 };
  if (start[1] <= epsilon) { start[1] = 0 };
  if (end[0] <= epsilon) { end[0] = 0 };
  if (end[1] <= epsilon) { end[1] = 0 };

  return {
    x1: start[0],
    y1: start[1],
    x2: end[0],
    y2: end[1]
  };
};
