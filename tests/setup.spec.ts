import { expect, test } from "./fixtures";

test("initial setup", async ({ shape }) => {
  await expect(shape("map")).toBeVisible();

  for (let s = 0; s <= 3; s++) {
    await expect(shape(`board-${s}`)).toBeVisible();
    await expect(shape(`cards-${s}`)).toBeVisible();
    await expect(shape(`ship-${s}-0`)).toBeVisible();
    await expect(shape(`ship-${s}-14`)).toBeVisible();
    await expect(shape(`agent-${s}-0`)).toBeVisible();
  }

  await expect(shape("bc-0")).toBeVisible();
  await expect(shape("action-0")).toBeVisible();
});
