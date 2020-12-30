import React, {
  useEffect,
  useRef,
  FunctionComponent,
  useLayoutEffect,
} from "react";
import { RawData } from "../../lib/core/models/models";
import {
  createD3SvgRoot,
  D3SVGSelection,
  layoutBubbles,
  resizeD3ViewportAndBubbles,
} from "./utils/bubble-donut-d3-layout.utils";

type BubbleDonutChartProps = {
  rawData: RawData[];
};

const BubbleDonutChart: FunctionComponent<BubbleDonutChartProps> = ({
  rawData,
}) => {
  const svgWrapperRef = useRef<HTMLDivElement>(null);
  const d3BubbleSelectionRef: React.MutableRefObject<
    D3SVGSelection | undefined
  > = useRef(undefined);

  useLayoutEffect(() => {
    if (null !== svgWrapperRef.current) {
      const size = Math.min(
        svgWrapperRef.current.clientWidth,
        svgWrapperRef.current.clientHeight
      );
      d3BubbleSelectionRef.current = createD3SvgRoot(
        svgWrapperRef.current,
        size
      );

      return () => {
        if (d3BubbleSelectionRef.current) {
          d3BubbleSelectionRef.current.remove();
        }
      };
    }
  }, []);

  /* Bubbles need to layout on every changes */
  useEffect(() => {
    if (svgWrapperRef.current) {
      const size = Math.min(
        svgWrapperRef.current.clientWidth,
        svgWrapperRef.current.clientHeight
      );

      // priorize ui interactions as bubble layout might take some time
      setTimeout(() => {
        if (d3BubbleSelectionRef.current) {
          layoutBubbles(d3BubbleSelectionRef.current, size, rawData);
        }
      });
    }
  }, [rawData]);

  useEffect(() => {
    function handleResize() {
      if (
        null !== svgWrapperRef.current &&
        null != d3BubbleSelectionRef.current
      ) {
        const newSize = Math.min(
          svgWrapperRef.current.clientWidth,
          svgWrapperRef.current.clientHeight
        );

        resizeD3ViewportAndBubbles(d3BubbleSelectionRef.current, newSize);
      }
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [rawData]);

  return (
    <div
      className="flex flex-1 justify-center items-center overflow-hidden"
      ref={svgWrapperRef}
    />
  );
};

export default BubbleDonutChart;
