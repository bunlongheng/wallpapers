import { expect, test } from "@playwright/test";

test("the index lists every plate and filters by category", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("li[data-cat]")).toHaveCount(40);
  await expect(page.locator('li[data-cat="mono"]').first()).toBeVisible();

  await page.getByRole("button", { name: /^Mono/ }).click();
  await expect(page.locator('li[data-cat="mono"]')).toHaveCount(10);
  await expect(page.locator('li[data-cat="mono"]').first()).toBeVisible();
  await expect(page.locator('li[data-cat="aurora"]').first()).toBeHidden();

  await page.getByRole("button", { name: /^All/ }).click();
  await expect(page.locator('li[data-cat="aurora"]').first()).toBeVisible();
});

test("a plate opens full-bleed and walks forward with the keyboard", async ({ page }) => {
  await page.goto("/w/solar-drift");
  await expect(page.getByRole("heading", { name: "Solar Drift" })).toBeVisible();

  await page.keyboard.press("ArrowRight");
  await expect(page).toHaveURL(/\/w\/cobalt-bloom$/);
  await expect(page.getByRole("heading", { name: "Cobalt Bloom" })).toBeVisible();

  await page.keyboard.press("ArrowLeft");
  await expect(page).toHaveURL(/\/w\/solar-drift$/);
});

test("the viewer wraps around at both ends of the catalogue", async ({ page }) => {
  await page.goto("/w/solar-drift");
  await page.keyboard.press("ArrowLeft");
  await expect(page).toHaveURL(/\/w\/smoke-bands$/);
});

test("an unknown plate id is a 404, not a render", async ({ page }) => {
  const res = await page.goto("/w/does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.getByText("Off the index")).toBeVisible();
});

test("the page does not scroll sideways on a phone", async ({ page }) => {
  await page.goto("/");
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
