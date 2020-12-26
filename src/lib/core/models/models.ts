export interface Point {
  x: number;
  y: number;
}

export interface Bubble {
  id: string;
  label: string;
  weight: number;
  group: string;
}

export interface Section {
  id: string;
  ratio: number;
  bubbles: BubbleWithCoordsAndRadius[];
  startAngle: number;
  endAngle: number;
  gridLength: number;
  edges: GridEdges;
}

export interface GridEdges {
  top: Point[];
  right: Point[];
  bottom: Point[];
  left: Point[];
}

export type Coord = Point & { r: number };
export type BubbleWithCoordsAndRadius = Bubble & Coord;
export type Grid = Array<number>;
