import { atom } from "tldraw";
import type { Box, TLShape, VecLike } from "tldraw";

export type Snap = {
  x: number; // shape-local center x of snap target
  y: number; // shape-local center y of snap target
  rotation?: number; // rotation applied to snapping shape (default 0)
  accepts: (shape: TLShape) => boolean;
  within?: (shape: TLShape, bounds: Box, snapCenter: VecLike) => boolean;
  // default: Vec.Dist(bounds.center, snapCenter) <= 50
};

// Current snap being targeted during a drag
export type SnapTarget = {
  shapeId: string;
  x: number; // page-space top-left of where shape will snap
  y: number;
  rotation: number;
};

export const snapTarget = atom<SnapTarget | null>("snap-target", null);
