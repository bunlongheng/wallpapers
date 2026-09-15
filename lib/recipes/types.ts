/**
 * The recipe model: what a wallpaper is made of, and the helpers the category files
 * use to write one. The recipes themselves live in the sibling category modules.
 */

import type { CategoryId } from "../categories";

export type SceneId =
  | "peaks"
  | "ridges"
  | "pines"
  | "dunes"
  | "waves"
  | "canyon"
  | "corridor"
  | "slats"
  | "halftone"
  | "ring"
  | "grid";

/**
 * One CSS background layer. Exactly one gradient per layer, so the parallel
 * background-size / -position / -repeat lists stay aligned with it.
 * Defaults: size `cover`, position `center`, repeat `repeat` when a size is given.
 */
export type Layer = {
  image: string;
  size?: string;
  position?: string;
  repeat?: string;
};

/**
 * Which scenes read which options. A scene that ignores an option should not accept
 * it, so these groups are what make `sceneOptions: { scale }` on `ring` a compile
 * error rather than a silent no-op.
 */
type GroundScene = "ridges" | "pines" | "dunes" | "waves" | "canyon";
type FlatScene = "corridor" | "slats" | "halftone" | "ring" | "grid";

/** Relative scale of the motif, 1 = default. Only scenes with a ground plane use it. */
type Scaled = { scale?: number };

/**
 * A scene is meaningless without the colours it paints with, so the two travel
 * together: no recipe can declare one without the other.
 */
type SceneFields =
  | { scene?: never; sceneOptions?: never; palette?: never }
  | {
      scene: "peaks";
      /** Colours the scene paints with, front-most first. */
      palette: string[];
      /** `mirror` reflects the range across the waterline. */
      sceneOptions?: Scaled & { mirror?: boolean };
    }
  | { scene: GroundScene; palette: string[]; sceneOptions?: Scaled }
  | { scene: FlatScene; palette: string[]; sceneOptions?: never };

/** The options any scene might accept, for the renderer's single entry point. */
export type SceneOptions = Scaled & { mirror?: boolean };

type BaseRecipe = {
  id: string;
  name: string;
  category: CategoryId;
  /** One-line description shown in the viewer. */
  note: string;
  base: string;
  layers: Layer[];
  /** Film-grain opacity, 0-1. Omit for none. */
  grain?: number;
  /** Raised-grain opacity, 0-1 - the pebbling of hide or worked metal. */
  pebble?: number;
  /** Broad mottling opacity, 0-1 - pigment variation across a panel. */
  mottle?: number;
};

/** One wallpaper, as data. Named Recipe so it does not collide with the component. */
export type Recipe = BaseRecipe & SceneFields;

/** Radial blob helper - keeps the aurora recipes readable. */
export const blob = (color: string, x: string, y: string, size = "60% 55%"): Layer => ({
  image: `radial-gradient(${size} at ${x} ${y}, ${color}, transparent 70%)`,
});

/** The darkening edge that closes most layer stacks. */
export const vignette = (edge: string, start = "30%", size = "125% 105%", at = "50% 50%"): Layer => ({
  image: `radial-gradient(${size} at ${at}, transparent ${start}, ${edge})`,
});

