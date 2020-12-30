import React, {
  ChangeEvent,
  FunctionComponent,
  useCallback,
  useRef,
} from "react";
import BubbleDonutBuilderGroup from "./BubbleDonutBuilderGroup";
import { groupColors } from "../../utils/colors.utils";
import Card from "../Card";
import {
  newGroupSize,
  updatedGroupsSize,
} from "./utils/bubble-donut-builder.utils";

type BubbleDonutBuilderProps = {
  defaultBubbleCount: number;
  /* Group sizes in percent */
  groupSizes: number[];
  onBubbleCountChange: (bubbleCount: number) => void;
  onGroupsSizeChange: (groups: number[]) => void;
};

const BubbleDonutBuilder: FunctionComponent<BubbleDonutBuilderProps> = ({
  defaultBubbleCount,
  groupSizes,
  onGroupsSizeChange,
  onBubbleCountChange,
}) => {
  const groupsSizeRef = useRef<number[]>(groupSizes);
  const groupsColors = groupColors(groupSizes.length);

  const handleGroupSizeChange = useCallback(
    (groupIndex: number, size: number) => {
      groupsSizeRef.current = updatedGroupsSize(
        groupsSizeRef.current,
        groupIndex,
        size
      );
      onGroupsSizeChange(groupsSizeRef.current);
    },
    [onGroupsSizeChange]
  );

  const addGroup = useCallback(() => {
    const newGroup = newGroupSize(groupSizes.length) as number;
    groupsSizeRef.current = [...groupsSizeRef.current, newGroup];

    handleGroupSizeChange(groupsSizeRef.current.length - 1, newGroup);
  }, [groupSizes.length, handleGroupSizeChange]);

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
            <label htmlFor="bubble_count">Bubble Count</label>
            <input
              onChange={handleBubbleCountChange}
              className="flex-1"
              id={"bubble_count"}
              name="bubble_count"
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
                  color={groupsColors(`group ${groupIndex + 1}`) as string}
                  onChange={handleGroupSizeChange}
                />
              </div>
            </div>
          ))}

          <button
            name="add_group"
            className="font-bold ml-auto text-sm border border-gray-700 rounded px-3 py-2 bg-gray-800 hover:border-gray-100 transition-border duration-300"
            onClick={addGroup}
          >
            Add a new group
          </button>
        </Card>
      </div>
    </div>
  );
};

export default BubbleDonutBuilder;
