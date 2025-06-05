import { shuffle } from "d3-array";
import { BaseBoxShapeUtil, HTMLContainer, Vec, type TLBaseShape } from "tldraw";

const aspect = 719 / 1005;
export const w = 95;
export const h = w / aspect;

export type CardShape = TLBaseShape<
  "card",
  {
    w: number;
    h: number;
    cols: number;
    rows: number;
    faceUp: boolean;
    index: number;
    frontUrl: string;
    backUrl: string;
  }
>;
export class CardShapeUtil extends BaseBoxShapeUtil<CardShape> {
  static override type = "card";

  getDefaultProps() {
    return {
      w,
      h,
      cols: 7,
      rows: 5,
      faceUp: false,
      index: 0,
      frontUrl: "about:blank",
      backUrl: "about:blank",
    };
  }

  canResize() {
    return false;
  }

  component(shape: CardShape) {
    if (shape.props.faceUp) {
      const { cols, rows, index, frontUrl } = shape.props;

      const col = index % cols;
      const row = Math.floor(index / cols);
      const bgX = col * (100 / (cols - 1));
      const bgY = row * (100 / (rows - 1));

      return (
        <HTMLContainer
          id={shape.id}
          style={{
            backgroundImage: `url(${frontUrl})`,
            backgroundSize: `${cols * w}px ${rows * h}px`,
            backgroundPosition: `${bgX}% ${bgY}%`,
            width: w,
            height: h,
            borderRadius: 5,
          }}
        />
      );
    } else {
      const { backUrl } = shape.props;
      return (
        <HTMLContainer
          id={shape.id}
          style={{
            backgroundImage: `url(${backUrl})`,
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

  onTranslateStart(shape: CardShape) {
    this.editor.bringToFront([shape]);
    this.editor.deleteBindings(
      this.editor.getBindingsFromShape(shape, "card-holder"),
    );
  }

  onTranslateEnd(_initial: CardShape, shape: CardShape) {
    const { center } = this.editor.getShapePageGeometry(shape);
    const below = this.editor
      .getShapesAtPoint(center, { hitInside: true })
      .find((s) => s !== shape && s.type === shape.type) as CardShape;
    if (!below) return;
    const { center: p } = this.editor.getShapePageGeometry(below);
    if (Vec.Dist(center, p) <= 40)
      this.editor.updateShape({
        id: shape.id,
        type: shape.type,
        x: below.x,
        y: below.y,
        rotation: below.rotation,
        props: { faceUp: below.props.faceUp },
      });
  }

  // Shuffle
  onPrimaryAction(shapes: CardShape[]) {
    const order = shuffle(shapes);
    this.editor.run(() => {
      for (const id of order) this.editor.bringToFront([id]);
    });
  }
}
