import React from "react";
import {createD3SvgRoot, layoutBubbles, resizeD3ViewportAndBubbles} from "./bubble-donut-d3-layout.utils";
import {BubbleWithCoordsAndRadius, RawData} from "../../lib/core/models/models";

const data: RawData[] = [
    { id: '1', group: 'group 1', label: 'test', weight: 10 },
    { id: '2', group: 'group 1', label: 'test', weight: 10 },
    { id: '3', group: 'group 2', label: 'test', weight: 10 },
    { id: '4', group: 'group 2', label: 'test', weight: 10 },
];

const SVG_ROOT_SIZE = 200;

let wrapper!: HTMLDivElement;
let selection!: d3.Selection<SVGSVGElement, BubbleWithCoordsAndRadius, null, undefined>;

beforeEach(() => {
    wrapper = document.createElement('div');
    selection = createD3SvgRoot(wrapper, SVG_ROOT_SIZE);
});

test("createD3SvgRoot", () => {
    expect(wrapper).toMatchSnapshot();
});

test("layoutBubbles", () => {
    layoutBubbles(selection, SVG_ROOT_SIZE, data);

    const selectionNodeChildren = selection.node()?.children;
    expect(selectionNodeChildren?.length).toBe(data.length);

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

test('resizeD3ViewportAndBubbles should resize svg root element and circles children', (done) => {
    const RESIZE_RATIO = 2;

    layoutBubbles(selection, SVG_ROOT_SIZE, data);

    const circleRadiusBeforeResize = new Map<number, any>();

    // wait for layout animations to finish
    setTimeout(() => {
        const selectionNodeChildren = selection?.node().children as HTMLCollection;

        for (let i = 0; i < selectionNodeChildren.length; i++) {
            const child = selectionNodeChildren.item(i) as Element;
            circleRadiusBeforeResize.set(i, parseFloat(child.getAttribute('r') as string));
        }

        resizeD3ViewportAndBubbles(selection, SVG_ROOT_SIZE * RESIZE_RATIO);

        for (let i = 0; i < selectionNodeChildren.length; i++) {
            const child = selectionNodeChildren.item(i) as Element;
            const childRadius = parseFloat(child.getAttribute('r') as string);

            expect(childRadius).toBe(circleRadiusBeforeResize.get(i) * RESIZE_RATIO);
        }

        done();
    }, 1000);
});
