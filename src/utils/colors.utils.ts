import * as d3 from "d3";

export const groupColors = (groupCount: number) => {
  const groups = [];

  for (let i = 0; i < groupCount; i++) {
    groups.push(`group ${i + 1}`);
  }

  return d3.scaleOrdinal().domain(groups).range(d3.schemeSet2);
};
