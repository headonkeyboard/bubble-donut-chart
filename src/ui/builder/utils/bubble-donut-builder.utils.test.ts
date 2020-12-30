import React from "react";
import { newGroupSize, updatedGroupsSize } from "./bubble-donut-builder.utils";

const INITIAL_GROUPS_SIZE = [25, 70, 42, 24, 54];

describe("bubble donut builder utils", () => {
  test("newGroupSize should return a new group size equal to 100/groupCount (including the new one)", () => {
    let size = newGroupSize(3);
    expect(size).toBe(25);

    size = newGroupSize(9);
    expect(size).toBe(10);
  });

  test("newGroupSize should throw an exception with a negative group count as argument", () => {
    const invalidGroupSizeGenerator = () => newGroupSize(-5);

    expect(invalidGroupSizeGenerator).toThrow();
  });

  test("updatedGroupsSize should return a new array with the updated group size value and the remaining percent equally distributed to other groups", () => {
    const NEW_GROUP_SIZE = 80;
    const OTHER_GROUP_SIZE =
      (100 - NEW_GROUP_SIZE) / (INITIAL_GROUPS_SIZE.length - 1);

    const newGroupsSize = updatedGroupsSize(
      INITIAL_GROUPS_SIZE,
      0,
      NEW_GROUP_SIZE
    );
    expect(newGroupsSize).toEqual([
      NEW_GROUP_SIZE,
      OTHER_GROUP_SIZE,
      OTHER_GROUP_SIZE,
      OTHER_GROUP_SIZE,
      OTHER_GROUP_SIZE,
    ]);
  });

  test("updatedGroupsSize should keep updated value in range [1, 100 - groupCount - 1] when update size is too high", () => {
    const newGroupsSize = updatedGroupsSize(INITIAL_GROUPS_SIZE, 0, 120);
    expect(newGroupsSize[0]).toEqual(100 - INITIAL_GROUPS_SIZE.length - 1);
  });

  test("updatedGroupsSize should keep updated value in range [1, 100 - groupCount - 1] when update size is too low", () => {
    const newGroupsSize = updatedGroupsSize(INITIAL_GROUPS_SIZE, 0, -120);
    expect(newGroupsSize[0]).toEqual(1);
  });
});
