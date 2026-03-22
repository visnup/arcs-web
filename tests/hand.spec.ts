import { expect, test } from "./fixtures";

async function topCardAt(page: import("@playwright/test").Page, locator: import("@playwright/test").Locator) {
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

test("drag a card to hand", async ({ page, shape, drag }) => {
  const card = shape("bc-0");
  const hand = shape("cards-0");

  const top = await topCardAt(page, card);
  expect(top?.type).toBe("card");

  await drag(card, hand);

  const after = await page.evaluate(({ id }) => {
    const editor = (window as any).__editor;
    const bindings = editor.getBindingsFromShape(id, "card-holder");
    const holderBounds = bindings.length > 0
      ? editor.getShapePageBounds(bindings[0].toId)
      : null;
    const cardBounds = editor.getShapePageBounds(id);
    return {
      bindingCount: bindings.length,
      inHolder: holderBounds && cardBounds
        ? holderBounds.containsPoint({ x: cardBounds.midX, y: cardBounds.midY })
        : false,
    };
  }, { id: top!.id });

  expect(after.bindingCount).toBe(1);
  expect(after.inHolder).toBe(true);
});
