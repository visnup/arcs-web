import { expect, test } from "./fixtures";

async function getTopShapeAt(page: import("@playwright/test").Page, locator: import("@playwright/test").Locator) {
  const box = await locator.boundingBox();
  const cx = box!.x + box!.width / 2;
  const cy = box!.y + box!.height / 2;
  return page.evaluate(({ cx, cy }) => {
    const editor = (window as any).__editor;
    const pagePoint = editor.screenToPage({ x: cx, y: cy });
    const hit = editor.getShapeAtPoint(pagePoint);
    return hit ? { id: hit.id, type: hit.type, x: hit.x, y: hit.y } : null;
  }, { cx, cy });
}

async function dragAndCheck(
  page: import("@playwright/test").Page,
  from: import("@playwright/test").Locator,
  to: import("@playwright/test").Locator,
  drag: (a: import("@playwright/test").Locator, b: import("@playwright/test").Locator) => Promise<void>,
) {
  const before = await getTopShapeAt(page, from);
  await drag(from, to);
  const after = await page.evaluate(({ id }) => {
    const editor = (window as any).__editor;
    const s = editor.getShape(id);
    return s ? { x: s.x, y: s.y } : null;
  }, { id: before!.id });
  return { before, after };
}

test("drag a ship to a new position", async ({ page, shape, drag }) => {
  const { before, after } = await dragAndCheck(page, shape("ship-0-0"), shape("map"), drag);
  expect(before?.type).toMatch(/ship|stack/);
  expect(after!.x !== before!.x || after!.y !== before!.y).toBe(true);
});

test("drag an agent to a new position", async ({ page, shape, drag }) => {
  const { before, after } = await dragAndCheck(page, shape("agent-0-0"), shape("map"), drag);
  expect(before?.type).toMatch(/agent|stack/);
  expect(after!.x !== before!.x || after!.y !== before!.y).toBe(true);
});
