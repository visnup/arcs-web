import { BaseBoxShapeUtil, type TLBaseShape } from "tldraw";
import city from "./city.jpg";
import cityDamaged from "./city-dmg.jpg";
import starport from "./starport.jpg";
import starportDamaged from "./starport-dmg.jpg";
import mask from "./building-mask.png";

const aspect = 298 / 266;
export const w = 40;
export const h = w / aspect;

type BuildingShape = TLBaseShape<
  "city" | "starport",
  { w: number; h: number; slot: number; fresh: boolean }
>;
class BuildingShapeUtil extends BaseBoxShapeUtil<BuildingShape> {
  getDefaultProps() {
    return { w, h, slot: 0, fresh: true };
  }

  canResize() {
    return false;
  }

  component(shape: BuildingShape) {
    const url =
      shape.type === "city"
        ? shape.props.fresh
          ? city
          : cityDamaged
        : shape.props.fresh
          ? starport
          : starportDamaged;
    const offset = shape.props.slot * 25;
    return (
      <div
        id={shape.id}
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
