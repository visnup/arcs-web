import { BaseBoxShapeUtil, type TLBaseShape } from "tldraw";
import front from "./bc.jpg";
import back from "./bc-back.jpg";

const aspect = 515 / 816;
export const w = 100;
export const h = w / aspect;

type CardShape = TLBaseShape<
  "card",
  {
    w: number;
    h: number;
    cols: number;
    rows: number;
    faceUp: boolean;
    index: number;
  }
>;
export class CardShapeUtil extends BaseBoxShapeUtil<CardShape> {
  static override type = "card";

  getDefaultProps() {
    return { w, h, cols: 7, rows: 5, faceUp: true, index: 0 };
  }

  canResize() {
    return false;
  }

  component(shape: CardShape) {
    if (shape.props.faceUp) {
      const { cols, rows, index } = shape.props;

      const col = index % cols;
      const row = Math.floor(index / cols);
      const bgX = col * (100 / (cols - 1));
      const bgY = row * (100 / (rows - 1));

      return (
        <div
          id={shape.id}
          style={{
            backgroundImage: `url(${front})`,
            backgroundSize: `${cols * w}px ${rows * h}px`,
            backgroundPosition: `${bgX}% ${bgY}%`,
            width: w,
            height: h,
            borderRadius: 5,
          }}
        />
      );
    } else {
      return (
        <div
          id={shape.id}
          style={{
            backgroundImage: `url(${back})`,
            backgroundSize: `${w}px ${h}px`,
            width: w,
            height: h,
            borderRadius: 5,
          }}
        />
      );
    }
  }

  indicator(shape: CardShape) {
    return this.editor.getShapeUtil("image").indicator(shape);
  }
}
