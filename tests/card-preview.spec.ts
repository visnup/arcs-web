import { expect, test } from "./fixtures";

test("alt+hover shows card preview", async ({ page, shape, topShape }) => {
  const deck = shape("bc-0");
  const card = await topShape(deck);
  expect(card?.type).toBe("card");

  const box = await deck.boundingBox();
  const cx = box!.x + box!.width / 2;
  const cy = box!.y + box!.height / 2;

  const preview = page.locator('[data-testid="card-preview"]');
  await expect(preview).not.toBeVisible();

  await page.mouse.move(cx, cy);
  await page.keyboard.down("Alt");
  await expect(preview).toBeVisible();

  await page.keyboard.up("Alt");
  await expect(preview).not.toBeVisible();
});

test("card preview shows correct face", async ({ page, shape, topShape }) => {
  const deck = shape("bc-0");
  const card = await topShape(deck);
  expect(card?.type).toBe("card");

  const box = await deck.boundingBox();
  const cx = box!.x + box!.width / 2;
  const cy = box!.y + box!.height / 2;

  // Get card props to know expected image
  const { faceUp, frontUrl, backUrl } = await page.evaluate(({ id }) => {
    const editor = (window as any).__editor;
    const s = editor.getShape(id);
    return { faceUp: s.props.faceUp, frontUrl: s.props.frontUrl, backUrl: s.props.backUrl };
  }, { id: card!.id });

  await page.mouse.move(cx, cy);
  await page.keyboard.down("Alt");

  const preview = page.locator('[data-testid="card-preview"] > div');
  const bg = await preview.evaluate((el) => getComputedStyle(el).backgroundImage);
  const expectedUrl = faceUp ? frontUrl : backUrl;
  expect(bg).toContain(expectedUrl);

  await page.keyboard.up("Alt");
});

test("alt+hover shows die preview", async ({ page, shape }) => {
  const die = shape("die-assault-0");
  const box = await die.boundingBox();
  const cx = box!.x + box!.width / 2;
  const cy = box!.y + box!.height / 2;

  const preview = page.locator('[data-testid="card-preview"]');
  await expect(preview).not.toBeVisible();

  await page.mouse.move(cx, cy);
  await page.keyboard.down("Alt");
  await expect(preview).toBeVisible();

  await page.keyboard.up("Alt");
  await expect(preview).not.toBeVisible();
});
