/* eslint-disable */
import {rawDataToBubbleDonut} from "./ui/bubble-donut-chart/utils/bubble-donut-d3-layout.utils";

const ctx: Worker = self as any;

// Respond to message from parent thread
ctx.addEventListener('message', (event: MessageEvent) => {
    const bubbleDonut = rawDataToBubbleDonut(event.data);

    ctx.postMessage({bubbles: bubbleDonut.getBubbles(), groupCount: bubbleDonut.sections.size});
});

export default null as any;
