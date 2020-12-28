import React, {
  ChangeEvent,
  FunctionComponent,
  useCallback,
  useRef,
} from "react";
import BubbleDonutBuilderGroup from "./BubbleDonutBuilderGroup";
import { groupColors } from "../../utils/colors.utils";
import Card from "../Card";

type BubbleDonutBuilderProps = {
  defaultBubbleCount: number;
  /* Group sizes in percent */
  groupSizes: number[];
  onBubbleCountChange: (bubbleCount: number) => void;
  onChange: (sections: number[]) => void;
};

const defaultSection = (sectionCount: number): number =>
  Math.floor(100 / (sectionCount + 1));

const BubbleDonutBuilder: FunctionComponent<BubbleDonutBuilderProps> = ({
  defaultBubbleCount,
  groupSizes,
  onChange,
  onBubbleCountChange,
}) => {
  const sectionsRef = useRef<number[]>(groupSizes);

  const groupsColors = groupColors(groupSizes.length);

  const handleSectionChange = useCallback(
    (sectionIndex: number, section: number) => {
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
    const newSection = defaultSection(groupSizes.length);
    sectionsRef.current = [...sectionsRef.current, newSection];

    handleSectionChange(sectionsRef.current.length - 1, newSection);
  }, [groupSizes.length, handleSectionChange]);

  const handleBubbleCountChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onBubbleCountChange(parseInt(e.target.value, 10));
    },
    [onBubbleCountChange]
  );

  return (
    <div className="space-y-4 font-light">
      <div className="space-y-4">
        <Card>
            <div className="flex space-x-4">
              <label htmlFor="bubbleCount">Bubble Count</label>
              <input
                onChange={handleBubbleCountChange}
                className="flex-1"
                id={"bubbleCount"}
                name="bubbleCount"
                type="range"
                defaultValue={defaultBubbleCount}
                min="25"
                max="1000"
              />
            </div>
        </Card>

        <Card>
          {groupSizes.map((groupSize, groupIndex) => (
            <div
              className="flex items-center space-x-2"
              key={`group-${groupIndex}`}
            >
              <div className="flex-1">
                <BubbleDonutBuilderGroup
                  index={groupIndex}
                  defaultSize={groupSize}
                  color={groupsColors(
                      `group ${groupIndex + 1}`
                  ) as string}
                  onChange={handleSectionChange}
                />
              </div>
            </div>
          ))}

          <button
            className="font-bold ml-auto text-sm border border-gray-700 rounded px-3 py-2 bg-gray-800 hover:border-gray-100 transition-border duration-300"
            onClick={addSection}
          >
            Add a new group
          </button>
        </Card>
      </div>
    </div>
  );
};

export default BubbleDonutBuilder;
