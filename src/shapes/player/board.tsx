import { type TLBaseShape } from "@tldraw/tlschema";
import { HTMLContainer, type TLImageShape } from "tldraw";
import src from "./board.webp";
import { colors } from "./colors";
import { GameShapeUtil } from "../game";

const aspect = 2579 / 1033;
export const w = 400;
export const h = w / aspect;

type BoardShape = TLBaseShape<"board", { w: number; h: number; slot: number }>;
export class BoardShapeUtil extends GameShapeUtil<BoardShape> {
  static override type = "board" as const;

  getDefaultProps() {
    return { w, h, slot: 0 };
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
    return this.editor
      .getShapeUtil("image")
      .indicator(shape as unknown as TLImageShape);
  }
}
