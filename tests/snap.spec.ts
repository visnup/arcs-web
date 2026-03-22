import { expect, test } from "./fixtures";

test("ambition-declared marker snaps back to its map position", async ({
  page,
  shape,
}) => {
  const ad = shape("ambition-declared");

  // record initial snap position
  const initial = await page.evaluate(() => {
    const editor = (window as any).__editor;
    const s = editor.getShape("shape:ambition-declared");
    return s ? { x: s.x, y: s.y, rotation: s.rotation } : null;
  });
  expect(initial).toBeTruthy();

  // drag it to the center of the map (far from snap point)
  const mapBox = await shape("map").boundingBox();
  const adBox = await ad.boundingBox();
  await page.mouse.move(adBox!.x + adBox!.width / 2, adBox!.y + adBox!.height / 2);
  await page.mouse.down();
  await page.mouse.move(mapBox!.x + mapBox!.width / 2, mapBox!.y + mapBox!.height / 2, { steps: 5 });
  await page.mouse.up();
  await page.waitForTimeout(100);

  // verify it moved
  const moved = await page.evaluate(() => {
    const editor = (window as any).__editor;
    const s = editor.getShape("shape:ambition-declared");
    return s ? { x: s.x, y: s.y } : null;
  });
  expect(moved!.x !== initial!.x || moved!.y !== initial!.y).toBe(true);

  // drag it back to within snap range of its home position
  const snapScreen = await page.evaluate(() => {
    const editor = (window as any).__editor;
    // home center is page (75, 550); drag to 30px away (within 50px threshold)
    return editor.pageToViewport({ x: 75 + 30, y: 550 });
  });
  const adBox2 = await ad.boundingBox();
  await page.mouse.move(adBox2!.x + adBox2!.width / 2, adBox2!.y + adBox2!.height / 2);
  await page.mouse.down();
  await page.mouse.move(snapScreen.x, snapScreen.y, { steps: 5 });
  await page.waitForTimeout(200);
  await page.mouse.up();
  await page.waitForTimeout(100);

  // verify snapped to home position: snap center {75, 550}, shape 95×24 → top-left {27.5, 538}
  const snapped = await page.evaluate(() => {
    const editor = (window as any).__editor;
    const s = editor.getShape("shape:ambition-declared");
    return s ? { x: s.x, y: s.y, rotation: s.rotation } : null;
  });
  expect(snapped!.x).toBeCloseTo(27.5, 0);
  expect(snapped!.y).toBeCloseTo(538, 0);
  expect(snapped!.rotation).toBeCloseTo(0, 5);
});
