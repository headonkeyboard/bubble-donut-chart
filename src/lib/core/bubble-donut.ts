import {
  Bubble,
  BubbleWithCoordsAndRadius,
  Grid,
  GridEdges,
  Point,
  Section,
} from "./models/models";
import { getGridPointPosition } from "./utils/coords.utils";
import {
  generateGrid,
  getBubblePositionAndRadius,
  getAllBubbleWeightSum,
} from "./utils/bubble.utils";

class BubbleDonut {
  sections = new Map<string, Section>();
  bubbles: Bubble[] = [];

  donutArea = -1;
  allBubbleWeightSum = 0;

  constructor(
    public innerRadius: number,
    public outerRadius: number,
    bubbles: Bubble[] = []
  ) {
    this.updateRadius(innerRadius, outerRadius);

    if (bubbles.length > 0) {
      this.loadBubbles(bubbles);
    }
  }

  loadBubbles(bubbles: Bubble[]): void {
    var t0 = performance.now();

    this.bubbles = bubbles;
    this.bubbles.sort((a, b) => b.weight - a.weight);

    this.allBubbleWeightSum = getAllBubbleWeightSum(this.bubbles);
    this.sections = new Map();

    const bubblesPerSection: {
      [key: string]: Array<Bubble>;
    } = this.bubbles.reduce((acc: { [key: string]: Array<Bubble> }, bubble) => {
      if (undefined === acc[bubble.group]) {
        acc[bubble.group] = [];
      }

      acc[bubble.group].push(bubble);

      return acc;
    }, {});

    const groupKeys = Object.keys(bubblesPerSection);
    groupKeys.sort((a, b) => {
      const sectionANumber = a.replace("group ", "");
      const sectionBNumber = b.replace("group ", "");

      return parseInt(sectionANumber, 10) - parseInt(sectionBNumber, 10);
    });

    groupKeys.forEach((sectionKey) => {
      const sectionBubbles = bubblesPerSection[sectionKey];
      const sectionRatio =
        getAllBubbleWeightSum(sectionBubbles) / this.allBubbleWeightSum;
      this.addDonutSection(sectionKey, sectionRatio, sectionBubbles);
    });

    var t1 = performance.now();
    console.log(t1 - t0);
  }

  updateRadius(innerRadius: number, outerRadius: number): void {
    this.innerRadius = innerRadius;
    this.outerRadius = outerRadius;

    const externalCircleArea = Math.PI * Math.pow(outerRadius, 2);
    const innerCircleArea = Math.PI * Math.pow(innerRadius, 2);

    this.donutArea = externalCircleArea - innerCircleArea;
  }

  private addDonutSection(
    sectionKey: string,
    ratio: number,
    bubbles: Array<Bubble>
  ): Section {
    const previousSections = Array.from(this.sections);

    let startAngle = 0;

    if (previousSections.length > 0) {
      startAngle = previousSections[previousSections.length - 1][1].endAngle;
    }

    const endAngle = startAngle + ratio * 2 * Math.PI;

    const gridLength = Math.min(Math.max(bubbles.length, 10), 100);

    const gridEdges: GridEdges = {
      top: [],
      right: [],
      bottom: [],
      left: [],
    };

    const innerRatio = Math.ceil(this.outerRadius / this.innerRadius);

    for (let i = 0; i <= gridLength; i++) {
      gridEdges.left.push(
        getGridPointPosition(
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
        getGridPointPosition(
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
      if (0 === Math.round((i % innerRatio) / 2)) {
        gridEdges.bottom.push(
          getGridPointPosition(
            0,
            i,
            startAngle,
            endAngle,
            gridLength,
            this.innerRadius,
            this.outerRadius
          )
        ); // inner edge
      }

      gridEdges.top.push(
        getGridPointPosition(
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

    const bubblesWithCoordsAndRadius: BubbleWithCoordsAndRadius[] = [];

    let grid: Grid,
      maxDistance: number,
      maxDistanceX: number,
      maxDistanceY: number;

    const gridPointPositionsCache = new Map<number, Point>();

    // compute bubbles position and radius
    ({ grid, maxDistance, maxDistanceX, maxDistanceY } = generateGrid(
      gridEdges,
      gridLength,
      startAngle,
      endAngle,
      this.innerRadius,
      this.outerRadius,
      gridPointPositionsCache
    ));

    bubbles.forEach((bubble) => {
      const maxDistancePoint = getGridPointPosition(
        maxDistanceX,
        maxDistanceY,
        startAngle,
        endAngle,
        gridLength,
        this.innerRadius,
        this.outerRadius
      );

      const { bubbleX, bubbleY, bubbleR } = getBubblePositionAndRadius(
        maxDistance,
        maxDistancePoint,
        bubble.weight,
        this.donutArea,
        this.allBubbleWeightSum
      );

      bubblesWithCoordsAndRadius.push({
        ...bubble,
        x: bubbleX,
        y: bubbleY,
        r: bubbleR,
      });

      ({ grid, maxDistance, maxDistanceX, maxDistanceY } = generateGrid(
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

    const section: Section = {
      id: sectionKey,
      ratio,
      bubbles: bubblesWithCoordsAndRadius,
      startAngle,
      endAngle,
      gridLength,
      edges: gridEdges,
    };

    this.sections.set(sectionKey, section);

    return section;
  }
}

export { BubbleDonut };
