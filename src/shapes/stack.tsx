import {
  BaseBoxShapeUtil,
  BindingUtil,
  createShapeId,
  HTMLContainer,
  type BindingOnCreateOptions,
  type BindingOnDeleteOptions,
  type TLBaseBinding,
  type TLBaseBoxShape,
  type TLBaseShape,
} from "tldraw";

type StackShape = TLBaseShape<"stack", { w: number; h: number; count: number }>;
export class StackShapeUtil extends BaseBoxShapeUtil<StackShape> {
  static override type = "stack" as const;

  getDefaultProps() {
    return { w: 10, h: 10, count: 0 };
  }

  component(shape: StackShape) {
    return <HTMLContainer id={shape.id}>{shape.props.count}</HTMLContainer>;
  }

  indicator() {
    return null;
  }
}

export abstract class StackableShapeUtil<
  T extends TLBaseBoxShape,
> extends BaseBoxShapeUtil<T> {
  onTranslateStart(shape: T) {
    const bindings = this.editor.getBindingsFromShape(shape, "stack");
    this.editor.deleteBindings(bindings);
  }

  onTranslateEnd(_initial: T, shape: T) {
    if (this.editor.getBindingsFromShape(shape, "stack").length) return;
    const { center } = this.editor.getShapePageGeometry(shape);
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
    const bounds = this.editor.getBindingsToShape(binding.toId, "stack").map(
      (b) =>
        this.editor.getShapePageGeometry(b.fromId, {
          context: String(Math.random()), // ignore cache
        }).bounds!,
    );
    return {
      bounds: bounds.reduce((u, bounds) => u.union(bounds)),
      length: bounds.length,
    };
  }

  onAfterCreate({ binding }: BindingOnCreateOptions<StackBinding>) {
    const { bounds, length } = this.getFromBounds(binding);
    this.editor.updateShape({
      id: binding.toId,
      type: "stack",
      x: bounds.maxX + 5,
      y: bounds.midY - 10,
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
