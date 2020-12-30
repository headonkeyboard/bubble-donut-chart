import React, { useCallback, useEffect, useRef, useState } from "react";
import BubbleDonutChart from "./ui/bubble-donut-chart/BubbleDonutChart";
import { getRandomRawData } from "./utils/random.utils";
import { RawData } from "./lib/core/models";
import BubbleDonutBuilder from "./ui/builder/BubbleDonutBuilder";

const defaultBubbleCount = 200;

const defaultGroupSizes: number[] = [50, 25, 25];

function App() {
  const [bubbles, setBubbles] = useState<RawData[]>([]);
  const [groupSizes, setGroupSizes] = useState<number[]>(defaultGroupSizes);
  const bubbleCountRef = useRef<number>(defaultBubbleCount);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateBubbles = useCallback(
    (bubbleCount: number, sections: number[]) => {
      // debounce bubble generation
      if (null != timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        const someBubbles = getRandomRawData(bubbleCount, sections);
        setBubbles(someBubbles);
      }, 100);
    },
    [setBubbles, timeoutRef]
  );

  const handleGroupSizesChange = useCallback(
    (newSections: number[]) => {
      updateBubbles(bubbleCountRef.current, newSections);
      setGroupSizes(newSections);
    },
    [setGroupSizes, updateBubbles]
  );

  const handleBubbleCountChange = useCallback(
    (bubbleCount) => {
      updateBubbles(bubbleCount, groupSizes);
      bubbleCountRef.current = bubbleCount;
    },
    [groupSizes, updateBubbles]
  );

  useEffect(() => {
    updateBubbles(bubbleCountRef.current, defaultGroupSizes);
  }, [updateBubbles]);

  return (
    <main className="flex flex-col-reverse lg:flex-row min-h-screen text-gray-100">
      <div className="p-4 lg:p-8 lg:w-4/12 lg:self-start lg:max-w-sm">
        <BubbleDonutBuilder
          defaultBubbleCount={defaultBubbleCount}
          groupSizes={groupSizes}
          onGroupsSizeChange={handleGroupSizesChange}
          onBubbleCountChange={handleBubbleCountChange}
        />
      </div>
      <div className="lg:w-8/12 flex flex-1 flex-shrink-0 flex-col justify-items-stretch">
        <BubbleDonutChart rawData={bubbles} />
      </div>
    </main>
  );
}

export default App;
