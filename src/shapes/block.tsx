import {
  BaseBoxShapeUtil,
  createShapeId,
  HTMLContainer,
  type TLBaseShape,
} from "tldraw";
import circle from "./block-circle.webp";
import large from "./block-large.webp";
import small from "./block-small.webp";

export const blocks = {
  large: { props: { w: 145, h: 50, kind: "large" as const }, url: large },
  small: { props: { w: 70, h: 42, kind: "small" as const }, url: small },
  circle: { props: { w: 47, h: 47, kind: "circle" as const }, url: circle },
};
type BlockKind = keyof typeof blocks;
type BlockShape = TLBaseShape<
  "block",
  { w: number; h: number; kind: BlockKind }
>;
export class BlockShapeUtil extends BaseBoxShapeUtil<BlockShape> {
  static override type = "block" as const;

  getDefaultProps() {
    return blocks.circle.props;
  }

  canResize() {
    return false;
  }
  canSnap() {
    return false;
  }

  component(shape: BlockShape) {
    const { url } = blocks[shape.props.kind];
    return (
      <HTMLContainer
        id={shape.id}
        style={{
          backgroundImage: `url(${url})`,
          backgroundSize: "auto 100%",
          clipPath: shape.props.kind === "circle" ? "circle(50%)" : "none",
        }}
      />
    );
  }

  indicator(shape: BlockShape) {
    return shape.props.kind === "circle" ? (
      <circle
        r={shape.props.w / 2}
        cx={shape.props.w / 2}
        cy={shape.props.h / 2}
      />
    ) : (
      this.editor.getShapeUtil("image").indicator(shape)
    );
  }

  onTranslate(_initial: BlockShape, current: BlockShape) {
    if (current.props.kind === "circle") return;
    const map = this.editor.getShapePageBounds(createShapeId("map"))!;
    const b = this.editor.getShapePageBounds(current)!;
    return {
      id: current.id,
      type: current.type,
      rotation: map.center.angle(b.center) + Math.PI / 2,
    };
  }
}
