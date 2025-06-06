import { AmbitionMarkerShapeUtil } from "./ambition";
import { AmbitionDeclaredMarkerShapeUtil } from "./ambition-declared";
import { BlockShapeUtil } from "./block";
import { CardShapeUtil } from "./cards/card";
import {
  CardHolderBindingUtil,
  CardHolderShapeUtil,
} from "./cards/card-holder";
import { ChapterMarkerShapeUtil } from "./chapter";
import { DieShapeUtil } from "./dice/die";
import { InitiativeMarkerShapeUtil } from "./initiative";
import { MapShapeUtil } from "./map";
import { AgentShapeUtil } from "./player/agent";
import { BoardShapeUtil } from "./player/board";
import { CityShapeUtil, StarportShapeUtil } from "./player/building";
import { PowerMarkerShapeUtil } from "./player/power";
import { ShipShapeUtil } from "./player/ship";
import { ResourceShapeUtil } from "./resource";
import { StackBindingUtil, StackShapeUtil } from "./stack";

// 6.1cm = 95px (15.574px per cm)
export const customShapeUtils = [
  AgentShapeUtil,
  AmbitionDeclaredMarkerShapeUtil,
  AmbitionMarkerShapeUtil,
  BlockShapeUtil,
  BoardShapeUtil,
  CardShapeUtil,
  CardHolderShapeUtil,
  ChapterMarkerShapeUtil,
  CityShapeUtil,
  DieShapeUtil,
  InitiativeMarkerShapeUtil,
  MapShapeUtil,
  PowerMarkerShapeUtil,
  ResourceShapeUtil,
  ShipShapeUtil,
  StackShapeUtil,
  StarportShapeUtil,
];

export const customBindingUtils = [CardHolderBindingUtil, StackBindingUtil];
