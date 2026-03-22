import { type TLBaseShape } from "@tldraw/tlschema";
import { SVGContainer } from "tldraw";
import { GameShapeUtil } from "./game";

export const w = 28;

type ChapterMarkerShape = TLBaseShape<"chapter", { w: number; h: number }>;
export class ChapterMarkerShapeUtil extends GameShapeUtil<ChapterMarkerShape> {
  static override type = "chapter" as const;

  getDefaultProps() {
    return { w, h: w };
  }

  component(shape: ChapterMarkerShape) {
    const r = shape.props.w / 2;
    return (
      <SVGContainer id={shape.id}>
        <circle r={r} cx={r} cy={r} fill="#a5a7aa" />
      </SVGContainer>
    );
  }

  indicator(shape: ChapterMarkerShape) {
    const r = shape.props.w / 2;
    return <circle r={r} cx={r} cy={r} />;
  }
}
