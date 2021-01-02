import React from "react";
import {
  createD3SvgRoot,
  layoutBubbles, rawDataToBubbleDonut,
  resizeD3ViewportAndBubbles,
} from "../ui/bubble-donut-chart/utils/bubble-donut-d3-layout.utils";
import {BubbleWithCoordsAndRadius} from "../lib/core/models";
import dataSample from "./fixtures/data-sample.json";

const SVG_ROOT_SIZE = 200;

let wrapper!: HTMLDivElement;
let selection!: d3.Selection<
  SVGSVGElement,
  BubbleWithCoordsAndRadius,
  null,
  undefined
>;

describe("bubble donut d3 layout utils", () => {
  const bubbleDonut = rawDataToBubbleDonut(dataSample);
  const bubbles = bubbleDonut.getBubbles();
  const groupCount = bubbleDonut.sections.size;

  beforeEach(() => {
    wrapper = document.createElement("div");
    selection = createD3SvgRoot(wrapper, SVG_ROOT_SIZE);
  });

  test("createD3SvgRoot", () => {
    expect(wrapper).toMatchSnapshot();
  });

  test("layoutBubbles", () => {
    layoutBubbles(selection, SVG_ROOT_SIZE, bubbles, groupCount);

    const selectionNodeChildren = selection.node()?.children;
    expect(selectionNodeChildren?.length).toBe(dataSample.length);

    for (let i = 0; i < selectionNodeChildren.length; i++) {
      const child = selectionNodeChildren.item(i);
      expect(child.tagName).toBe("circle");
      expect(child.getAttribute("fill")).toBeDefined();
      expect(child.getAttribute("opacity")).toBeDefined();
      expect(child.getAttribute("r")).toBeDefined();
      expect(child.getAttribute("cx")).toBeDefined();
      expect(child.getAttribute("cy")).toBeDefined();
    }
  });

  test("resizeD3ViewportAndBubbles should resize svg root element and circles children", (done) => {
    const RESIZE_RATIO = 2;

    layoutBubbles(selection, SVG_ROOT_SIZE, bubbles, groupCount);

    type Circle = {
      r: number;
      cx: number;
      cy: number;
    };

    const circlePropertiesBefreResize = new Map<number, Circle>();

    // wait for layout animations to finish
    setTimeout(() => {
      const selectionNodeChildren = selection?.node()
        .children as HTMLCollection;

      for (let i = 0; i < selectionNodeChildren.length; i++) {
        const child = selectionNodeChildren.item(i) as Element;
        circlePropertiesBefreResize.set(i, {
          cx: parseFloat(child.getAttribute("cx") as string),
          cy: parseFloat(child.getAttribute("cy") as string),
          r: parseFloat(child.getAttribute("r") as string),
        });
      }

      resizeD3ViewportAndBubbles(selection, SVG_ROOT_SIZE * RESIZE_RATIO);

      for (let i = 0; i < selectionNodeChildren.length; i++) {
        const circleBeforeResize = circlePropertiesBefreResize.get(i) as Circle;

        const child = selectionNodeChildren.item(i) as Element;
        const childR = parseFloat(child.getAttribute("r") as string);
        const childCx = parseFloat(child.getAttribute("cx") as string);
        const childCy = parseFloat(child.getAttribute("cy") as string);

        expect(childR).toBe(circleBeforeResize.r * RESIZE_RATIO);
        expect(childCx).toBe(circleBeforeResize.cx * RESIZE_RATIO);
        expect(childCy).toBe(circleBeforeResize.cy * RESIZE_RATIO);
      }

      done();
    }, 1000);
  });
});
