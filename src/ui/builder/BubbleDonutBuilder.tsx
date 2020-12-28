import React, {ChangeEvent, FunctionComponent, useCallback, useRef} from "react";
import BubbleDonutBuilderSection from "./BubbleDonutBuilderSection";
import {Section} from "../models";

type BubbleDonutBuilderProps = {
    bubbleCount: number;
    sections: Section[];
    onBubbleCountChange: (bubbleCount: number) => void;
    onChange: (sections: Section[]) => void;
}

const defaultSection = (sectionCount: number): Section => Math.floor(100 / (sectionCount + 1));

const BubbleDonutBuilder: FunctionComponent<BubbleDonutBuilderProps> = ({bubbleCount, sections, onChange, onBubbleCountChange}) => {
    const sectionsRef = useRef<Section[]>(sections);

    const handleSectionChange = useCallback((sectionIndex: number, section: Section) => {
        const newSection = Math.max(Math.min(section, 100 - sectionsRef.current.length * 2), 2);
        const otherSectionTotal = Math.max(100 - newSection, 1);

        sectionsRef.current = sectionsRef.current
            .map((someSection, someSectionIndex) => {
                if (someSectionIndex !== sectionIndex) {
                    return otherSectionTotal / (sectionsRef.current.length - 1);
                }
                else {
                    return newSection;
                }
            });

        onChange(sectionsRef.current);
    }, [onChange]);

    const addSection = useCallback(() => {
        const newSection = defaultSection(sections.length);

        const newSections = [
            ...sectionsRef.current,
            newSection
        ];

        sectionsRef.current = newSections;

        handleSectionChange(sectionsRef.current.length - 1, newSection);

    }, [onChange, sections.length]);

    const handleBubbleCountChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        onBubbleCountChange(parseInt(e.target.value, 10));
    }, [onBubbleCountChange]);

    return (
        <div className="space-y-4 font-light">
            <div className="space-y-4">
                <div className="rounded-lg p-4 bg-gray-900 flex items-center space-x-4 border border-gray-700 bg-opacity-60">
                    <label>Bubble Count</label>
                    <input onChange={handleBubbleCountChange} className="flex-1" name="bubbleCount"  type="range" defaultValue={bubbleCount} min="100" max="700" />
                </div>

                <div className="space-y-4 rounded-lg p-4 bg-gray-900 border border-gray-700 flex flex-col bg-opacity-60">
                    {sections.map((section, sectionIndex) => (
                        <div key={`section-${sectionIndex}`}>
                            <BubbleDonutBuilderSection index={sectionIndex} defaultSection={section} onChange={handleSectionChange} />
                        </div>
                    ))}

                    <button className="font-bold ml-auto text-sm border border-gray-700 rounded px-3 py-2 bg-gray-800" onClick={addSection}>Add section</button>
                </div>
            </div>
        </div>
    );
};

export default BubbleDonutBuilder;
