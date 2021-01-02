import * as d3 from "d3";
import { BubbleWithCoordsAndRadius, RawData } from "../../../lib/core/models";
import { BubbleDonut } from "../../../lib/core/bubble-donut";
import { groupColors } from "../../../utils/colors.utils";
import { getRandomInt } from "../../../utils/random.utils";
import { DEFAULT_RADIUS, DEFAULT_VIEWPORT, DONUT_CENTER } from "../constants";

export type D3SVGSelection = d3.Selection<
  SVGSVGElement,
  BubbleWithCoordsAndRadius,
  null,
  undefined
>;

/**
 * Init a new BubbleDonut from data
 *
 * @param data
 */
export const rawDataToBubbleDonut = (data: RawData[]): BubbleDonut => {
  return new BubbleDonut(DEFAULT_RADIUS * 0.2, DEFAULT_RADIUS, data);
};

/**
 * Returns a function which will scale an input according to range [0, width]
 *
 * @param width
 */
const viewportScaleRange = (width: number) => {
  return d3.scaleLinear().domain([0, DEFAULT_VIEWPORT]).range([0, width]);
};

/**
 * Generate bubbles from data and layout them to build a Bubble Donut
 *
 * @param selection
 * @param width
 * @param bubbles
 * @param groupCount
 */
export function layoutBubbles(
  selection: D3SVGSelection,
  width: number,
  bubbles: BubbleWithCoordsAndRadius[],
  groupCount: number
) {
  const d3Bubbles = bubbles;
  const groupsColors = groupColors(groupCount);
  const viewportScale = viewportScaleRange(width);
  const d3BubbleSelection = selection
    .selectAll<SVGCircleElement, BubbleWithCoordsAndRadius>("circle")
    .data(d3Bubbles, d => `${d.id}-${d.group}`)
  ;

  // makes bubbles moving to random position before removing theme (looks like an explosion)
  d3BubbleSelection
      .exit()
      .transition()
      .duration(900)
      .attr("cx", () => getRandomInt(0, width))
      .attr("cy", () => getRandomInt(0, width))
      .attr("r", 0)
      .remove();

  d3BubbleSelection
    .enter()
    .append("circle")
    .attr("opacity", 0)
    // make new circles coming from a random position to give a nice effect
    .attr("cx", () => viewportScale(getRandomInt(0, DEFAULT_VIEWPORT)))
    .attr("cy", () => viewportScale(getRandomInt(0, DEFAULT_VIEWPORT)))
    .attr("r", 0)
    .attr("fill", (d) => groupsColors(d.group) as string)
    .merge(d3BubbleSelection)
    .transition()
    .delay(150)
    .duration(400)
    .attr("cx", (d) => viewportScale(d.x + DONUT_CENTER))
    .attr("cy", (d) => viewportScale(d.y + DONUT_CENTER))
    .attr("r", (d) => viewportScale(d.r))
    .attr("opacity", 1)
    .attr("fill", (d) => groupsColors(d.group) as string);
}

/**
 * Create svg root container
 *
 * @param divWrapper
 * @param size
 */
export const createD3SvgRoot = (divWrapper: HTMLDivElement, size: number) => {
  return d3
    .select<HTMLDivElement, BubbleWithCoordsAndRadius>(divWrapper)
    .append("svg")
    .attr("height", size)
    .attr("width", size);
};

/**
 * Resize svg root container and all bubble children
 *
 * @param d3SvgRoot
 * @param size
 */
export const resizeD3ViewportAndBubbles = (
  d3SvgRoot: D3SVGSelection,
  size: number
) => {
  d3SvgRoot.attr("height", size).attr("width", size);

  const viewportScale = viewportScaleRange(size);

  d3SvgRoot
    .selectAll<SVGCircleElement, BubbleWithCoordsAndRadius>("circle")
    .attr("cx", (d) => viewportScale(d.x + DONUT_CENTER))
    .attr("cy", (d) => viewportScale(d.y + DONUT_CENTER))
    .attr("r", (d) => viewportScale(d.r));
};
