import { BaseBoxShapeUtil, HTMLContainer, type TLBaseShape } from "tldraw";
import src from "./map.jpg";

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
}
