import {rawDataToBubbleDonut} from "../../ui/bubble-donut-chart/utils/bubble-donut-d3-layout.utils";

// prefix function with mock to bypass jest guard
const mockRawDataToBubbleDonut = rawDataToBubbleDonut;

jest.mock('worker-loader!../../bubble.worker', () => {
    class MockBubbleDonutWorker {
        private callback!: (event: MessageEvent) => void;

        addEventListener(messageType: string, callback: (event: MessageEvent) => void) {
            this.callback = callback;
        }

        postMessage(test: any) {
            const bubbleDonut = mockRawDataToBubbleDonut(test);
            this.callback({
                data: {
                    bubbles: bubbleDonut.getBubbles(),
                    groupCount: bubbleDonut.sections.size
                }
            } as MessageEvent);
        }

        terminate() {}
    }

    return MockBubbleDonutWorker;
}, {virtual: true});
