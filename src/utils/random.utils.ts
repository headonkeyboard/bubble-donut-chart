import { RawData } from "../lib/core/models";

/**
 * Returns an array of random raw data usable in a d3js charts
 *
 * @param count number of raw data to generate
 * @param groupsSize number in percent of data to assign to each groups
 */
export function getRandomRawData(
  count: number,
  groupsSize: number[]
): RawData[] {
  const rawData: RawData[] = [];

  groupsSize.forEach((groupSize, groupIndex) => {
    const sectionBubbleCount = Math.floor((groupSize / 100) * count);

    for (let i = 0; i < sectionBubbleCount; i++) {
      const entryValue = getRandomInt(1, 10);
      const entryId = `entry_${i}`;

      rawData.push({
        group: `group ${groupIndex + 1}`,
        weight: entryValue,
        id: entryId,
      });
    }
  });

  return rawData;
}

export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * Math.floor(max - min)) + min;
}
