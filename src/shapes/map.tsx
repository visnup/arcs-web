import { type TLBaseShape } from "@tldraw/tlschema";
import { HTMLContainer } from "tldraw";
import { GameShapeUtil } from "./game";
import { type Snap } from "./snap";
import src from "./map.webp";

const aspect = 6963 / 3720;
const w = 1200;
const h = w / aspect;

type MapShape = TLBaseShape<"map", { w: number; h: number }>;
export class MapShapeUtil extends GameShapeUtil<MapShape> {
  static override type = "map" as const;

  getDefaultProps() {
    return { w, h };
  }

  component(shape: MapShape) {
    return (
      <HTMLContainer id={shape.id}>
        <img className="tl-image" draggable="false" src={src} />
      </HTMLContainer>
    );
  }

  getSnaps(_shape: MapShape): Snap[] {
    return [
      // center of ambition-declared at initial position:
      // shape at x:27 y:538 size 95×24 → center {75, 550}
      { x: 75, y: 550, rotation: 0, accepts: (s) => s.type === "ambition-declared" },
    ];
  }
}
