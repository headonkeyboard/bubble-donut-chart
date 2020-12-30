import React, {
  ChangeEvent,
  FunctionComponent,
  useCallback,
  useRef,
} from "react";

type BubbleDonutBuilderGroupProps = {
  index: number;
  defaultSize: number;
  color: string;
  onChange: (groupIndex: number, size: number) => void;
};

const BubbleDonutBuilderGroup: FunctionComponent<BubbleDonutBuilderGroupProps> = ({
  index,
  defaultSize,
  color,
  onChange,
}) => {
  const groupSizeRef = useRef<number>(defaultSize);

  const handleSliderChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      groupSizeRef.current = parseInt(e.target.value, 10);

      onChange(index, groupSizeRef.current);
    },
    [index, onChange]
  );

  return (
    <div className="space-y-2">
      <div className="flex space-x-4 items-center">
        <label
          htmlFor={`group_${index}`}
          className="flex items-center space-x-2"
        >
          <span
            className="block flex-shrink-0 w-3 h-3 rounded-full"
            style={{
              backgroundColor: color,
            }}
          />
          <span>Group #{index + 1}</span>
        </label>
        <input
          className="flex-1"
          id={`group_${index}`}
          name={`group_size_${index}`}
          onChange={handleSliderChange}
          type="range"
          value={defaultSize}
          min="1"
          max="100"
        />
      </div>
    </div>
  );
};

export default BubbleDonutBuilderGroup;
