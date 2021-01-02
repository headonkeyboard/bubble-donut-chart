import {getRawDataByGroup, getRawDataWeightSum} from "../lib/core/utils/raw-data.utils";
import dataSample from "./fixtures/data-sample.json"

describe('raw data utils', () => {
  test('getRawDataWeightSum should return the sum of entries weight property', () => {
    const sum = getRawDataWeightSum(dataSample);
    expect(sum).toBe(40);
  });

  test('getRawDataByGroup should group entries by their group property', () => {
    const groups = getRawDataByGroup(dataSample);

    expect(groups.size).toBe(2);

    expect(groups.get('group 1')).toEqual(dataSample.filter(entry => entry.group === 'group 1'));
    expect(groups.get('group 2')).toEqual(dataSample.filter(entry => entry.group === 'group 2'));
  });
});
