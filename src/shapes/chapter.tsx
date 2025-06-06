import { BaseBoxShapeUtil, SVGContainer, type TLBaseShape } from "tldraw";

export const w = 28;

type ChapterMarkerShape = TLBaseShape<"power", { w: number; h: number }>;
export class ChapterMarkerShapeUtil extends BaseBoxShapeUtil<ChapterMarkerShape> {
  static override type = "chapter" as const;

  getDefaultProps() {
    return { w, h: w };
  }

  canResize() {
    return false;
  }
  canSnap() {
    return false;
  }

  component(shape: ChapterMarkerShape) {
    const r = shape.props.w / 2;
    return (
      <SVGContainer id={shape.id} xmlns="http://www.w3.org/2000/svg">
        <circle r={r} cx={r} cy={r} fill="#a5a7aa" />
      </SVGContainer>
    );
  }

  indicator(shape: ChapterMarkerShape) {
    const r = shape.props.w / 2;
    return <circle r={r} cx={r} cy={r} />;
  }
}
