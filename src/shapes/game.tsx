import { type TLBaseBoxShape, BaseBoxShapeUtil, toDomPrecision, Vec } from "tldraw";
import { snapTarget, type Snap, type SnapTarget } from "./snap";

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

  getSnaps(_shape: T): Snap[] {
    return [];
  }

  findSnap(shape: T): SnapTarget | null {
    const bounds = this.editor.getShapePageBounds(shape);
    if (!bounds) return null;
    const center = { x: bounds.midX, y: bounds.midY };
    let best: SnapTarget | null = null,
      bestDist = Infinity;
    for (const s of this.editor.getCurrentPageShapes()) {
      for (const sp of (
        this.editor.getShapeUtil(s.type) as GameShapeUtil<TLBaseBoxShape>
      ).getSnaps(s as TLBaseBoxShape)) {
        if (!sp.accepts(shape)) continue;
        const sx = s.x + sp.x,
          sy = s.y + sp.y;
        const snapCenter = { x: sx, y: sy };
        const dist = Vec.Dist(center, snapCenter);
        const inRange = sp.within
          ? sp.within(shape, bounds, snapCenter)
          : dist <= 50;
        if (inRange && dist < bestDist) {
          bestDist = dist;
          const { w, h } = shape.props as { w: number; h: number };
          best = {
            shapeId: shape.id,
            x: sx - w / 2,
            y: sy - h / 2,
            rotation: sp.rotation ?? 0,
          };
        }
      }
    }
    return best;
  }

  onTranslate(_initial: T, current: T) {
    snapTarget.set(this.findSnap(current));
  }

  onTranslateEnd(_initial: T, current: T) {
    const t = snapTarget.get();
    snapTarget.set(null);
    if (t?.shapeId === current.id)
      this.editor.updateShape({
        id: current.id,
        type: current.type,
        x: t.x,
        y: t.y,
        rotation: t.rotation,
      });
  }
}
