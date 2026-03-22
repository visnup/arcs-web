import {
  createShapeId,
  type TLBaseBinding,
  type TLBaseShape,
} from "@tldraw/tlschema";
import {
  BindingUtil,
  HTMLContainer,
  type BindingOnCreateOptions,
  type BindingOnDeleteOptions,
  type TLBaseBoxShape,
} from "tldraw";
import { GameShapeUtil } from "./game";
import { snapTarget } from "./snap";

type StackShape = TLBaseShape<"stack", { w: number; h: number; count: number }>;
export class StackShapeUtil extends GameShapeUtil<StackShape> {
  static override type = "stack" as const;

  getDefaultProps() {
    return { w: 10, h: 10, count: 0 };
  }

  component(shape: StackShape) {
    return (
      <HTMLContainer id={shape.id} style={{ fontSize: 20 }}>
        {shape.props.count}
      </HTMLContainer>
    );
  }

  indicator() {
    return null;
  }
}

export abstract class StackableShapeUtil<
  T extends TLBaseBoxShape,
> extends GameShapeUtil<T> {
  onTranslateStart(shape: T) {
    const bindings = this.editor.getBindingsFromShape(shape, "stack");
    this.editor.deleteBindings(bindings);
  }

  onTranslateEnd(initial: T, shape: T) {
    const willSnap = snapTarget.get()?.shapeId === shape.id;
    super.onTranslateEnd(initial, shape);
    if (!willSnap) this.stack(shape);
  }

  stack(shape: T) {
    if (this.editor.getBindingsFromShape(shape, "stack").length) return;
    const bounds = this.editor.getShapePageBounds(shape);
    if (!bounds) return;
    const center = { x: bounds.midX, y: bounds.midY };
    const shapes = this.editor
      .getShapesAtPoint(center, { hitInside: true })
      .filter((s) => s !== shape && s.type === shape.type);
    if (shapes.length === 0) return;
    const stacks = new Set(
      shapes
        .flatMap((s) => this.editor.getBindingsFromShape(s, "stack"))
        .map((b) => b.toId),
    );
    if (stacks.size === 0) {
      const id = createShapeId();
      this.editor
        .createShape({ id, type: "stack" })
        .createBinding({ type: "stack", fromId: shape.id, toId: id })
        .createBindings(
          shapes.map((s) => ({ type: "stack", fromId: s.id, toId: id })),
        );
    } else {
      for (const stack of stacks)
        this.editor.createBinding({
          type: "stack",
          fromId: shape.id,
          toId: stack,
        });
    }
  }
}

type StackBinding = TLBaseBinding<"stack", object>;
export class StackBindingUtil extends BindingUtil<StackBinding> {
  static override type = "stack" as const;

  getDefaultProps() {
    return {};
  }

  getFromBounds(binding: StackBinding) {
    const bounds = this.editor
      .getBindingsToShape(binding.toId, "stack")
      .map((b) => this.editor.getShapePageBounds(b.fromId))
      .filter((b) => b !== undefined);
    return {
      bounds: bounds.reduce((u, b) => u.union(b)),
      length: bounds.length,
    };
  }

  onAfterCreate({ binding }: BindingOnCreateOptions<StackBinding>) {
    const { bounds, length } = this.getFromBounds(binding);
    this.editor.updateShape({
      id: binding.toId,
      type: "stack",
      x: bounds.maxX + 5,
      y: bounds.midY - 14,
      props: { count: length },
    });
  }

  onAfterDelete({ binding }: BindingOnDeleteOptions<StackBinding>) {
    const stack = this.editor.getShape<StackShape>(binding.toId);
    if (!stack || stack.props.count <= 2)
      return this.editor.deleteShape(binding.toId);
    const { bounds, length } = this.getFromBounds(binding);
    this.editor.updateShape({
      id: binding.toId,
      type: "stack",
      x: bounds.maxX + 5,
      y: bounds.midY - 10,
      props: { count: length },
    });
  }
}
