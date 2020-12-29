/**
 * Return a new group size equal to 100/groupCount (including the new one)
 * This size make the equal distribution with other groups easier when adding a new group
 *
 * @param groupCount number of existing groups before adding a new one
 */
export const newGroupSize = (groupCount: number): number | void => {
    if (groupCount < 1) {
        throw new Error("Group count must be greater than one");
    }

    return Math.floor(100 / (groupCount + 1));
};


/**
 * Return new groups size after group at updateIndex has been updated with a given updateSize
 * Group at updateIndex is updated with updateSize but keeps its value in range [1, 100 - groupCount - 1]
 * Other groups update their size to share remaining percentage equally
 *
 * @param groupsSize Every group sizes in percent
 * @param updateIndex The index of the group being updated
 * @param updateSize The new value of the group being updated
 */
export const updatedGroupsSize = (groupsSize: number[], updateIndex: number, updateSize: number) => {
    const updatedGroupNewSize = Math.max(
        Math.min(updateSize, 100 - groupsSize.length - 1),
        1
    );
    const otherGroupsSizeSum = Math.max(100 - updatedGroupNewSize, 1);
    const otherGroupsNewSize = Math.floor(otherGroupsSizeSum / (groupsSize.length - 1));

    return groupsSize.map(
        (groupSize, groupIndex) => {
            if (groupIndex !== updateIndex) {
                return otherGroupsNewSize;
            } else {
                return updatedGroupNewSize;
            }
        }
    );
};
