import { MapShapeUtil } from "./map";
import { AgentShapeUtil } from "./player/agent";
import { BoardShapeUtil } from "./player/board";
import { CityShapeUtil, StarportShapeUtil } from "./player/building";
import { ShipShapeUtil } from "./player/ship";
import { PowerMarkerShapeUtil } from "./player/power";
import { ResourceShapeUtil } from "./resource";
import { ChapterMarkerShapeUtil } from "./chapter";

export const customShapeUtils = [
  AgentShapeUtil,
  BoardShapeUtil,
  ChapterMarkerShapeUtil,
  CityShapeUtil,
  MapShapeUtil,
  PowerMarkerShapeUtil,
  ResourceShapeUtil,
  ShipShapeUtil,
  StarportShapeUtil,
];
