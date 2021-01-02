import { Point } from "../models";

/**
 * Use Pythagorean theorem to return a distance (in pixels) between two point
 *
 * @param coord1
 * @param coord2
 */
const getDistance = (
  coord1: Required<Point>,
  coord2: Required<Point>
): number => {
  return Math.sqrt(
    Math.pow(coord1.x - coord2.x, 2) + Math.pow(coord1.y - coord2.y, 2)
  );
};

/**
 * Returns the min distance between a list of points and a starting point
 *
 * @param points Array of positions in pixels
 * @param point The starting position in pixels
 */
const getMinDistance = (points: Point[], point: Required<Point>): number => {
  let minDistance = getDistance(points[0], point);

  for (let i = 1; i < points.length; i++) {
    const distance = getDistance(points[i], point);
    if (distance < minDistance) {
      minDistance = distance;
    }
  }

  return minDistance;
};

/**
 * Return a position in pixels from grid coordinates
 *
 * @param x coord in Donut section
 * @param y coord in Donut section
 * @param startAngle Donut section start angle in Radian
 * @param endAngle Donut section end angle in Radian
 * @param gridLength Number of grid points in a row or in a column
 * @param innerRadius Donut inner radius
 * @param outerRadius Donut outer radius
 */
const gridPointPositionToPixels = (
  x: number,
  y: number,
  startAngle: number,
  endAngle: number,
  gridLength: number,
  innerRadius: number,
  outerRadius: number
): Point => {
  const sectionAngle = endAngle - startAngle;
  const gridPointAngle = startAngle + (sectionAngle * y) / gridLength;
  const gridPointDistanceWithCenter =
    innerRadius + ((outerRadius - innerRadius) * x) / gridLength;

  return {
    x: gridPointDistanceWithCenter * Math.cos(gridPointAngle),
    y: gridPointDistanceWithCenter * Math.sin(gridPointAngle),
  };
};

export { getDistance, gridPointPositionToPixels, getMinDistance };
