import { type TLBaseShape } from "@tldraw/tlschema";
import { HTMLContainer } from "tldraw";
import { GameShapeUtil } from "./game";
import url from "./resources.webp";

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
export class ResourceShapeUtil extends GameShapeUtil<ResourceShape> {
  static override type = "resource" as const;

  getDefaultProps() {
    return { w, h, kind: "fuel" as const };
  }

  component(shape: ResourceShape) {
    const offset = resources.indexOf(shape.props.kind) * 25;
    return (
      <HTMLContainer
        id={shape.id}
        style={{
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
