import React from "react";
import {createD3SvgRoot, layoutBubbles} from "./bubble-donut-d3-layout.utils";
import {RawData} from "../../lib/core/models/models";

jest.useFakeTimers();

const data: RawData[] = [
    { id: '1', group: 'group 1', label: 'test', weight: 10 },
    { id: '2', group: 'group 1', label: 'test', weight: 10 },
    { id: '3', group: 'group 2', label: 'test', weight: 10 },
    { id: '4', group: 'group 2', label: 'test', weight: 10 },
];

test("createD3SvgRoot", () => {
    const wrapper = document.createElement('div');
    createD3SvgRoot(wrapper, 200);
    expect(wrapper).toMatchSnapshot();
});

test("layoutBubbles", () => {
    const wrapper = document.createElement('div');
    const selection = createD3SvgRoot(wrapper, 200);
    layoutBubbles(selection, 200, data);

    const selectionNodeChildren = selection.node().children;
    expect(selectionNodeChildren.length).toBe(data.length);

    for (let i = 0; i < selectionNodeChildren.length; i++) {
        const child = selectionNodeChildren.item(i);
        expect(child.tagName).toBe('circle');
        expect(child.getAttribute('fill')).toBeDefined();
        expect(child.getAttribute('opacity')).toBeDefined();
        expect(child.getAttribute('r')).toBeDefined();
        expect(child.getAttribute('cx')).toBeDefined();
        expect(child.getAttribute('cy')).toBeDefined();
    }
});
