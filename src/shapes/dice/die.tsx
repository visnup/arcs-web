import { BaseBoxShapeUtil, HTMLContainer, type TLBaseShape } from "tldraw";
import assault from "./assault.webp";
import raid from "./raid.webp";
import skirmish from "./skirmish.webp";

export const w = 28;
export const h = w;

type DieKind = "assault" | "raid" | "skirmish";
type DieShape = TLBaseShape<
  "die",
  {
    w: number;
    h: number;
    face: number;
    kind: DieKind;
  }
>;
const urls: Record<DieKind, string> = { assault, raid, skirmish };
export class DieShapeUtil extends BaseBoxShapeUtil<DieShape> {
  static override type = "die";

  getDefaultProps() {
    return {
      w,
      h,
      face: 0,
      kind: "assault" as const,
    };
  }

  canResize() {
    return false;
  }
  canSnap() {
    return false;
  }

  component(shape: DieShape) {
    const { face: index, kind } = shape.props;
    const url = urls[kind];

    const cols = 6;
    const bgX = index * (100 / (cols - 1));

    return (
      <HTMLContainer
        id={shape.id}
        style={{
          backgroundImage: `url(${url})`,
          backgroundSize: `${cols * shape.props.w}px ${shape.props.h}px`,
          backgroundPosition: `${bgX}% 0%`,
          borderRadius: 5,
        }}
      />
    );
  }

  indicator(shape: DieShape) {
    return this.editor.getShapeUtil("image").indicator(shape);
  }

  onPrimaryAction(shapes: DieShape[]) {
    this.editor.run(() => {
      this.editor.updateShapes(
        shapes.map((s) => ({
          id: s.id,
          type: s.type,
          props: { face: Math.floor(Math.random() * 6) },
        })),
      );
      for (const { id } of shapes)
        this.editor.rotateShapesBy(
          [id],
          (Math.random() * Math.PI) / 6 - Math.PI / 12,
        );
    });
  }
}
