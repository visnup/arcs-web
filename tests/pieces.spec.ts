import { expect, test } from "./fixtures";

test("drag a ship to a new position", async ({ page, shape, drag, topShape }) => {
  const before = await topShape(shape("ship-0-0"));
  await drag(shape("ship-0-0"), shape("map"));
  const after = await page.evaluate(({ id }) => {
    const editor = (window as any).__editor;
    const s = editor.getShape(id);
    return s ? { x: s.x, y: s.y } : null;
  }, { id: before!.id });
  expect(before?.type).toMatch(/ship|stack/);
  expect(after!.x !== before!.x || after!.y !== before!.y).toBe(true);
});

test("drag an agent to a new position", async ({ page, shape, drag, topShape }) => {
  const before = await topShape(shape("agent-0-0"));
  await drag(shape("agent-0-0"), shape("map"));
  const after = await page.evaluate(({ id }) => {
    const editor = (window as any).__editor;
    const s = editor.getShape(id);
    return s ? { x: s.x, y: s.y } : null;
  }, { id: before!.id });
  expect(before?.type).toMatch(/agent|stack/);
  expect(after!.x !== before!.x || after!.y !== before!.y).toBe(true);
});
