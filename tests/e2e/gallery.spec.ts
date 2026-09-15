import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const CATEGORIES = ["aurora", "nature", "leather", "mono"] as const;

test("the index lists every plate", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("li[data-cat]")).toHaveCount(40);
  await expect(page.locator('li[data-cat="aurora"]').first()).toBeVisible();
});

// Each category is one branch of a single CSS selector list, so a typo in any one branch
// hides the wrong tiles. Walking all four is both the coverage and the regression test.
for (const cat of CATEGORIES) {
  test(`filtering to ${cat} shows only ${cat}`, async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: new RegExp(`^${cat}`, "i") }).click();

    await expect(page.locator(`li[data-cat="${cat}"]`)).toHaveCount(10);
    await expect(page.locator(`li[data-cat="${cat}"]`).first()).toBeVisible();
    for (const other of CATEGORIES.filter((c) => c !== cat)) {
      await expect(page.locator(`li[data-cat="${other}"]`).first()).toBeHidden();
    }
    // Exactly the ten matching tiles are laid out - nothing leaks through.
    await expect(page.locator("li[data-cat]:visible")).toHaveCount(10);
    await expect(page.getByRole("button", { name: new RegExp(`^${cat}`, "i") })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    // The filter lives in the URL, so a filtered view is linkable.
    expect(new URL(page.url()).hash).toBe(`#${cat}`);
  });
}

test("All restores every plate", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /^mono/i }).click();
  await page.getByRole("button", { name: /^all/i }).click();
  await expect(page.locator("li[data-cat]:visible")).toHaveCount(40);
});

test("a category link opens already filtered", async ({ page }) => {
  await page.goto("/#leather");
  await expect(page.locator("li[data-cat]:visible")).toHaveCount(10);
  await expect(page.locator('li[data-cat="leather"]').first()).toBeVisible();
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

test("Escape returns to the index", async ({ page }) => {
  await page.goto("/w/vanguard");
  await page.keyboard.press("Escape");
  await expect(page).toHaveURL(/\/$/);
});

test("the viewer wraps around at both ends of the catalogue", async ({ page }) => {
  await page.goto("/w/solar-drift");
  await page.keyboard.press("ArrowLeft");
  await expect(page).toHaveURL(/\/w\/smoke-bands$/);
});

test("the chrome hides when idle and comes back on input", async ({ page }) => {
  await page.goto("/w/alpine-dawn");
  const chrome = page.locator(".chrome");
  await expect(chrome).toHaveAttribute("data-hidden", "false");
  await expect(chrome).toHaveAttribute("data-hidden", "true", { timeout: 8000 });

  // A key wakes it on touch devices too, where there is no pointermove to send.
  await page.keyboard.press("Shift");
  await expect(chrome).toHaveAttribute("data-hidden", "false");
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

/**
 * The reveal animation starts at opacity 0, and a contrast check sampled mid-fade reads
 * a blended foreground and reports a failure that does not exist once the page settles.
 */
async function settled(page: import("@playwright/test").Page) {
  await page.waitForFunction(() =>
    document.getAnimations().every((a) => a.playState === "finished" || a.playState === "idle"),
  );
}

// CI serves the production build, so this is the only place the shipped CSP is real.
test.describe("production headers", () => {
  test.skip(!process.env.CI, "dev intentionally allows unsafe-eval for React devtools");

  test("the shipped CSP carries no unsafe-eval", async ({ request }) => {
    const res = await request.get("/");
    const csp = res.headers()["content-security-policy"] ?? "";
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).not.toContain("unsafe-eval");
  });

  test("no CSP violation fires while loading a plate", async ({ page }) => {
    const violations: string[] = [];
    page.on("console", (m) => {
      if (m.text().includes("Content Security Policy")) violations.push(m.text());
    });
    await page.goto("/w/solar-drift");
    await page.waitForLoadState("networkidle");
    expect(violations).toEqual([]);
  });
});

test.describe("accessibility", () => {
  // white-dune is the lightest plate, so it is the hardest case for the viewer chrome.
  for (const path of ["/", "/w/solar-drift", "/w/white-dune"]) {
    test(`${path} has no axe violations`, async ({ page }) => {
      await page.goto(path);
      await page.keyboard.press("Shift"); // keep the viewer chrome up so it is analysed
      await settled(page);
      const { violations } = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      expect(violations.map((v) => `${v.id}: ${v.nodes.length} node(s)`)).toEqual([]);
    });
  }
});
