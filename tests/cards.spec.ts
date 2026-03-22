import { expect, test } from "./fixtures";

async function topCardAt(page: import("@playwright/test").Page, locator: import("@playwright/test").Locator) {
  const box = await locator.boundingBox();
  const cx = box!.x + box!.width / 2;
  const cy = box!.y + box!.height / 2;
  return page.evaluate(({ cx, cy }) => {
    const editor = (window as any).__editor;
    const pagePoint = editor.screenToPage({ x: cx, y: cy });
    const hit = editor.getShapeAtPoint(pagePoint);
    return hit ? { id: hit.id, type: hit.type } : null;
  }, { cx, cy });
}

test("play a card from hand to the board", async ({ page, shape, drag }) => {
  const deck = shape("bc-0");
  const hand = shape("cards-0");
  const map = shape("map");

  // Find the top card, draw it into hand
  const top = await topCardAt(page, deck);
  expect(top?.type).toBe("card");

  await drag(deck, hand);

  // Verify card is now in the hand
  const inHand = await page.evaluate(({ id }) => {
    const editor = (window as any).__editor;
    const bindings = editor.getBindingsFromShape(id, "card-holder");
    return { bindingCount: bindings.length, holderId: bindings[0]?.toId ?? null };
  }, { id: top!.id });
  expect(inHand.bindingCount).toBe(1);

  // Play the card onto the map — drag from the card's current holder position
  const cardInHand = page.locator(`[id="${top!.id}"]`);
  await drag(cardInHand, map);

  // Card should have moved off the holder
  const afterPlay = await page.evaluate(({ id }) => {
    const editor = (window as any).__editor;
    const bindings = editor.getBindingsFromShape(id, "card-holder");
    return { bindingCount: bindings.length };
  }, { id: top!.id });
  expect(afterPlay.bindingCount).toBe(0);
});

test("action cards are face down in the deck", async ({ page, shape }) => {
  await expect(shape("action-0")).toBeAttached();

  const handBox = await shape("cards-0").boundingBox();
  const cardBox = await shape("action-0").boundingBox();

  const inHand =
    cardBox!.x >= handBox!.x &&
    cardBox!.x <= handBox!.x + handBox!.width &&
    cardBox!.y >= handBox!.y &&
    cardBox!.y <= handBox!.y + handBox!.height;
  expect(inHand).toBe(false);
});
