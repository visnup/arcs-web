import { expect, test } from "./fixtures";

test("drag a card to hand", async ({ page, shape, drag, topShape }) => {
  const top = await topShape(shape("bc-0"));
  expect(top?.type).toBe("card");

  await drag(shape("bc-0"), shape("cards-0"));

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
