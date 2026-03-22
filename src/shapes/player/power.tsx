import { type TLBaseShape } from "@tldraw/tlschema";
import { SVGContainer } from "tldraw";
import { colors } from "./colors";
import { GameShapeUtil } from "../game";

export const w = 12;

type PowerMarkerShape = TLBaseShape<
  "power",
  { w: number; h: number; slot: number }
>;
export class PowerMarkerShapeUtil extends GameShapeUtil<PowerMarkerShape> {
  static override type = "power" as const;

  getDefaultProps() {
    return { w, h: w, slot: 0 };
  }

  component(shape: PowerMarkerShape) {
    const color = colors[shape.props.slot];
    return (
      <SVGContainer id={shape.id}>
        <rect fill={color} width={shape.props.w} height={shape.props.h} />
      </SVGContainer>
    );
  }

  indicator(shape: PowerMarkerShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }
}
