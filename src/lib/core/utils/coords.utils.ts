import { Grid, Point } from "../models/models";

/**
 * Use Pythagorean theorem to return a distance (in pixels) between two point
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
 * Returns the min distance between a list of points (edges Param) and point
 *
 * @param points Array of positions
 * @param point The starting position
 */
const getMinDistance = (points: Point[], point: Required<Point>) => {
  const edgesDistances = points.reduce((acc: Array<number>, edge) => {
    acc.push(getDistance(edge, point));

    return acc;
  }, []);

  return Math.min(...edgesDistances);
};

/**
 * Return a couple of the max distance found in grid with it's corresponding grid coordinates
 *
 * @param grid Donut section grid
 * @param startAngle Donut section start angle in Radian
 * @param endAngle Donut section end angle in Radian
 * @param gridLength Number of grid points in a row or in a column
 * @param innerRadius Donut inner radius
 * @param outerRadius Donut outer radius
 */
const getMaxDistance = (
  grid: Grid,
  startAngle: number,
  endAngle: number,
  gridLength: number,
  innerRadius: number,
  outerRadius: number
): { maxDistance: number; maxDistanceCoords: Point } => {
  let maxDistance = grid[0];
  let maxDistanceCoords = getGridPointPosition(
    0,
    0,
    startAngle,
    endAngle,
    gridLength,
    innerRadius,
    outerRadius
  );

  for (let i = 0; i < grid.length; i++) {
    const x = i % gridLength;
    const y = i / gridLength;

    if (grid[i] > maxDistance) {
      maxDistance = grid[i];
      maxDistanceCoords = getGridPointPosition(
        x,
        y,
        startAngle,
        endAngle,
        gridLength,
        innerRadius,
        outerRadius
      );
    }
  }

  return { maxDistance, maxDistanceCoords };
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
const getGridPointPosition = (
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

const getPointWithRatio = (point: Point, ratio: number) => {
  return {
    x: point.x * ratio,
    y: point.y * ratio,
  };
};

export {
  getDistance,
  getGridPointPosition,
  getMaxDistance,
  getMinDistance,
  getPointWithRatio,
};
