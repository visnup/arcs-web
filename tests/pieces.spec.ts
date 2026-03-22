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

test("drag an agent to a new position", async ({ page, shape, drag }) => {
  const positions = (slot: number) =>
    page.evaluate(({ slot }) => {
      const editor = (window as any).__editor;
      return editor.getCurrentPageShapes()
        .filter((s: any) => s.type === "agent" && s.props.slot === slot)
        .map((s: any) => ({ id: s.id, x: s.x, y: s.y }));
    }, { slot });

  const before = await positions(0);
  await drag(shape("agent-0-0"), shape("map"));
  const after = await positions(0);

  const moved = after.filter((a: any) => {
    const b = before.find((b: any) => b.id === a.id);
    return b && (a.x !== b.x || a.y !== b.y);
  });
  expect(moved).toHaveLength(1);
});
