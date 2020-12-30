import {
  RawData,
  BubbleWithCoordsAndRadius,
  Grid,
  GridEdges,
  Point,
  DonutSection,
  MaxDistancePoint,
} from "./models";
import { gridPointPositionToPixels } from "./utils/coords.utils";
import { generateGrid, getBubblePositionAndRadius } from "./utils/bubble.utils";
import { getRawDataByGroup, getRawDataWeightSum } from "./utils/raw-data.utils";

class BubbleDonut {
  sections = new Map<string, DonutSection>();
  rawData: RawData[] = [];

  donutArea = -1;
  allBubbleWeightSum = 0;

  constructor(
    public innerRadius: number,
    public outerRadius: number,
    rawData: RawData[] = []
  ) {
    this.donutArea = this.getDonutArea();

    if (rawData.length > 0) {
      this.loadRawData(rawData);
    }
  }

  /**
   * Format raw data to bubble sections
   *
   * @param rawData entries that will be formatted as Bubble Donut
   */
  loadRawData(rawData: RawData[]): void {
    this.sections.clear();

    this.rawData = rawData;

    // bubble positioning algorithm needs data to be sorted by their weight with biggest weight first
    this.rawData.sort((a, b) => b.weight - a.weight);

    // each bubble radius is proportional to the sum of all data weight
    this.allBubbleWeightSum = getRawDataWeightSum(this.rawData);

    const rawDataByGroup = getRawDataByGroup(this.rawData);

    // keep group order consistent to always display groups in the same place of the bubble donut
    const groupKeys = Array.from(rawDataByGroup.keys());
    groupKeys.sort();

    groupKeys.forEach((groupKey) => {
      const section = this.newDonutSection(
        groupKey,
        rawDataByGroup.get(groupKey) as RawData[]
      );
      this.sections.set(groupKey, section);
    });
  }

  /**
   * Returns a flat array of BubbleWithCoordsAndRadius extracted from each donut sections
   */
  getBubbles(): BubbleWithCoordsAndRadius[] {
    const bubbles: BubbleWithCoordsAndRadius[] = [];

    for (let [, bubbleSection] of this.sections) {
      bubbleSection.bubbles.forEach((bubble) => {
        bubbles.push(bubble);
      });
    }

    return bubbles;
  }

  /**
   * Return a newly created Donut Section
   *
   * @param groupKey group value from rawData entries
   * @param sectionRawData entries that will be formatted as Bubble Donut
   */
  private newDonutSection(
    groupKey: string,
    sectionRawData: RawData[]
  ): DonutSection {
    const ratio = getRawDataWeightSum(sectionRawData) / this.allBubbleWeightSum;
    const previousSections = Array.from(this.sections);

    let startAngle = 0;

    if (previousSections.length > 0) {
      startAngle = previousSections[previousSections.length - 1][1].endAngle;
    }

    const endAngle = startAngle + ratio * 2 * Math.PI;
    const gridLength = Math.min(Math.max(sectionRawData.length, 10), 100);
    const gridEdges = this.getGridEdges(gridLength, startAngle, endAngle);
    const bubblesWithCoordsAndRadius: BubbleWithCoordsAndRadius[] = [];

    let grid: Grid, maxDistancePoint: MaxDistancePoint;

    const gridPointPositionsCache = new Map<number, Point>();

    // each grid point will be mapped to it's min distance with an edge of the section
    ({ grid, maxDistancePoint } = generateGrid(
      gridEdges,
      gridLength,
      startAngle,
      endAngle,
      this.innerRadius,
      this.outerRadius,
      gridPointPositionsCache
    ));

    sectionRawData.forEach((bubble) => {
      // find a point on the grid which have the max available distance from any obstacle
      // this will be the center of the bubble
      const maxDistancePosition = gridPointPositionToPixels(
        maxDistancePoint.x,
        maxDistancePoint.y,
        startAngle,
        endAngle,
        gridLength,
        this.innerRadius,
        this.outerRadius
      );

      // apply a bit of randomness from grid position
      const { bubbleX, bubbleY, bubbleR } = getBubblePositionAndRadius(
        maxDistancePoint.maxDistance,
        maxDistancePosition,
        bubble.weight,
        this.donutArea,
        this.allBubbleWeightSum
      );

      // store newly "added" bubble to compute distance from it on next grid refresh
      bubblesWithCoordsAndRadius.push({
        ...bubble,
        x: bubbleX,
        y: bubbleY,
        r: bubbleR,
      });

      // refresh grid to map items with their min distance from any obstacle (an edge or another bubble)
      ({ grid, maxDistancePoint } = generateGrid(
        gridEdges,
        gridLength,
        startAngle,
        endAngle,
        this.innerRadius,
        this.outerRadius,
        gridPointPositionsCache,
        grid,
        bubblesWithCoordsAndRadius
      ));
    });

    return {
      id: groupKey,
      ratio,
      bubbles: bubblesWithCoordsAndRadius,
      startAngle,
      endAngle,
      gridLength,
      edges: gridEdges,
    };
  }

  /**
   * Returns many points all around a section.
   *
   * @param gridLength
   * @param startAngle
   * @param endAngle
   */
  private getGridEdges(
    gridLength: number,
    startAngle: number,
    endAngle: number
  ): GridEdges {
    const gridEdges: GridEdges = {
      top: [],
      right: [],
      bottom: [],
      left: [],
    };

    for (let i = 0; i <= gridLength; i++) {
      gridEdges.left.push(
        gridPointPositionToPixels(
          i,
          0,
          startAngle,
          endAngle,
          gridLength,
          this.innerRadius,
          this.outerRadius
        )
      ); // side edge

      gridEdges.right.push(
        gridPointPositionToPixels(
          i,
          gridLength,
          startAngle,
          endAngle,
          gridLength,
          this.innerRadius,
          this.outerRadius
        )
      ); // side edge

      // reduce some edges to reduce compute time during grid generation
      gridEdges.bottom.push(
        gridPointPositionToPixels(
          0,
          i,
          startAngle,
          endAngle,
          gridLength,
          this.innerRadius,
          this.outerRadius
        )
      ); // inner edge

      gridEdges.top.push(
        gridPointPositionToPixels(
          gridLength,
          i,
          startAngle,
          endAngle,
          gridLength,
          this.innerRadius,
          this.outerRadius
        )
      ); // outer edge
    }

    return gridEdges;
  }

  /**
   * Returns donut area by subtracting the area of the outer disc with the area of the inner disc
   */
  private getDonutArea(): number {
    const externalCircleArea = Math.PI * Math.pow(this.outerRadius, 2);
    const innerCircleArea = Math.PI * Math.pow(this.innerRadius, 2);

    return externalCircleArea - innerCircleArea;
  }
}

export { BubbleDonut };
