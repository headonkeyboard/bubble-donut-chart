import React from "react";
import renderer from "react-test-renderer";
import {fireEvent, render} from "@testing-library/react";
import BubbleDonutBuilder from "./BubbleDonutBuilder";

const INITIAL_GROUPS_SIZE = [25, 70, 42, 24, 54];

describe('BubbleDonutBuilder', () => {
    test('BubbleDonutBuilder should display a BubbleDonutBuilderGroup for each group sizes', () => {
        const component = renderer.create(
            <BubbleDonutBuilder groupSizes={INITIAL_GROUPS_SIZE} onBubbleCountChange={() => {}} onGroupsSizeChange={() => {}} defaultBubbleCount={150} />
        );

        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    test('BubbleDonutBuilder onGroupsSizeChange callback should receive all new group sizes after each slider change', () => {
        const onGroupsSizeChangeCallback = jest.fn();

        const {container} = render(
            <BubbleDonutBuilder groupSizes={INITIAL_GROUPS_SIZE} onBubbleCountChange={() => {}} onGroupsSizeChange={onGroupsSizeChangeCallback} defaultBubbleCount={150} />
        );

        const slider = container.querySelector('input[name^="group_size"][type=range]') as Element;

        fireEvent.change(slider, {
            target: { value: 60 }
        });

        expect(onGroupsSizeChangeCallback).toHaveBeenCalledWith([60, 10, 10, 10, 10]);
    });

    test('BubbleDonutBuilder onBubbleCountChange callback should receive new bubble count after bubble count slider change', () => {
        const onBubbleCountChangeCallback = jest.fn();

        const {container} = render(
            <BubbleDonutBuilder groupSizes={INITIAL_GROUPS_SIZE} onBubbleCountChange={onBubbleCountChangeCallback} onGroupsSizeChange={() => {}} defaultBubbleCount={150} />
        );

        const slider = container.querySelector('input[name="bubble_count"][type=range]') as Element;

        fireEvent.change(slider, {
            target: { value: 60 }
        });

        expect(onBubbleCountChangeCallback).toHaveBeenCalledWith(60);
    });

    test('BubbleDonutBuilder should allow user to add new groups', () => {

        const onGroupsSizeChangeCallback = jest.fn();

        const {container} = render(
            <BubbleDonutBuilder groupSizes={INITIAL_GROUPS_SIZE} onBubbleCountChange={() => {}} onGroupsSizeChange={onGroupsSizeChangeCallback} defaultBubbleCount={150} />
        );

        const addNewGroupButton = container.querySelector('button[name="add_group"]') as Element;

        fireEvent.click(addNewGroupButton);

        const newExpectedGroupsSize = Math.floor(100 / (INITIAL_GROUPS_SIZE.length + 1));

        expect(onGroupsSizeChangeCallback).toHaveBeenCalledWith([
            ...INITIAL_GROUPS_SIZE.map(() => newExpectedGroupsSize),
            newExpectedGroupsSize
        ]);
    });
});
