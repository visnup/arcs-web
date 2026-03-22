import { expect, test } from "./fixtures";

const id = (shapeId: string) => shapeId.replace("shape:", "");

test("stack counter shows count", async ({ page, shape, drag }) => {
  const stack = await page.evaluate(() => {
    const editor = (window as any).__editor;
    return editor
      .getCurrentPageShapes()
      .find((s: any) => s.type === "stack");
  });
  expect(stack).toBeTruthy();
  expect(stack.props.count).toBeGreaterThan(1);

  const el = shape(id(stack.id));
  await expect(el).toBeVisible();
  await expect(el).toContainText(String(stack.props.count));

  // Drag a stacked ship away — counter should decrement
  const shipId = await page.evaluate(({ stackId }) => {
    const editor = (window as any).__editor;
    const binding = editor.getBindingsToShape(stackId, "stack")[0];
    return binding?.fromId ?? null;
  }, { stackId: stack.id });
  expect(shipId).toBeTruthy();

  await drag(shape(id(shipId)), shape("map"));

  await expect(el).toContainText(String(stack.props.count - 1));
});
