import { describe, expect, it } from "vitest";
import { CATEGORIES } from "@/lib/categories";
import {
  WALLPAPERS,
  getWallpaper,
  indexOf,
  wallpapersIn,
  type Wallpaper,
} from "@/lib/wallpapers";

const HEX = /^#[0-9a-f]{3,8}$/i;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

describe("catalogue shape", () => {
  it("holds ten plates in every category and nothing outside them", () => {
    const known = new Set(CATEGORIES.map((c) => c.id));
    for (const c of CATEGORIES) expect(wallpapersIn(c.id)).toHaveLength(10);
    expect(WALLPAPERS).toHaveLength(CATEGORIES.length * 10);
    for (const w of WALLPAPERS) expect(known.has(w.category)).toBe(true);
  });

  it("uses unique url-safe ids", () => {
    const ids = WALLPAPERS.map((w) => w.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(SLUG);
  });

  it("gives every plate a name and a note", () => {
    for (const w of WALLPAPERS) {
      expect(w.name.trim().length).toBeGreaterThan(0);
      expect(w.note.trim().length).toBeGreaterThan(0);
    }
  });
});

describe("recipes are renderable", () => {
  // The renderer builds background-image/-size/-position as parallel comma lists, so a
  // layer holding two gradients would silently misalign every list after it.
  const gradientCount = (image: string) => (image.match(/gradient\(/g) ?? []).length;

  it("keeps exactly one gradient per layer", () => {
    for (const w of WALLPAPERS) {
      expect(w.layers.length).toBeGreaterThan(0);
      for (const layer of w.layers) expect(gradientCount(layer.image)).toBe(1);
    }
  });

  it("uses a valid base colour", () => {
    for (const w of WALLPAPERS) expect(w.base).toMatch(HEX);
  });

  it("pairs every scene with a palette", () => {
    for (const w of WALLPAPERS) {
      if (!w.scene) continue;
      expect(w.palette, `${w.id} declares a scene but no palette`).toBeDefined();
      expect(w.palette!.length).toBeGreaterThan(0);
      for (const c of w.palette!) expect(c).toMatch(HEX);
    }
  });

  it("keeps every texture opacity inside 0..1", () => {
    const opacities = (w: Wallpaper) => [w.grain, w.pebble, w.mottle];
    for (const w of WALLPAPERS) {
      for (const o of opacities(w)) {
        if (o === undefined) continue;
        expect(o).toBeGreaterThanOrEqual(0);
        expect(o).toBeLessThanOrEqual(1);
      }
    }
  });
});

describe("lookup", () => {
  it("resolves a known id and rejects anything else", () => {
    expect(getWallpaper("solar-drift")?.name).toBe("Solar Drift");
    expect(getWallpaper("../../etc/passwd")).toBeUndefined();
    expect(getWallpaper("")).toBeUndefined();
  });

  it("numbers plates from one, and returns 0 for a miss", () => {
    expect(indexOf(WALLPAPERS[0]!.id)).toBe(1);
    expect(indexOf(WALLPAPERS.at(-1)!.id)).toBe(WALLPAPERS.length);
    expect(indexOf("nope")).toBe(0);
  });
});
