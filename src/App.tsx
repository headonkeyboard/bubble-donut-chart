import React, { useCallback, useEffect, useRef, useState } from "react";
import BubbleDonutChart from "./ui/BubbleDonutChart";
import { getBubbles } from "./lib/core/random.utils";
import { Bubble } from "./lib/core/models/models";
import BubbleDonutBuilder from "./ui/builder/BubbleDonutBuilder";
import { Group } from "./ui/models";

const defaultBubbleCount = 200;

const defaultSections: Group[] = [50, 25, 25];

function App() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [sections, setSections] = useState<Group[]>(defaultSections);
  const bubbleCountRef = useRef<number>(defaultBubbleCount);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateBubbles = useCallback(
    (bubbleCount: number, sections: Group[]) => {
      if (null != timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        const someBubbles = getBubbles(bubbleCount, sections);
        setBubbles(someBubbles);
      }, 100);
    },
    [setBubbles, timeoutRef]
  );

  const handleSectionsChange = useCallback(
    (newSections: Group[]) => {
      updateBubbles(bubbleCountRef.current, newSections);
      setSections(newSections);
    },
    [setSections, updateBubbles]
  );

  const handleBubbleCountChange = useCallback(
    (bubbleCount) => {
      updateBubbles(bubbleCount, sections);

      bubbleCountRef.current = bubbleCount;
    },
    [sections, updateBubbles]
  );

  useEffect(() => {
    updateBubbles(bubbleCountRef.current, defaultSections);
  }, [updateBubbles]);

  return (
    <div className="p-4 lg:p-8 flex flex-col-reverse lg:flex-row min-h-screen lg:space-x-4 text-gray-100">
      <div className="lg:w-4/12 lg:self-start lg:mt-8 lg:max-w-sm">
        <BubbleDonutBuilder
          defaultBubbleCount={defaultBubbleCount}
          groups={sections}
          onChange={handleSectionsChange}
          onBubbleCountChange={handleBubbleCountChange}
        />
      </div>
      <div className="lg:w-8/12 flex flex-1 flex-shrink-0 flex-col justify-items-stretch">
        <BubbleDonutChart bubbles={bubbles} />
      </div>
    </div>
  );
}

export default App;
