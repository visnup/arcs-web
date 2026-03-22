import { type TLBaseBoxShape, BaseBoxShapeUtil } from "tldraw";

export abstract class GameShapeUtil<
  T extends TLBaseBoxShape,
> extends BaseBoxShapeUtil<T> {
  canSnap() {
    return false;
  }
  canResize() {
    return false;
  }
}
