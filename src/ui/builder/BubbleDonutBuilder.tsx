import React, {FunctionComponent, useCallback, useRef} from "react";
import BubbleDonutBuilderSection from "./BubbleDonutBuilderSection";
import {Section} from "../models";

type BubbleDonutBuilderProps = {
    sections: Section[];
    onChange: (sections: Section[]) => void;
}

const defaultSection = (): Section => ({
    bubbleCount: 50,
    bubbleMinValue: 10,
    bubbleMaxValue: 100,
});

const BubbleDonutBuilder: FunctionComponent<BubbleDonutBuilderProps> = ({sections, onChange}) => {
    const sectionsRef = useRef<Section[]>(sections);

    const addSection = useCallback(() => {
        const newSections = [
            ...sectionsRef.current,
            defaultSection()
        ];

        sectionsRef.current = newSections;
        onChange(newSections);
    }, [onChange]);

    const handleSectionChange = useCallback((sectionIndex: number, section: Section) => {
        const newSections = [...sectionsRef.current];
        newSections[sectionIndex] = section;

        sectionsRef.current = newSections;
        onChange(newSections);
    }, [onChange]);

    return (
        <div className="space-y-4">
            <div className="space-y-4">
                {sections.map((section, sectionIndex) => (
                    <div key={`section-${sectionIndex}`}>
                        <BubbleDonutBuilderSection index={sectionIndex} defaultSection={section} onChange={handleSectionChange} />
                    </div>
                ))}
            </div>

            <button onClick={addSection}>Add section</button>
        </div>
    );
};

export default BubbleDonutBuilder;
