import {
  BaseBoxShapeUtil,
  BindingUtil,
  HTMLContainer,
  type BindingOnCreateOptions,
  type BindingOnDeleteOptions,
  type TLBaseBinding,
  type TLBaseShape,
  type TLShape,
} from "tldraw";
import { type CardShape } from "./card";

type CardHolderShape = TLBaseShape<
  "card-holder",
  { w: number; h: number; slot: number }
>;
export class CardHolderShapeUtil extends BaseBoxShapeUtil<CardHolderShape> {
  static override type = "card-holder";

  getDefaultProps() {
    return { w: 0, h: 0, slot: 0 };
  }

  canDropShapes(_shape: CardHolderShape, shapes: TLShape[]) {
    return shapes.every((s) => s.type === "card");
  }

  component(shape: CardHolderShape) {
    return (
      <HTMLContainer
        id={shape.id}
        style={{ backgroundColor: "#111" }}
      ></HTMLContainer>
    );
  }

  indicator(shape: CardHolderShape) {
    return this.editor.getShapeUtil("image").indicator(shape);
  }

  onDropShapesOver(shape: CardHolderShape, shapes: TLShape[]) {
    this.editor.deleteBindings(
      shapes.flatMap((s) => this.editor.getBindingsFromShape(s, "card-holder")),
    );
    this.editor.createBindings(
      shapes.map((s) => ({
        type: "card-holder",
        fromId: s.id,
        toId: shape.id,
      })),
    );
  }

  onDragShapesOut(_shape: CardHolderShape, shapes: TLShape[]): void {
    this.editor.deleteBindings(
      shapes.flatMap((s) => this.editor.getBindingsFromShape(s, "card-holder")),
    );
  }
}

type CardHolderBinding = TLBaseBinding<"card-holder", object>;
export class CardHolderBindingUtil extends BindingUtil<CardHolderBinding> {
  static override type = "card-holder" as const;

  getDefaultProps() {
    return {};
  }

  onAfterCreate({ binding }: BindingOnCreateOptions<CardHolderBinding>) {
    this.editor.updateShape({
      id: binding.fromId,
      type: "card",
      rotation: 0,
    });
    this.layout(binding);
  }

  onAfterDelete({ binding }: BindingOnDeleteOptions<CardHolderBinding>) {
    this.layout(binding);
  }

  layout(binding: CardHolderBinding) {
    const cards = this.editor
      .getBindingsToShape(binding.toId, "card-holder")
      .map((b) => b.fromId)
      .sort(
        (a, b) =>
          this.editor.getShape<CardShape>(a)!.props.index -
          this.editor.getShape<CardShape>(b)!.props.index,
      );
    if (!cards.length) return;
    const holder = this.editor.getShapePageBounds(binding.toId)!;
    const bounds = cards.map((c) => this.editor.getShapePageBounds(c)!);
    const w = bounds.reduce((sum, b) => sum + b.w, 0);
    const n = cards.length - 1;
    const overlap = w > holder.w ? (w - holder.w) / n : 10;
    this.editor.run(() => {
      let x = (holder.w - w + overlap * n) / 2 - bounds[0].w + overlap;
      this.editor.updateShapes(
        cards.map((c, i) => ({
          id: c,
          type: "card",
          x: (x += bounds[i].w - overlap),
          y: holder.y + (holder.h - bounds[i].h) / 2,
        })),
      );
      for (const c of cards) this.editor.bringToFront([c]);
    });
  }
}
