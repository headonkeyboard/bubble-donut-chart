import React from "react";
import {createD3SvgRoot, layoutBubbles, resizeD3ViewportAndBubbles} from "./bubble-donut-d3-layout.utils";
import {BubbleWithCoordsAndRadius, RawData} from "../../../lib/core/models/models";

const data: RawData[] = [
    { id: '1', group: 'group 1', label: 'test', weight: 10 },
    { id: '2', group: 'group 1', label: 'test', weight: 10 },
    { id: '3', group: 'group 2', label: 'test', weight: 10 },
    { id: '4', group: 'group 2', label: 'test', weight: 10 },
];

const SVG_ROOT_SIZE = 200;

let wrapper!: HTMLDivElement;
let selection!: d3.Selection<SVGSVGElement, BubbleWithCoordsAndRadius, null, undefined>;

describe('bubble donut d3 layout utils', () => {

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

        type Circle = {
            r: number,
            cx: number,
            cy: number
        };

        const circlePropertiesBefreResize = new Map<number, Circle>();

        // wait for layout animations to finish
        setTimeout(() => {
            const selectionNodeChildren = selection?.node().children as HTMLCollection;

            for (let i = 0; i < selectionNodeChildren.length; i++) {
                const child = selectionNodeChildren.item(i) as Element;
                circlePropertiesBefreResize.set(i, {
                    cx: parseFloat(child.getAttribute('cx') as string),
                    cy: parseFloat(child.getAttribute('cy') as string),
                    r: parseFloat(child.getAttribute('r') as string)
                });
            }

            resizeD3ViewportAndBubbles(selection, SVG_ROOT_SIZE * RESIZE_RATIO);

            for (let i = 0; i < selectionNodeChildren.length; i++) {
                const circleBeforeResize = circlePropertiesBefreResize.get(i) as Circle;

                const child = selectionNodeChildren.item(i) as Element;
                const childR  = parseFloat(child.getAttribute('r') as string);
                const childCx = parseFloat(child.getAttribute('cx') as string);
                const childCy = parseFloat(child.getAttribute('cy') as string);

                expect(childR).toBe(circleBeforeResize.r * RESIZE_RATIO);
                expect(childCx).toBe(circleBeforeResize.cx * RESIZE_RATIO);
                expect(childCy).toBe(circleBeforeResize.cy * RESIZE_RATIO);
            }

            done();
        }, 1000);
    });
});
