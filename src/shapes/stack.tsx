import {
  BaseBoxShapeUtil,
  BindingUtil,
  HTMLContainer,
  type BindingOnCreateOptions,
  type BindingOnDeleteOptions,
  type TLBaseBinding,
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

type StackBinding = TLBaseBinding<"stack", object>;
export class StackBindingUtil extends BindingUtil<StackBinding> {
  static override type = "stack" as const;

  getDefaultProps() {
    return {};
  }

  onAfterCreate({
    binding: { fromId, toId },
  }: BindingOnCreateOptions<StackBinding>) {
    console.log("binding create", fromId, toId);
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
    console.log("binding delete", fromId, toId);
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
