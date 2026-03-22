import { expect, test } from "@playwright/test";

test("redirects to a room URL when no room param", async ({ page }) => {
  await page.goto("/");
  await page.waitForURL((url) => url.searchParams.has("room"));
  expect(page.url()).toMatch(/[?&]room=\w+/);
});

test("preserves room param on navigation", async ({ page }) => {
  await page.goto("/?room=test-room");
  expect(new URL(page.url()).searchParams.get("room")).toBe("test-room");
});
