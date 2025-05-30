import { BaseBoxShapeUtil, type TLBaseShape } from "tldraw";
import url from "./resources.jpg";

const aspect = 1;
export const w = 44;
export const h = w / aspect;

export const resources = [
  "fuel",
  "material",
  "weapon",
  "relic",
  "psionic",
] as const;
type ResourceKind = (typeof resources)[number];
type ResourceShape = TLBaseShape<
  "resource",
  { w: number; h: number; kind: ResourceKind }
>;
export class ResourceShapeUtil extends BaseBoxShapeUtil<ResourceShape> {
  static override type = "resource" as const;

  getDefaultProps() {
    return { w, h, kind: "fuel" as const };
  }

  canResize() {
    return false;
  }

  component(shape: ResourceShape) {
    const offset = resources.indexOf(shape.props.kind) * 25;
    return (
      <div
        id={shape.id}
        style={{
          width: "100%",
          height: "100%",
          backgroundImage: `url(${url})`,
          backgroundSize: "auto 100%",
          backgroundPosition: `${offset}% 0`,
          clipPath: "circle(50%)",
        }}
      />
    );
  }

  indicator(shape: ResourceShape) {
    return (
      <circle
        r={shape.props.w / 2}
        cx={shape.props.w / 2}
        cy={shape.props.h / 2}
      />
    );
  }
}
