import { MapShapeUtil } from "./map";
import { AgentShapeUtil } from "./player/agent";
import { BoardShapeUtil } from "./player/board";
import { CityShapeUtil, StarportShapeUtil } from "./player/building";
import { ShipShapeUtil } from "./player/ship";
import { PowerMarkerShapeUtil } from "./player/power";
import { ResourceShapeUtil } from "./resource";
import { ChapterMarkerShapeUtil } from "./chapter";
import { InitiativeMarkerShapeUtil } from "./initiative";
import { StackBindingUtil, StackShapeUtil } from "./stack";
import { CardShapeUtil } from "./cards/card";
import { AmbitionDeclaredMarkerShapeUtil } from "./ambition-declared";
import { AmbitionMarkerShapeUtil } from "./ambition";

export const customShapeUtils = [
  AgentShapeUtil,
  AmbitionDeclaredMarkerShapeUtil,
  AmbitionMarkerShapeUtil,
  BoardShapeUtil,
  CardShapeUtil,
  ChapterMarkerShapeUtil,
  CityShapeUtil,
  InitiativeMarkerShapeUtil,
  MapShapeUtil,
  PowerMarkerShapeUtil,
  ResourceShapeUtil,
  ShipShapeUtil,
  StackShapeUtil,
  StarportShapeUtil,
];

export const customBindingUtils = [StackBindingUtil];
