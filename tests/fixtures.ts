import { test as base, type Locator, type Page } from "@playwright/test";

type Fixtures = {
  page: Page;
  shape: (id: string) => Locator;
  drag: (from: Locator, to: Locator) => Promise<void>;
};

async function editorDrag(
  page: Page,
  from: { x: number; y: number },
  to: { x: number; y: number },
) {
  // Dispatch with real time delays so tldraw's velocity tracking works correctly.
  // Slow moves (30ms apart) keep velocity near 0 so the drag timer isn't repeatedly reset.
  await page.evaluate(
    ({ from }) => {
      const editor = (window as any).__editor;
      const info = (x: number, y: number) => ({
        point: { x, y, z: 0.5 },
        shiftKey: false, altKey: false, ctrlKey: false,
        metaKey: false, accelKey: false,
        pointerId: 1, button: 0, isPen: false,
      });
      editor.dispatch({ type: "pointer", target: "canvas", name: "pointer_down", ...info(from.x, from.y) });
    },
    { from },
  );

  const steps = 5;
  for (let i = 1; i <= steps; i++) {
    const x = from.x + ((to.x - from.x) * i) / steps;
    const y = from.y + ((to.y - from.y) * i) / steps;
    await page.waitForTimeout(30);
    await page.evaluate(
      ({ x, y }) => {
        const editor = (window as any).__editor;
        const info = (x: number, y: number) => ({
          point: { x, y, z: 0.5 },
          shiftKey: false, altKey: false, ctrlKey: false,
          metaKey: false, accelKey: false,
          pointerId: 1, button: 0, isPen: false,
        });
        editor.dispatch({ type: "pointer", target: "canvas", name: "pointer_move", ...info(x, y) });
      },
      { x, y },
    );
  }

  // Wait for tldraw's drag timer to fire after the last move
  await page.waitForTimeout(200);
  await page.evaluate(
    ({ to }) => {
      const editor = (window as any).__editor;
      const info = (x: number, y: number) => ({
        point: { x, y, z: 0.5 },
        shiftKey: false, altKey: false, ctrlKey: false,
        metaKey: false, accelKey: false,
        pointerId: 1, button: 0, isPen: false,
      });
      editor.dispatch({ type: "pointer", target: "canvas", name: "pointer_up", ...info(to.x, to.y) });
    },
    { to },
  );
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
      await editorDrag(
        page,
        { x: fromBox!.x + fromBox!.width / 2, y: fromBox!.y + fromBox!.height / 2 },
        { x: toBox!.x + toBox!.width / 2, y: toBox!.y + toBox!.height / 2 },
      );
    });
  },
});

export { expect } from "@playwright/test";
