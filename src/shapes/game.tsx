import { type TLBaseBoxShape, BaseBoxShapeUtil, toDomPrecision } from "tldraw";

export abstract class GameShapeUtil<
  T extends TLBaseBoxShape,
> extends BaseBoxShapeUtil<T> {
  canSnap() {
    return false;
  }
  canResize() {
    return false;
  }
  indicator({ props: { w, h } }: T): React.ReactElement | null {
    return <rect width={toDomPrecision(w)} height={toDomPrecision(h)} />;
  }
}
