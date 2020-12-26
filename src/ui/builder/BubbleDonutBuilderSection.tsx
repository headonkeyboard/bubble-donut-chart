import {ChangeEvent, FunctionComponent, useCallback, useRef, useState} from "react";
import {Section} from "../models";

type BubbleDonutBuilderSectionProps = {
    index: number;
    defaultSection: Section;
    onChange: (sectionIndex: number, section: Section) => void;
}

const BubbleDonutBuilderSection: FunctionComponent<BubbleDonutBuilderSectionProps> = ({index, defaultSection, onChange}) => {
    const section = useRef<Section>(defaultSection);

    const handleSliderChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        section.current = {
            ...section.current,
            [e.target.name]: parseInt(e.target.value, 10)
        };

        onChange(index, section.current);
    }, []);

    return (
        <div className="space-y-2">
            <p>section #{index + 1}</p>

            <div className="px-4">
                <div className="flex flex-col">
                    <label>Bubble count</label>
                    <input name="bubbleCount" onChange={handleSliderChange} type="range" defaultValue={defaultSection.bubbleCount} min="1" max="400" />
                </div>

                <div className="flex flex-col">
                    <label>Bubble min value</label>
                    <input name="bubbleMinValue" onChange={handleSliderChange} type="range" defaultValue={defaultSection.bubbleMinValue} min="1" max="1000" />
                </div>

                <div className="flex flex-col">
                    <label>Bubble max value</label>
                    <input name="bubbleMaxValue" onChange={handleSliderChange} type="range" defaultValue={defaultSection.bubbleMaxValue} min="1" max="1000" />
                </div>
            </div>
        </div>
    );
};

export default BubbleDonutBuilderSection;
