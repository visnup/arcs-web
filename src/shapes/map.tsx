import { BaseBoxShapeUtil, HTMLContainer, type TLBaseShape } from "tldraw";
import src from "./map.webp";

const aspect = 6963 / 3720;
const w = 1200;
const h = w / aspect;

type MapShape = TLBaseShape<"map", { w: number; h: number }>;
export class MapShapeUtil extends BaseBoxShapeUtil<MapShape> {
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

  indicator(shape: MapShape) {
    return this.editor.getShapeUtil("image").indicator(shape);
  }

  getBoundsSnapGeometry() {
    return {
      points: [
        // { x: 75, y: 550, z: 0 }, // ambition declared
        { x: 78, y: 463, z: 0 }, // card 1 (lead)
        { x: 78, y: 344, z: 0 }, // card 2
        { x: 78, y: 262, z: 0 }, // card 3
        { x: 78, y: 179, z: 0 }, // card 4
      ],
    };
  }
}
