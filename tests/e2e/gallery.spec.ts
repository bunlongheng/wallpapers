import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { CATEGORIES } from "../../lib/categories";
import { WALLPAPERS, wallpapersIn } from "../../lib/wallpapers";

// Specs run in Node, so the catalogue is the source of truth for every count here.
const TOTAL = WALLPAPERS.length;
const IDS = CATEGORIES.map((c) => c.id);

/**
 * Keyboard navigation is attached on hydration, so a key pressed before the bundle has
 * run does nothing. Wait for the network to go quiet, which means the chunks have been
 * fetched and executed.
 */
async function openPlate(page: import("@playwright/test").Page, id: string) {
  await page.goto(`/w/${id}`);
  await page.waitForLoadState("networkidle");
}

test("the index lists every plate", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("li[data-cat]")).toHaveCount(TOTAL);
  await expect(page.locator('li[data-cat="aurora"]').first()).toBeVisible();
});

// Each category is one branch of a single CSS selector list, so a typo in any one branch
// hides the wrong tiles. Walking all four is both the coverage and the regression test.
for (const cat of IDS) {
  test(`filtering to ${cat} shows only ${cat}`, async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: new RegExp(`^${cat}`, "i") }).click();

    await expect(page.locator(`li[data-cat="${cat}"]`)).toHaveCount(wallpapersIn(cat).length);
    await expect(page.locator(`li[data-cat="${cat}"]`).first()).toBeVisible();
    for (const other of IDS.filter((c) => c !== cat)) {
      await expect(page.locator(`li[data-cat="${other}"]`).first()).toBeHidden();
    }
    // Exactly the ten matching tiles are laid out - nothing leaks through.
    await expect(page.locator("li[data-cat]:visible")).toHaveCount(wallpapersIn(cat).length);
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
  await expect(page.locator("li[data-cat]:visible")).toHaveCount(TOTAL);
});

test("a category link opens already filtered", async ({ page }) => {
  await page.goto("/#leather");
  await expect(page.locator("li[data-cat]:visible")).toHaveCount(wallpapersIn("leather").length);
  await expect(page.locator('li[data-cat="leather"]').first()).toBeVisible();
});

test("a plate opens full-bleed and walks forward with the keyboard", async ({ page }) => {
  await openPlate(page, "solar-drift");
  await expect(page.getByRole("heading", { name: "Solar Drift" })).toBeVisible();

  await page.keyboard.press("ArrowRight");
  await expect(page).toHaveURL(/\/w\/cobalt-bloom$/);
  await expect(page.getByRole("heading", { name: "Cobalt Bloom" })).toBeVisible();

  // Pressed straight away: the previous plate's listener must not handle this.
  await page.keyboard.press("ArrowLeft");
  await expect(page).toHaveURL(/\/w\/solar-drift$/);
  await expect(page.getByRole("heading", { name: "Solar Drift" })).toBeVisible();
});

test("Escape returns to the index", async ({ page }) => {
  await openPlate(page, "vanguard");
  await page.keyboard.press("Escape");
  await expect(page).toHaveURL(/\/$/);
});

test("the viewer wraps around at both ends of the catalogue", async ({ page }) => {
  await openPlate(page, "solar-drift");
  await page.keyboard.press("ArrowLeft");
  await expect(page).toHaveURL(/\/w\/smoke-bands$/);
});

test("the chrome hides when idle and comes back on input", async ({ page }) => {
  await openPlate(page, "alpine-dawn");
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
 *
 * Waiting on document.getAnimations() alone is racy - it is empty before the animations
 * are created, so the wait can resolve instantly. Assert the end state instead.
 */
async function settled(page: import("@playwright/test").Page) {
  await page.waitForFunction(() => {
    const fading = [...document.querySelectorAll(".reveal")];
    if (!fading.every((el) => getComputedStyle(el).opacity === "1")) return false;
    return document
      .getAnimations()
      .every((a) => a.playState === "finished" || a.playState === "idle");
  });
}

// CI serves the production build, so this is the only place the shipped CSP is real.
test.describe("production headers", () => {
  test.skip(!process.env.CI, "dev intentionally allows unsafe-eval for React devtools");

  test("the shipped CSP carries no unsafe-eval", async ({ request }) => {
    const res = await request.get("/");
    const csp = res.headers()["content-security-policy"] ?? "";
    for (const directive of [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self'",
      "img-src 'self' data:",
      "connect-src 'self'",
      "manifest-src 'self'",
      "frame-src 'none'",
      "worker-src 'none'",
      "frame-ancestors *",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
    ]) {
      expect(csp).toContain(directive);
    }
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

test("viewer chrome text stays white over the lightest plate", async ({ page }) => {
  // axe marks text over a gradient as needs-review, so this is the only check that
  // catches the chrome losing its colour to a cascade change.
  await page.goto("/w/white-dune");
  const tags = page.locator(".chrome .tag");
  const count = await tags.count();
  expect(count).toBeGreaterThan(0);
  for (let i = 0; i < count; i++) {
    const colour = await tags.nth(i).evaluate((el) => getComputedStyle(el).color);
    expect(colour, `chrome .tag #${i}`).toMatch(/^rgba?\(255, 255, 255/);
  }
});

test.describe("demo mode", () => {
  test("?demo=true&theme=nature shows only that category, full bleed", async ({ page }) => {
    await page.goto("/?demo=true&theme=nature");
    const plates = page.locator(".demo-plate");
    await expect(plates).toHaveCount(wallpapersIn("nature").length);

    // The grid must not be laid out underneath an embedded backdrop.
    await expect(page.locator("main")).toBeHidden();

    // Every plate has to occupy the same box. They used to stack vertically, because
    // Wallpaper sets `relative` on its own root and a utility passed in from outside
    // cannot override it - so only the first plate was ever on screen.
    const boxes = await plates.evaluateAll((els) =>
      els.map((e) => {
        const r = e.getBoundingClientRect();
        return `${r.x},${r.y},${Math.round(r.width)},${Math.round(r.height)}`;
      }),
    );
    expect(new Set(boxes).size).toBe(1);

    const vp = page.viewportSize()!;
    expect(boxes[0]).toBe(`0,0,${vp.width},${vp.height}`);
  });

  test("it advances to the next plate on its own", async ({ page }) => {
    await page.goto("/?demo=true&theme=nature");
    const active = () =>
      page.locator(".demo-plate").evaluateAll((els) =>
        els.findIndex((e) => e.classList.contains("is-on")),
      );
    await expect.poll(active).toBe(0);
    await expect.poll(active, { timeout: 6000 }).toBe(1);
  });

  test("without a theme it rotates the whole catalogue", async ({ page }) => {
    await page.goto("/?demo=true");
    await expect(page.locator(".demo-plate")).toHaveCount(TOTAL);
  });

  test("the index is untouched without the flag", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".demo-plate")).toHaveCount(0);
    await expect(page.locator("main")).toBeVisible();
  });
});

test.describe("accessibility", () => {
  // A violation that passes on retry is still a violation - never mask one.
  test.describe.configure({ retries: 0 });

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
