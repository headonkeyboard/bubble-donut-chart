import React, {useCallback, useEffect, useRef, useState} from 'react';
import './App.css';
import BubbleDonutChart from "./BubbleDonutChart";
import {getBubbles} from "./lib/core/random.utils";
import {Bubble} from "./lib/core/models/models";
import BubbleDonutBuilder from "./ui/builder/BubbleDonutBuilder";
import {Section} from "./ui/models";

const defaultBubbleCount = 200;

const defaultSections: Section[] = [
    50, 25, 25
];

function App() {
    const [bubbles, setBubbles] = useState<Bubble[]>([]);
    const [sections, setSections] = useState<Section[]>(defaultSections);
    const bubbleCountRef = useRef<number>(defaultBubbleCount);

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const someBubbles = getBubbles(bubbleCountRef.current, defaultSections);
        setBubbles(someBubbles);
    }, [setBubbles]);

    const handleSectionsChange = useCallback((newSections: Section[]) => {
        if (null != timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            const someBubbles = getBubbles(bubbleCountRef.current, newSections);
            setBubbles(someBubbles);
        }, 500);


        setSections(newSections);

    }, [setBubbles, timeoutRef, setSections]);

    const handleBubbleCountChange = useCallback((bubbleCount) => {
        if (null != timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            const someBubbles = getBubbles(bubbleCount, sections);
            setBubbles(someBubbles);
        }, 100);

        bubbleCountRef.current = bubbleCount;
    }, [sections]);

  return (
    <div className="p-4 md:p-8 flex flex-col-reverse md:flex-row min-h-screen space-x-4 text-gray-100">
        <div className="md:w-4/12 md:self-start md:mt-8 md:max-w-sm">
            <BubbleDonutBuilder bubbleCount={defaultBubbleCount} sections={sections} onChange={handleSectionsChange} onBubbleCountChange={handleBubbleCountChange} />
        </div>
        <div className="md:w-8/12 flex flex-1 flex-shrink-0 flex-col justify-items-stretch">
            <BubbleDonutChart bubbles={bubbles} />
        </div>
    </div>
  );
}

export default App;
