import { ChangeEvent, FunctionComponent, useCallback, useRef } from "react";
import { Group } from "../models";

type BubbleDonutBuilderSectionProps = {
  index: number;
  defaultSection: Group;
  onChange: (sectionIndex: number, section: Group) => void;
};

const BubbleDonutBuilderSection: FunctionComponent<BubbleDonutBuilderSectionProps> = ({
  index,
  defaultSection,
  onChange,
}) => {
  const section = useRef<Group>(defaultSection);

  const handleSliderChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      section.current = parseInt(e.target.value, 10);

      onChange(index, section.current);
    },
    [index, onChange]
  );

  return (
    <div className="space-y-2">
      <div className="flex space-x-4">
        <p>Group #{index + 1}</p>
        <input
          className="flex-1"
          name="bubbleCount"
          onChange={handleSliderChange}
          type="range"
          value={defaultSection}
          min="1"
          max="100"
        />
      </div>
    </div>
  );
};

export default BubbleDonutBuilderSection;
