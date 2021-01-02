import React, {
  useEffect,
  useRef,
  FunctionComponent,
  useLayoutEffect,
} from "react";
import {RawData} from "../../lib/core/models";
import {
  createD3SvgRoot,
  D3SVGSelection,
  layoutBubbles,
  resizeD3ViewportAndBubbles,
} from "./utils/bubble-donut-d3-layout.utils";

// eslint-disable-next-line
import BubbleDonutWorker from "worker-loader!../../bubble.worker";

type BubbleDonutChartProps = {
  rawData: RawData[];
};

const getSvgWrapperSize = (svgWrapper: HTMLDivElement) => Math.min(
    svgWrapper.clientWidth,
    svgWrapper.clientHeight
);

const BubbleDonutChart: FunctionComponent<BubbleDonutChartProps> = ({
  rawData,
}) => {
  const svgWrapperRef = useRef<HTMLDivElement>(null);
  const d3BubbleSelectionRef: React.MutableRefObject<
    D3SVGSelection | undefined
  > = useRef(undefined);

  const workerRef = useRef<BubbleDonutWorker | undefined>(undefined);

  useLayoutEffect(() => {
    if (null !== svgWrapperRef.current) {
      const size = getSvgWrapperSize(svgWrapperRef.current);

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

  useEffect(() => {
    function handleResize() {
      if (
        null !== svgWrapperRef.current &&
        null != d3BubbleSelectionRef.current
      ) {
        const newSize = getSvgWrapperSize(svgWrapperRef.current);

        resizeD3ViewportAndBubbles(d3BubbleSelectionRef.current, newSize);
      }
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [rawData]);

  useEffect(() => {
    workerRef.current = new BubbleDonutWorker();

    workerRef.current.addEventListener('message', (event: MessageEvent) => {
      if (d3BubbleSelectionRef.current && svgWrapperRef.current) {
        const {bubbles, groupCount} = event.data;
        const size = getSvgWrapperSize(svgWrapperRef.current);

        layoutBubbles(d3BubbleSelectionRef.current, size, bubbles, groupCount);
      }
    });

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    }
  }, []);

  /* Bubbles need to layout on every changes */
  useEffect(() => {
    if (workerRef.current) {
      workerRef.current.postMessage(rawData);
    }
  }, [rawData]);

  return (
    <div
      className="flex flex-1 justify-center items-center overflow-hidden"
      ref={svgWrapperRef}
    />
  );
};

export default BubbleDonutChart;
