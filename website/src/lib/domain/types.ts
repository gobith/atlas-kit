import type { Border } from "./domain";

export type TerrainModifier = {
  modifier: number;
};

export type TerrainData = {
  name: string;
  potential: number;
  modifiers: TerrainModifier[];
  color: string;
};

export type RegentData = {
  id: UUID;
  name: string;
};

export type Domain = {
  id: UUID;
  name: string;
  gold: number;
  owner: UUID;
  abbr: string;
};

export type ProvinceData = {
  id: UUID;
  name: string;
  level: number;
  loyalty: string;
  sourceRating: number;
  terrain: TerrainData;
  owner: UUID;
};

export type Holding = {
  id: UUID;
  province: UUID;
  level: string;
  type: string;
  owner: UUID;
};

export type UUID = string;

export type WorldData = {
  regents: RegentData[];
  domains: Domain[];
  provinces: ProvinceData[];
  holdings: Holding[];
};

export type BorderData = {
  id: number;
  a: number;
  b: number;
  d: PathData;
};

export type AreaData = {
  p: UUID;
  borders: number[];
};

export type SpecificArea = {
  id: number;
  d: PathData;
  borders: number[];
  bounds: Bounds;
  center: Point;
  polygon: any;
};

export type Bounds = {
  origin: Point;
  corner: Point;
};

export type Point = {
  x: number;
  y: number;
};

export type PathData = string;

export type MapData = {
  borders: BorderData[];
  areas: AreaData[];
  woodAreas: SpecificArea[];
  mountainAreas: SpecificArea[];
};

export type BorderDirection = {
  border: Border;
  direction: string;
};
