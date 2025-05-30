import { AssetRecordType, createShapeId } from "tldraw";
import src from "./assets/map.jpg";

const w = 1200;
const h = 640;

const assetId = AssetRecordType.createId("map");
export const asset = {
  id: assetId,
  type: "image",
  typeName: "asset",
  props: {
    name: "map.jpg",
    src,
    w,
    h,
    mimeType: "image/jpeg",
    isAnimated: false,
  },
  meta: {},
} as const;

const shapeId = createShapeId("map");
export const shape = {
  id: shapeId,
  type: "image",
  x: -w / 2,
  y: -h / 2,
  props: {
    assetId,
    w,
    h,
  },
  isLocked: true,
};
