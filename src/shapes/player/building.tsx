import { BaseBoxShapeUtil, HTMLContainer, type TLBaseShape } from "tldraw";
import city from "./city.jpg";
import starport from "./starport.jpg";
import mask from "./building-mask.png";

const aspect = 298 / 266;
export const w = 40;
export const h = w / aspect;

type BuildingShape = TLBaseShape<
  "city" | "starport",
  { w: number; h: number; slot: number }
>;
class BuildingShapeUtil extends BaseBoxShapeUtil<BuildingShape> {
  getDefaultProps() {
    return { w, h, slot: 0 };
  }

  canResize() {
    return false;
  }

  component(shape: BuildingShape) {
    const url = shape.type === "city" ? city : starport;
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

  indicator(shape: BuildingShape) {
    return this.editor.getShapeUtil("image").indicator(shape);
  }
}

export class CityShapeUtil extends BuildingShapeUtil {
  static override type = "city" as const;
}
export class StarportShapeUtil extends BuildingShapeUtil {
  static override type = "starport" as const;
}
