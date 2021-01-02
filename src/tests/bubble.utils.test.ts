import {getBubbleRadius} from "../lib/core/utils/bubble.utils";

describe('bubble utils', () => {
   it('getBubbleRadius with a negative bubble value should return 1', () => {
       const bubbleRadius = getBubbleRadius(-10, 100, 10);
       expect(bubbleRadius).toEqual(1);
   });

    it('getBubbleRadius should return a radius of a bubble with an area lower than donut area', () => {
        const bubbleValue = 10;
        const donutArea = 200;
        const totalBubbleValues = 100;

        const bubbleRadius = getBubbleRadius(bubbleValue, donutArea, totalBubbleValues);
        const bubbleArea = Math.round(Math.pow(bubbleRadius, 2) * Math.PI);

        expect(bubbleArea).toEqual((bubbleValue * donutArea * 0.5) / totalBubbleValues);
    });
});
