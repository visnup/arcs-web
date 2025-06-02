import { type TLBaseShape } from "tldraw";
import city from "./city.jpg";
import cityDamaged from "./city-dmg.jpg";
import starport from "./starport.jpg";
import starportDamaged from "./starport-dmg.jpg";
import mask from "./building-mask.png";
import { StackableShapeUtil } from "../stack";

const aspect = 150 / 136;
export const w = 40;
export const h = w / aspect;

type BuildingShape = TLBaseShape<
  "city" | "starport",
  { w: number; h: number; slot: number; faceUp: boolean }
>;
class BuildingShapeUtil extends StackableShapeUtil<BuildingShape> {
  getDefaultProps() {
    return { w, h, slot: 0, faceUp: true };
  }

  canResize() {
    return false;
  }

  component(shape: BuildingShape) {
    const url =
      shape.type === "city"
        ? shape.props.faceUp
          ? city
          : cityDamaged
        : shape.props.faceUp
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
    const { w, h } = shape.props;
    return (
      <path
        d={`
          M ${w / 2 + 3.5} 2
          L ${w - 1} ${h - 7}
          Q ${w} ${h - 2} ${w - 4} ${h - 0.5}
          L 4 ${h - 0.5}
          Q 0 ${h - 2} 1 ${h - 7}
          L ${w / 2 - 3.5} 2
          Q ${w / 2} -1 ${w / 2 + 3.5} 2
        `}
      />
    );
  }
}

export class CityShapeUtil extends BuildingShapeUtil {
  static override type = "city" as const;
}
export class StarportShapeUtil extends BuildingShapeUtil {
  static override type = "starport" as const;
}
