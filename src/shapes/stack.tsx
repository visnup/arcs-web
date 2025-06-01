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
    const shapes = this.editor
      .getShapesAtPoint(shape, { hitInside: true, margin: 10 })
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

  onAfterCreate({
    binding: { fromId, toId },
  }: BindingOnCreateOptions<StackBinding>) {
    console.log("create", fromId, toId);
    const stack = this.editor.getShape<StackShape>(toId);
    if (!stack) return;
    const bounds = this.editor
      .getBindingsToShape(stack, "stack")
      .map((b) => this.editor.getShapePageBounds(b.fromId)!);
    const { maxX, minY } = bounds.reduce((u, bounds) => u.union(bounds));
    console.log(maxX, minY, bounds);
    this.editor.updateShape({
      id: toId,
      type: "stack",
      x: maxX + 5,
      y: minY + 10,
      props: { count: bounds.length },
    });
  }

  onAfterDelete({
    binding: { fromId, toId },
  }: BindingOnDeleteOptions<StackBinding>) {
    console.log("delete", fromId, toId);
    const stack = this.editor.getShape<StackShape>(toId);
    if (!stack || stack.props.count <= 2) return this.editor.deleteShape(toId);
    const bounds = this.editor
      .getBindingsToShape(stack, "stack")
      .map((b) => this.editor.getShapePageBounds(b.fromId)!);
    if (bounds.length === 0) return this.editor.deleteShape(toId);
    const { maxX, minY } = bounds.reduce((u, bounds) => u.union(bounds));
    console.log(maxX, minY, bounds);
    this.editor.updateShape({
      id: toId,
      type: "stack",
      x: maxX + 5,
      y: minY + 10,
      props: { count: bounds.length },
    });
  }
}
