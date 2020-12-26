import React, {useCallback, useEffect, useRef, useState} from 'react';
import './App.css';
import BubbleDonutChart from "./BubbleDonutChart";
import {getBubbles} from "./lib/core/random.utils";
import {Bubble} from "./lib/core/models/models";
import BubbleDonutBuilder from "./ui/builder/BubbleDonutBuilder";
import {Section} from "./ui/models";

const defaultSections: Section[] = [
    { bubbleMaxValue: 100, bubbleMinValue: 1, bubbleCount: 100 },
    { bubbleMaxValue: 100, bubbleMinValue: 1, bubbleCount: 100 },
    { bubbleMaxValue: 100, bubbleMinValue: 1, bubbleCount: 100 }
];

function App() {
    const [bubbles, setBubbles] = useState<Bubble[]>([]);
    const [sections, setSections] = useState<Section[]>(defaultSections);

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const someBubbles = getBubbles(defaultSections);
        setBubbles(someBubbles);
    }, [setBubbles]);

    const handleSectionsChange = useCallback((newSections: Section[]) => {
        if (null != timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            const someBubbles = getBubbles(newSections);
            setBubbles(someBubbles);
        }, 50);


        setSections(newSections);
        console.log(newSections);

    }, [setBubbles, timeoutRef, setSections, sections]);


  return (
    <div className="container mx-auto flex min-h-screen space-x-4">
        <div className="rounded-lg w-4/12 shadow self-start p-4 mt-8 bg-white">
            <BubbleDonutBuilder sections={sections} onChange={handleSectionsChange} />
        </div>
        <div className="w-8/12 flex flex-shrink-0 flex-col justify-items-stretch">
            <BubbleDonutChart bubbles={bubbles} />
        </div>
    </div>
  );
}

export default App;
