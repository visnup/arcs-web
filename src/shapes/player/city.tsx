import { BaseBoxShapeUtil, HTMLContainer, type TLBaseShape } from "tldraw";
import url from "./city.jpg";
import mask from "./building-mask.png";

const aspect = 298 / 266;
export const w = 40;
export const h = w / aspect;

type CityShape = TLBaseShape<"city", { w: number; h: number; slot: number }>;
export class CityShapeUtil extends BaseBoxShapeUtil<CityShape> {
  static override type = "city" as const;

  getDefaultProps() {
    return { w, h, slot: 0 };
  }

  canResize() {
    return false;
  }

  component(shape: CityShape) {
    const offset = (shape.props.slot / 4) * 100;
    return (
      <HTMLContainer id={shape.id} style={{ overflow: "hidden" }}>
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundImage: `url(${url})`,
            backgroundSize: "auto 100%",
            backgroundPosition: `${offset}% 0`,
            maskImage: `url(${mask})`,
            maskSize: "contain",
            maskRepeat: "no-repeat",
          }}
        />
      </HTMLContainer>
    );
  }

  indicator(shape: CityShape) {
    return this.editor.getShapeUtil("image").indicator(shape);
  }
}
