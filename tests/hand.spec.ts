import { expect, test } from "./fixtures";

test("drag a card to hand", async ({ page, shape, drag, topShape }) => {
  const top = await topShape(shape("bc-0"));
  expect(top?.type).toBe("card");

  await drag(shape("bc-0"), shape("cards-0"));

  const after = await page.evaluate(
    ({ id }) => {
      const editor = (window as any).__editor;
      const bindings = editor.getBindingsFromShape(id, "card-holder");
      const holderBounds =
        bindings.length > 0
          ? editor.getShapePageBounds(bindings[0].toId)
          : null;
      const cardBounds = editor.getShapePageBounds(id);
      const card = editor.getShape(id);
      return {
        bindingCount: bindings.length,
        inHolder:
          holderBounds && cardBounds
            ? holderBounds.containsPoint({
                x: cardBounds.midX,
                y: cardBounds.midY,
              })
            : false,
        holderBounds: holderBounds
          ? {
              x: holderBounds.x,
              y: holderBounds.y,
              w: holderBounds.w,
              h: holderBounds.h,
            }
          : null,
        cardBounds: cardBounds
          ? {
              x: cardBounds.x,
              y: cardBounds.y,
              midX: cardBounds.midX,
              midY: cardBounds.midY,
            }
          : null,
        cardXY: card ? { x: card.x, y: card.y, parentId: card.parentId } : null,
      };
    },
    { id: top!.id },
  );

  expect(after.bindingCount).toBe(1);
  expect(after.inHolder).toBe(true);
});
