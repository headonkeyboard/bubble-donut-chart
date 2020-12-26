import { Bubble, Coord, Grid, GridEdges, Point } from '../models/models';
import {
  getGridPointPosition,
  getDistance,
  getMaxDistance,
  getMinDistance,
} from './coords.utils';

/**
 * Return a bubble radius based on it's weight proportional to donutArea
 *
 * @param bubbleValue Bubble coefficient weight
 * @param donutArea Donut surface
 * @param totalBubbleValues Sum of all bubbles coefficient weight
 */
const getBubbleRadius = (
  bubbleValue: number,
  donutArea: number,
  totalBubbleValues: number
): number => {
  const bubbleArea = (bubbleValue * donutArea) / totalBubbleValues;
  return Math.sqrt(bubbleArea / Math.PI) * 0.7;
};

/**
 * Return sum of all bubble weight
 *
 * @param bubbles Array of bubble data
 */
const getAllBubbleWeightSum = (bubbles: Bubble[]): number => {
  return bubbles.reduce((acc, bubble) => {
    return acc + bubble.weight;
  }, 0);
};

/**
 * Generate an array representing a donut section grid
 * Each item index is a grid coordinate
 * Each item value is equal to the minimum distance with an obstacle (edge or any other bubble)
 *
 * @param edges An array containing edges positions
 * @param gridLength The grid size
 * @param startAngle The section start angle in rad
 * @param endAngle The section end angle in rad
 * @param innerRadius The donut inner radius in pixels
 * @param outerRadius The donut outer radius in pixels
 * @param bubbleCoords Positions of bubbles already in grid
 */
const generateGrid = (
  edges: GridEdges,
  gridLength: number,
  startAngle: number,
  endAngle: number,
  innerRadius: number,
  outerRadius: number,
  gridPointPositionsCache: Map<number, Point>,
  grid: Grid = [],
  bubbleCoords: Array<Coord> = []
): {grid: Grid, maxDistance: number; maxDistanceX: number; maxDistanceY: number} => {
  let maxDistance = 0;
  let maxDistanceX = 0;
  let maxDistanceY = 0;

  for (let i = 0; i < Math.pow(gridLength, 2); i++) {
    let minDistance = null != grid[i] ? grid[i] : null;

    // skiping minDistance search when already low
    if (null != minDistance && minDistance <= 0) {
      continue;
    }

    const x = i % gridLength;
    const y = i / gridLength;

    let gridPointCoord!: Point;

    if (gridPointPositionsCache.has(i)) {
      gridPointCoord = gridPointPositionsCache.get(i) as Point;
    }
    else {
      gridPointCoord = getGridPointPosition(
          x,
          y,
          startAngle,
          endAngle,
          gridLength,
          innerRadius,
          outerRadius
      );

      gridPointPositionsCache.set(i, gridPointCoord);
    }

    // compute edge distance from grid point only for an empty grid
    if (null === minDistance) {
      // reduce edges list to potential closest edges
      const closestEdges: Point[] = [];

      if (y > Math.round(gridLength / 2)) {
        closestEdges.push(...edges.right);
      } else if (y <= Math.round(gridLength / 2)) {
        closestEdges.push(...edges.left);
      }

      if (x > Math.round(gridLength / 2)) {
        closestEdges.push(...edges.top);
      } else if (x <= Math.round(gridLength / 2)) {
        closestEdges.push(...edges.bottom);
      }

      minDistance = getMinDistance(closestEdges, gridPointCoord);
    }

    if (bubbleCoords.length > 0) {
      const lastAddedBubble = bubbleCoords[bubbleCoords.length - 1];
      const bubbleCoordDistance =
          getDistance(gridPointCoord, lastAddedBubble) - lastAddedBubble.r;
      if (minDistance && minDistance > bubbleCoordDistance) {
        minDistance = bubbleCoordDistance;
      }
    }

    if (minDistance > maxDistance) {
      maxDistance = minDistance;
      maxDistanceX = x;
      maxDistanceY = y;
    }

    grid[i] = minDistance;
  }

  return {grid, maxDistance, maxDistanceX, maxDistanceY};
};

/**
 * Return bubble coordinates and radius in pixels
 *
 * @param gridLength The grid size
 * @param startAngle The section start angle in rad
 * @param endAngle The section end angle in rad
 * @param value The bubble value (the higher its value, the higher its radius)
 * @param grid An array in which each items is a grid point and is value is the closest distance with an obstacle (bubble or edge)
 * @param innerRadius The donut inner radius in pixels
 * @param outerRadius The donut outer radius in pixels
 * @param donutArea The computed area of the donut
 * @param totalBubbleValues The sum of all bubble value
 */
const getBubblePositionAndRadius = (
  maxDistance: number,
  maxDistanceCoords: Point,
  value: number,
  donutArea: number,
  totalBubbleValues: number
) => {
  let bubbleRadius = getBubbleRadius(value, donutArea, totalBubbleValues);

  if (maxDistance - bubbleRadius < 0) {
    bubbleRadius = maxDistance - 2;
  }

  const offset = (maxDistance - bubbleRadius) / 2;

  const offsetX = offset * (Math.random() < 0.5 ? -1 : 1);
  const offsetY = offset * (Math.random() < 0.5 ? -1 : 1);

  return {
    bubbleX: maxDistanceCoords.x + offsetX * Math.random(),
    bubbleY: maxDistanceCoords.y + offsetY * Math.random(),
    bubbleR: bubbleRadius,
  };
};

export {
  generateGrid,
  getBubbleRadius,
  getAllBubbleWeightSum,
  getBubblePositionAndRadius
};
