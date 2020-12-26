import {Bubble} from "./models/models";
import {Section} from "../../ui/models";

export function getBubbles(sections: Section[]): Bubble[] {
  const bubbles: Bubble[] = [];

  let nbBubble = 0;

  sections.forEach((section, sectionIndex) => {
    for (let j = 0; j < section.bubbleCount; j++) {
      let bubbleValue = getRandomInt(section.bubbleMinValue, section.bubbleMaxValue);

      const bubbleId = `bubble_${nbBubble}`;

      bubbles.push({
        group: `group ${sectionIndex + 1}`,
        weight: bubbleValue,
        id: bubbleId,
        label: 'some label',
      });

      nbBubble++;
    }
  });

  return bubbles;
}

export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * Math.floor(max - min)) + min;
}
