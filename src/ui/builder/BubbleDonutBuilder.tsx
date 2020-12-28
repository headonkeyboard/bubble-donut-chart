import React, {
  ChangeEvent,
  FunctionComponent,
  useCallback,
  useRef,
} from "react";
import BubbleDonutBuilderSection from "./BubbleDonutBuilderSection";
import { Group } from "../models";
import { groupColors } from "../../utils/colors.utils";

type BubbleDonutBuilderProps = {
  defaultBubbleCount: number;
  groups: Group[];
  onBubbleCountChange: (bubbleCount: number) => void;
  onChange: (sections: Group[]) => void;
};

const defaultSection = (sectionCount: number): Group =>
  Math.floor(100 / (sectionCount + 1));

const BubbleDonutBuilder: FunctionComponent<BubbleDonutBuilderProps> = ({
  defaultBubbleCount,
  groups,
  onChange,
  onBubbleCountChange,
}) => {
  const sectionsRef = useRef<Group[]>(groups);

  var groupsColors = groupColors(groups.length);

  const handleSectionChange = useCallback(
    (sectionIndex: number, section: Group) => {
      const newSection = Math.max(
        Math.min(section, 100 - sectionsRef.current.length * 2),
        2
      );
      const otherSectionTotal = Math.max(100 - newSection, 1);

      sectionsRef.current = sectionsRef.current.map(
        (someSection, someSectionIndex) => {
          if (someSectionIndex !== sectionIndex) {
            return otherSectionTotal / (sectionsRef.current.length - 1);
          } else {
            return newSection;
          }
        }
      );

      onChange(sectionsRef.current);
    },
    [onChange]
  );

  const addSection = useCallback(() => {
    const newSection = defaultSection(groups.length);

    const newSections = [...sectionsRef.current, newSection];

    sectionsRef.current = newSections;

    handleSectionChange(sectionsRef.current.length - 1, newSection);
  }, [groups.length, handleSectionChange]);

  const handleBubbleCountChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onBubbleCountChange(parseInt(e.target.value, 10));
    },
    [onBubbleCountChange]
  );

  return (
    <div className="space-y-4 font-light">
      <div className="space-y-4">
        <div className="rounded-lg p-4 bg-gray-900 flex items-center space-x-4 border border-gray-700 bg-opacity-60">
          <label>Bubble Count</label>
          <input
            onChange={handleBubbleCountChange}
            className="flex-1"
            name="bubbleCount"
            type="range"
            defaultValue={defaultBubbleCount}
            min="25"
            max="1000"
          />
        </div>

        <div className="space-y-4 rounded-lg p-4 bg-gray-900 border border-gray-700 flex flex-col bg-opacity-60">
          {groups.map((section, sectionIndex) => (
            <div
              className="flex items-center space-x-2"
              key={`group-${sectionIndex}`}
            >
              <div
                className="flex-shrink-0 w-3 h-3 rounded-full"
                style={{
                  backgroundColor: groupsColors(
                    `group ${sectionIndex + 1}`
                  ) as string,
                }}
              ></div>
              <div className="flex-1">
                <BubbleDonutBuilderSection
                  index={sectionIndex}
                  defaultSection={section}
                  onChange={handleSectionChange}
                />
              </div>
            </div>
          ))}

          <button
            className="font-bold ml-auto text-sm border border-gray-700 rounded px-3 py-2 bg-gray-800"
            onClick={addSection}
          >
            Add a new group
          </button>
        </div>
      </div>
    </div>
  );
};

export default BubbleDonutBuilder;
