import { RawData } from "./models/models";

export function getBubbles(bubbleCount: number, sections: number[]): RawData[] {
  const bubbles: RawData[] = [];

  let nbBubble = 0;

  sections.forEach((section, sectionIndex) => {
    const sectionBubbleCount = Math.floor((section / 100) * bubbleCount);
    for (let j = 0; j < sectionBubbleCount; j++) {
      let bubbleValue = getRandomInt(1, 10);

      const bubbleId = `bubble_${nbBubble}`;

      bubbles.push({
        group: `group ${sectionIndex + 1}`,
        weight: bubbleValue,
        id: bubbleId,
        label: "some label",
      });

      nbBubble++;
    }
  });

  return bubbles;
}

export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * Math.floor(max - min)) + min;
}
