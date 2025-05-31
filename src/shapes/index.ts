import { MapShapeUtil } from "./map";
import { AgentShapeUtil } from "./player/agent";
import { BoardShapeUtil } from "./player/board";
import { CityShapeUtil, StarportShapeUtil } from "./player/building";
import { ShipShapeUtil } from "./player/ship";
import { ResourceShapeUtil } from "./resource";

export const customShapeUtils = [
  AgentShapeUtil,
  BoardShapeUtil,
  CityShapeUtil,
  MapShapeUtil,
  ResourceShapeUtil,
  ShipShapeUtil,
  StarportShapeUtil,
];
