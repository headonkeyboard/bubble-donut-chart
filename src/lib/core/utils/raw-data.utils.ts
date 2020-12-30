import { RawData } from "../models";

/**
 * Return RawData entries grouped by their group property
 *
 * @param rawData
 */
export const getRawDataByGroup = (
  rawData: RawData[]
): Map<string, RawData[]> => {
  const rawDataByGroup = new Map<string, RawData[]>();

  rawData.forEach((entry) => {
    if (rawDataByGroup.has(entry.group)) {
      (rawDataByGroup.get(entry.group) as RawData[]).push(entry);
    } else {
      rawDataByGroup.set(entry.group, [entry]);
    }
  });

  return rawDataByGroup;
};

/**
 * Return the sum of weight property of all rawData entries
 *
 * @param rawData
 */
export const getRawDataWeightSum = (rawData: RawData[]): number => {
  return rawData.reduce((acc, entry) => acc + entry.weight, 0);
};
