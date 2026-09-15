/**
 * Every wallpaper in this app is a recipe, not a file.
 *
 * A recipe is a base colour plus an ordered stack of CSS background layers, and
 * optionally one inline-SVG scene drawn on top. Nothing is fetched at runtime, so a
 * wallpaper costs a few hundred bytes of HTML and stays sharp at any resolution -
 * which is the whole point: the gallery is meant for screenshots and demos.
 */

import type { CategoryId } from "./categories";
export * from "./recipes/types";

import type { Recipe } from "./recipes/types";
import { AURORA } from "./recipes/aurora";
import { NATURE } from "./recipes/nature";
import { LEATHER } from "./recipes/leather";
import { MONO } from "./recipes/mono";

export const WALLPAPERS: Recipe[] = [...AURORA, ...NATURE, ...LEATHER, ...MONO];

const BY_ID = new Map(WALLPAPERS.map((w) => [w.id, w]));
const INDEX = new Map(WALLPAPERS.map((w, i) => [w.id, i + 1]));

export function getWallpaper(id: string): Recipe | undefined {
  return BY_ID.get(id);
}

export function wallpapersIn(category: CategoryId): Recipe[] {
  return WALLPAPERS.filter((w) => w.category === category);
}

/** Catalogue index of a wallpaper, 1-based - used for the contact-sheet numbering. */
export function indexOf(id: string): number {
  return INDEX.get(id) ?? 0;
}
