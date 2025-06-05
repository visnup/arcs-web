import { BaseBoxShapeUtil, SVGContainer, type TLBaseShape } from "tldraw";
import { colors } from "./colors";

export const w = 12;

type PowerMarkerShape = TLBaseShape<
  "power",
  { w: number; h: number; slot: number }
>;
export class PowerMarkerShapeUtil extends BaseBoxShapeUtil<PowerMarkerShape> {
  static override type = "power" as const;

  getDefaultProps() {
    return { w, h: w, slot: 0 };
  }

  canResize() {
    return false;
  }

  component(shape: PowerMarkerShape) {
    const color = colors[shape.props.slot];
    return (
      <SVGContainer id={shape.id} xmlns="http://www.w3.org/2000/svg">
        <rect fill={color} width={shape.props.w} height={shape.props.h} />
      </SVGContainer>
    );
  }

  indicator(shape: PowerMarkerShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }
}
