import { shuffle } from "d3-array";
import { type TLBaseShape } from "@tldraw/tlschema";
import { BaseBoxShapeUtil, HTMLContainer, Vec, type TLImageShape } from "tldraw";
import { colors as _colors } from "../player/colors";
import type { CardHolderShape } from "./card-holder";

const colors = Object.fromEntries(
  [..._colors.entries()].map(([i, color]) => [color, i]),
);

const aspect = 585 / 816;
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
    backIndex?: number;
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
  canSnap() {
    return false;
  }

  getHolder(shape: CardShape) {
    const binding = this.editor.getBindingsFromShape(shape, "card-holder")[0];
    return binding ? this.editor.getShape<CardHolderShape>(binding.toId) : null;
  }

  component(shape: CardShape) {
    const holder = this.getHolder(shape);
    const faceUp = holder
      ? holder.props.slot === colors[this.editor.user.getColor()]
      : shape.props.faceUp;

    const { w, h, cols, rows, index, backIndex, frontUrl, backUrl } =
      shape.props;

    const sprite = (index: number, url: string) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const bgX = col * (100 / (cols - 1));
      const bgY = row * (100 / (rows - 1));

      return {
        backgroundImage: `url(${url})`,
        backgroundSize: `${cols * w}px ${rows * h}px`,
        backgroundPosition: `${bgX}% ${bgY}%`,
        width: w,
        height: h,
        borderRadius: 5,
      };
    };

    const single = (url: string) => ({
      backgroundImage: `url(${url})`,
      backgroundSize: `${w}px ${h}px`,
      width: w,
      height: h,
      borderRadius: 5,
    });

    return (
      <HTMLContainer
        id={shape.id}
        style={
          faceUp
            ? sprite(index, frontUrl)
            : backIndex !== undefined
              ? sprite(backIndex, backUrl)
              : single(backUrl)
        }
      />
    );
  }

  indicator(shape: CardShape) {
    return this.editor.getShapeUtil("image").indicator(shape as unknown as TLImageShape);
  }

  onTranslateStart(shape: CardShape) {
    if (this.editor.getSelectedShapeIds().length === 1)
      this.editor.bringToFront([shape]);
    this.editor.deleteBindings(
      this.editor.getBindingsFromShape(shape, "card-holder"),
    );
  }

  onTranslateEnd(_initial: CardShape, shape: CardShape) {
    const pageBounds = this.editor.getShapePageBounds(shape);
    const center = pageBounds
      ? { x: pageBounds.midX, y: pageBounds.midY }
      : { x: shape.x, y: shape.y };
    const below = this.editor
      .getShapesAtPoint(center, { hitInside: true })
      .find((s) => s !== shape && s.type === shape.type) as CardShape;
    if (!below) return;
    const belowBounds = this.editor.getShapePageBounds(below);
    if (!belowBounds) return;
    const belowCenter = { x: belowBounds.midX, y: belowBounds.midY };
    if (Vec.Dist(center, belowCenter) <= 40)
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
