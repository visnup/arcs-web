/* eslint-disable react-hooks/rules-of-hooks */
import { test as base, type Locator, type Page } from "@playwright/test";

type Fixtures = {
  page: Page;
  shape: (id: string) => Locator;
  drag: (from: Locator, to: Locator) => Promise<void>;
};

async function drag(
  page: Page,
  from: { x: number; y: number },
  to: { x: number; y: number },
) {
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  const steps = 5;
  for (let i = 1; i <= steps; i++) {
    const x = from.x + ((to.x - from.x) * i) / steps;
    const y = from.y + ((to.y - from.y) * i) / steps;
    await page.waitForTimeout(30);
    await page.mouse.move(x, y);
  }
  await page.waitForTimeout(200);
  await page.mouse.up();
  await page.waitForTimeout(100);
}

export const test = base.extend<Fixtures>({
  page: async ({ page }, use) => {
    await page.goto("/?new");
    await page.locator('[id="shape:map"]').waitFor();
    await use(page);
  },
  shape: async ({ page }, use) => {
    await use((id) => page.locator(`[id="shape:${id}"]`));
  },
  drag: async ({ page }, use) => {
    await use(async (from: Locator, to: Locator) => {
      const fromBox = await from.boundingBox();
      const toBox = await to.boundingBox();
      await drag(
        page,
        {
          x: fromBox!.x + fromBox!.width / 2,
          y: fromBox!.y + fromBox!.height / 2,
        },
        { x: toBox!.x + toBox!.width / 2, y: toBox!.y + toBox!.height / 2 },
      );
    });
  },
});

export { expect } from "@playwright/test";
