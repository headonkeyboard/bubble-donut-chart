import React, {
  useEffect,
  useRef,
  FunctionComponent,
  useLayoutEffect,
} from "react";
import * as d3 from "d3";
import {
  Bubble,
  BubbleWithCoordsAndRadius,
  Section,
} from "../lib/core/models/models";
import { BubbleDonut } from "../lib/core/bubble-donut";
import { groupColors } from "../utils/colors.utils";

type BubbleDonutChartProps = {
  bubbles: Bubble[];
};

/**
 * Returns a flat array of BubbleWithCoordsAndRadius extracted from each groups
 *
 * @param bubbleDonutSections
 */
const flattenDonutSectionBubbles = (
  bubbleDonutSections: Map<string, Section>
): BubbleWithCoordsAndRadius[] => {
  const d3Bubbles: BubbleWithCoordsAndRadius[] = [];

  for (let [, bubbleSection] of bubbleDonutSections) {
    bubbleSection.bubbles.forEach((bubble) => {
      d3Bubbles.push(bubble);
    });
  }

  return d3Bubbles;
};

function drawBubbles(
  selection: d3.Selection<SVGCircleElement, unknown, SVGSVGElement, unknown>,
  bubbles: Bubble[],
  width: number
) {
  const diameter = width * 0.8;
  const radius = diameter / 2;
  const padding = width - diameter;
  const offset = radius + padding / 2;

  const bubbleDonut = new BubbleDonut(radius * 0.2, radius, bubbles);
  const d3Bubbles = flattenDonutSectionBubbles(bubbleDonut.sections);

  const groups = [...new Set(d3.map(d3Bubbles, (d) => d.group))];
  var groupsColors = groupColors(groups.length);

  const maxX = d3.max(d3Bubbles, (d) => {
    return radius + d.x + d.r;
  }) as number;

  var xScale = d3
    .scaleLinear()
    .domain([0, maxX])
    .range([0, width - padding]);

  var u: d3.Selection<
    SVGCircleElement,
    BubbleWithCoordsAndRadius,
    SVGSVGElement,
    unknown
  > = selection.data(d3Bubbles, (d) => (d as BubbleWithCoordsAndRadius).id);

  u.enter()
    .append("circle")
    .attr("opacity", 0)
    .attr("cx", xScale(radius))
    .attr("cy", xScale(radius))
    .merge(u)
    .transition()
    .duration(300)
    .attr("opacity", 1)
    .attr("cx", xScale(radius))
    .attr("cy", xScale(radius))
    .attr("cx", (d) => xScale((d as BubbleWithCoordsAndRadius).x + offset))
    .attr("cy", (d) => xScale((d as BubbleWithCoordsAndRadius).y + offset))
    .attr("fill", (d) => groupsColors(d.group) as string)
    .attr("r", (d) => xScale((d as BubbleWithCoordsAndRadius).r));

  u.exit().transition().duration(300).attr("r", 0).attr("opacity", 0).remove();
}

const BubbleDonutChart: FunctionComponent<BubbleDonutChartProps> = ({
  bubbles,
}) => {
  const svgRef = useRef<HTMLDivElement>(null);
  const wrapperWidth = useRef<number>(0);
  const d3SvgRef: React.MutableRefObject<
    d3.Selection<SVGSVGElement, unknown, null, undefined> | undefined
  > = useRef(undefined);

  useLayoutEffect(() => {
    if (null !== svgRef.current) {
      const elem = svgRef.current;

      wrapperWidth.current = Math.min(elem.clientWidth, elem.clientHeight);

      const svg = d3
        .select(svgRef.current)
        .append("svg")
        .attr("height", wrapperWidth.current)
        .attr("width", wrapperWidth.current);
      d3SvgRef.current = svg;

      return () => {
        svg.remove();
      };
    }
  }, []);

  useEffect(() => {
    if (d3SvgRef.current) {
      drawBubbles(
        d3SvgRef.current.selectAll("circle"),
        bubbles,
        wrapperWidth.current
      );
    }
  }, [bubbles]);

  useEffect(() => {
    function handleResize() {
      if (null !== svgRef.current && null != d3SvgRef.current) {
        const elem = svgRef.current;
        wrapperWidth.current = Math.min(elem.clientWidth, elem.clientHeight);

        d3SvgRef.current
          .attr("height", wrapperWidth.current)
          .attr("width", wrapperWidth.current);

        drawBubbles(
          d3SvgRef.current.selectAll("circle"),
          bubbles,
          wrapperWidth.current
        );
      }
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [bubbles]);

  return (
    <div
      className="flex flex-1 justify-center items-center overflow-hidden"
      ref={svgRef}
    ></div>
  );
};

export default BubbleDonutChart;
