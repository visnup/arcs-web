import { BaseBoxShapeUtil, HTMLContainer, type TLBaseShape } from "tldraw";
import src from "./board.png";

const colors = ["#FFB700", "#0095A9", "#E1533D", "#D7D2CB", "#912AAD"];
const aspect = 2579 / 1033;
export const w = 400;
export const h = w / aspect;

type BoardShape = TLBaseShape<"board", { w: number; h: number; slot: number }>;
export class BoardShapeUtil extends BaseBoxShapeUtil<BoardShape> {
  static override type = "board" as const;

  getDefaultProps() {
    return { w, h, slot: 0 };
  }

  component(shape: BoardShape) {
    const backgroundColor = colors[shape.props.slot];
    return (
      <HTMLContainer id={shape.id} style={{ backgroundColor }}>
        <img className="tl-image" draggable="false" src={src} />
      </HTMLContainer>
    );
  }

  indicator(shape: BoardShape) {
    return this.editor.getShapeUtil("image").indicator(shape);
  }
}
