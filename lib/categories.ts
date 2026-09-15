/**
 * Kept apart from the recipes on purpose. `CategoryFilter` is a client component, and
 * importing anything from `wallpapers.ts` would pull all forty recipes into the browser
 * bundle along with it. This module is the client-safe half.
 */

export type CategoryId = "aurora" | "nature" | "leather" | "mono";

export type Category = {
  id: CategoryId;
  name: string;
  blurb: string;
};

export const CATEGORIES: Category[] = [
  { id: "aurora", name: "Aurora", blurb: "Radiant gradient meshes and light bloom" },
  { id: "nature", name: "Nature", blurb: "Ridgelines, tree cover, dunes and tide" },
  { id: "leather", name: "Leather", blurb: "Grain, weave, metal and worked hide" },
  { id: "mono", name: "Mono", blurb: "High-contrast black and white cinema" },
];
