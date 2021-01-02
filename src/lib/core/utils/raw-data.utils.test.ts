import {RawData} from "../models";
import {getRawDataByGroup, getRawDataWeightSum} from "./raw-data.utils";

const rawData: RawData[] = [
  { id: '1', group: 'group 1', weight: 1 },
  { id: '2', group: 'group 1', weight: 2 },
  { id: '3', group: 'group 2', weight: 4 },
  { id: '4', group: 'group 2', weight: 8 }
];

describe('raw data utils', () => {
  test('getRawDataWeightSum should return the sum of entries weight property', () => {
    const sum = getRawDataWeightSum(rawData);
    expect(sum).toBe(15);
  });

  test('getRawDataByGroup should group entries by their group property', () => {
    const groups = getRawDataByGroup(rawData);

    expect(groups.size).toBe(2);

    expect(groups.get('group 1')).toEqual(rawData.filter(entry => entry.group === 'group 1'));
    expect(groups.get('group 2')).toEqual(rawData.filter(entry => entry.group === 'group 2'));
  });
});
