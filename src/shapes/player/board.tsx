import { BaseBoxShapeUtil, HTMLContainer, type TLBaseShape } from "tldraw";
import src from "./board.png";
import { colors } from "./colors";

const aspect = 2579 / 1033;
export const w = 400;
export const h = w / aspect;

type BoardShape = TLBaseShape<"board", { w: number; h: number; slot: number }>;
export class BoardShapeUtil extends BaseBoxShapeUtil<BoardShape> {
  static override type = "board" as const;

  getDefaultProps() {
    return { w, h, slot: 0 };
  }

  canSnap() {
    return false;
  }

  component(shape: BoardShape) {
    const backgroundColor = colors[shape.props.slot];
    return (
      <HTMLContainer
        id={shape.id}
        style={{ backgroundColor, overflow: "hidden", borderRadius: 5 }}
      >
        <img className="tl-image" draggable="false" src={src} />
      </HTMLContainer>
    );
  }

  indicator(shape: BoardShape) {
    return this.editor.getShapeUtil("image").indicator(shape);
  }
}
