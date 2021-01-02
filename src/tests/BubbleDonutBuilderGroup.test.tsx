import React from "react";
import renderer from "react-test-renderer";
import { fireEvent, render } from "@testing-library/react";
import BubbleDonutBuilderGroup from "../ui/builder/BubbleDonutBuilderGroup";

describe("BubbleDonutBuilderGroup", () => {
  test("BubbleDonutBuilderGroup should display a slider input with a label", () => {
    const component = renderer.create(
      <BubbleDonutBuilderGroup
        index={1}
        defaultSize={100}
        color="#EEEEEE"
        onChange={() => {}}
      />
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("BubbleDonutBuilderGroup onChange function should receive new slider value after each slider change", () => {
    const GROUP_INDEX = 1;
    const SLIDER_INITIAL_VALUE = 100;
    const TRIGGER_SLIDER_NEW_VALUE = 20;

    const onChangeCallback = jest.fn();

    const { container } = render(
      <BubbleDonutBuilderGroup
        index={GROUP_INDEX}
        defaultSize={SLIDER_INITIAL_VALUE}
        color="#EEEEEE"
        onChange={onChangeCallback}
      />
    );

    const slider = container.querySelector("input[type=range]");
    fireEvent.change(slider, {
      target: { value: 20 },
    });

    expect(onChangeCallback).toHaveBeenCalledWith(
      GROUP_INDEX,
      TRIGGER_SLIDER_NEW_VALUE
    );
  });
});
