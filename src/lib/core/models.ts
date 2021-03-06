export interface Point {
  x: number;
  y: number;
}

export interface RawData {
  id: string;
  weight: number;
  group: string;
}

export interface DonutSection {
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

export type MaxDistancePoint = Point & { maxDistance: number };
export type Coord = Point & { r: number };
export type BubbleWithCoordsAndRadius = RawData & Coord;
export type Grid = Array<number>;
