import { expect, test } from "./fixtures";

test("play a card from hand to the board", async ({ page, shape, drag, topShape }) => {
  const deck = shape("bc-0");
  const top = await topShape(deck);
  expect(top?.type).toBe("card");

  await drag(deck, shape("cards-0"));

  const inHand = await page.evaluate(({ id }) => {
    const editor = (window as any).__editor;
    return editor.getBindingsFromShape(id, "card-holder").length;
  }, { id: top!.id });
  expect(inHand).toBe(1);

  await drag(page.locator(`[id="${top!.id}"]`), shape("map"));

  const afterPlay = await page.evaluate(({ id }) => {
    const editor = (window as any).__editor;
    return editor.getBindingsFromShape(id, "card-holder").length;
  }, { id: top!.id });
  expect(afterPlay).toBe(0);
});

test("action cards are face down in the deck", async ({ shape }) => {
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
