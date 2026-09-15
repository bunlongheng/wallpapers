/**
 * Every wallpaper in this app is a recipe, not a file.
 *
 * A recipe is a base colour plus an ordered stack of CSS background layers, and
 * optionally one inline-SVG scene drawn on top. Nothing is fetched at runtime, so a
 * wallpaper costs a few hundred bytes of HTML and stays sharp at any resolution -
 * which is the whole point: the gallery is meant for screenshots and demos.
 */

import type { CategoryId } from "./categories";

export type { CategoryId };

export type SceneId =
  | "peaks"
  | "ridges"
  | "pines"
  | "dunes"
  | "waves"
  | "canyon"
  | "helmet"
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

export type SceneOptions = {
  /** Mirror the scene into a reflection across the horizon. */
  mirror?: boolean;
  /** How many repeats of the motif (helmet row). */
  count?: number;
  /** Relative scale of the motif, 1 = default. */
  scale?: number;
};

export type Wallpaper = {
  id: string;
  name: string;
  category: CategoryId;
  /** One-line description shown in the viewer. */
  note: string;
  base: string;
  layers: Layer[];
  scene?: SceneId;
  sceneOptions?: SceneOptions;
  /** Colours the scene paints with, front-most first. */
  palette?: string[];
  /** Film-grain opacity, 0-1. Omit for none. */
  grain?: number;
  /** Raised-grain opacity, 0-1 - the pebbling of hide or worked metal. */
  pebble?: number;
  /** Broad mottling opacity, 0-1 - pigment variation across a panel. */
  mottle?: number;
};

/** Radial blob helper - keeps the aurora recipes readable. */
const blob = (color: string, x: string, y: string, size = "60% 55%"): Layer => ({
  image: `radial-gradient(${size} at ${x} ${y}, ${color}, transparent 70%)`,
});

const AURORA: Wallpaper[] = [
  {
    id: "solar-drift",
    name: "Solar Drift",
    category: "aurora",
    note: "Low amber sun bleeding into rose and deep umber.",
    base: "#140b06",
    grain: 0.05,
    layers: [
      blob("rgba(255,168,58,0.70)", "18%", "78%", "70% 60%"),
      blob("rgba(255,86,74,0.52)", "72%", "22%", "62% 58%"),
      blob("rgba(255,214,150,0.32)", "46%", "52%", "48% 44%"),
      { image: "linear-gradient(200deg, rgba(18,8,4,0.85), rgba(60,20,8,0.15) 55%, rgba(12,5,2,0.9))" },
    ],
  },
  {
    id: "cobalt-bloom",
    name: "Cobalt Bloom",
    category: "aurora",
    note: "Electric cobalt opening into cyan at the edges.",
    base: "#030a1c",
    grain: 0.05,
    layers: [
      blob("rgba(56,130,255,0.72)", "25%", "28%", "66% 62%"),
      blob("rgba(34,224,235,0.45)", "80%", "70%", "58% 54%"),
      blob("rgba(126,86,255,0.38)", "55%", "88%", "70% 50%"),
      { image: "linear-gradient(160deg, rgba(2,6,18,0.7), transparent 45%, rgba(1,4,14,0.92))" },
    ],
  },
  {
    id: "ember-fold",
    name: "Ember Fold",
    category: "aurora",
    note: "Folded heat - crimson creases over near-black.",
    base: "#0c0503",
    grain: 0.06,
    layers: [
      { image: "conic-gradient(from 210deg at 40% 60%, rgba(255,72,38,0.55), rgba(120,12,8,0.1) 35%, rgba(255,140,52,0.45) 62%, rgba(90,8,6,0.1) 88%, rgba(255,72,38,0.55))" },
      blob("rgba(255,108,36,0.55)", "38%", "58%", "52% 48%"),
      blob("rgba(255,40,30,0.30)", "84%", "18%", "46% 46%"),
      { image: "radial-gradient(120% 100% at 50% 50%, transparent 30%, rgba(6,2,1,0.92))" },
    ],
  },
  {
    id: "vapor-trail",
    name: "Vapor Trail",
    category: "aurora",
    note: "Mint and lavender drifting across cold slate.",
    base: "#0a1216",
    grain: 0.05,
    layers: [
      blob("rgba(126,240,206,0.52)", "22%", "36%", "64% 56%"),
      blob("rgba(178,158,255,0.46)", "76%", "62%", "62% 58%"),
      blob("rgba(238,250,246,0.16)", "50%", "18%", "54% 34%"),
      { image: "linear-gradient(190deg, rgba(8,16,20,0.6), transparent 50%, rgba(4,10,14,0.9))" },
    ],
  },
  {
    id: "neon-tide",
    name: "Neon Tide",
    category: "aurora",
    note: "Magenta breaking over a cyan undertow.",
    base: "#0a0320",
    grain: 0.06,
    layers: [
      blob("rgba(255,54,160,0.62)", "72%", "30%", "62% 58%"),
      blob("rgba(20,220,255,0.52)", "24%", "72%", "66% 58%"),
      blob("rgba(120,60,255,0.40)", "50%", "48%", "56% 50%"),
      { image: "linear-gradient(0deg, rgba(4,1,14,0.88), transparent 60%)" },
    ],
  },
  {
    id: "iris-veil",
    name: "Iris Veil",
    category: "aurora",
    note: "Soft violet veils layered over plum.",
    base: "#150a1e",
    grain: 0.04,
    layers: [
      blob("rgba(186,140,255,0.55)", "32%", "26%", "66% 58%"),
      blob("rgba(255,150,206,0.42)", "70%", "74%", "60% 56%"),
      blob("rgba(96,72,200,0.45)", "88%", "22%", "50% 50%"),
      { image: "linear-gradient(140deg, rgba(14,6,22,0.55), transparent 48%, rgba(10,4,18,0.88))" },
    ],
  },
  {
    id: "magma-dusk",
    name: "Magma Dusk",
    category: "aurora",
    note: "Gold fracture running through cooling rock.",
    base: "#0d0a08",
    grain: 0.07,
    layers: [
      { image: "linear-gradient(74deg, transparent 44%, rgba(255,196,84,0.85) 49%, rgba(255,120,40,0.7) 51%, transparent 57%)" },
      blob("rgba(255,142,48,0.45)", "48%", "52%", "58% 52%"),
      blob("rgba(122,32,12,0.55)", "12%", "88%", "60% 54%"),
      { image: "radial-gradient(130% 110% at 50% 50%, transparent 24%, rgba(6,4,3,0.94))" },
    ],
  },
  {
    id: "glacier-wash",
    name: "Glacier Wash",
    category: "aurora",
    note: "Pale ice light washing across brushed steel.",
    base: "#101820",
    grain: 0.05,
    layers: [
      blob("rgba(186,226,255,0.50)", "30%", "22%", "70% 56%"),
      blob("rgba(96,166,214,0.45)", "74%", "68%", "64% 58%"),
      blob("rgba(246,252,255,0.20)", "52%", "44%", "40% 34%"),
      { image: "linear-gradient(200deg, rgba(8,14,20,0.55), transparent 46%, rgba(6,10,16,0.9))" },
    ],
  },
  {
    id: "signal-haze",
    name: "Signal Haze",
    category: "aurora",
    note: "Chartreuse signal burning through forest dark.",
    base: "#060d07",
    grain: 0.06,
    layers: [
      blob("rgba(190,255,72,0.52)", "66%", "34%", "58% 54%"),
      blob("rgba(32,190,120,0.48)", "26%", "70%", "64% 58%"),
      blob("rgba(226,255,180,0.18)", "52%", "50%", "38% 32%"),
      { image: "linear-gradient(170deg, rgba(3,8,4,0.7), transparent 50%, rgba(2,6,3,0.92))" },
    ],
  },
  {
    id: "orchid-static",
    name: "Orchid Static",
    category: "aurora",
    note: "Orchid bloom cut by fine horizontal static.",
    base: "#120618",
    grain: 0.04,
    layers: [
      blob("rgba(236,112,255,0.55)", "38%", "34%", "62% 58%"),
      blob("rgba(112,84,255,0.48)", "74%", "70%", "60% 56%"),
      {
        image: "repeating-linear-gradient(180deg, rgba(255,255,255,0.07) 0 1px, transparent 1px 4px)",
        size: "100% 4px",
      },
      { image: "linear-gradient(0deg, rgba(8,3,12,0.85), transparent 65%)" },
    ],
  },
];

const NATURE: Wallpaper[] = [
  {
    id: "alpine-dawn",
    name: "Alpine Dawn",
    category: "nature",
    note: "First light on a cold ridgeline.",
    base: "#1b1220",
    scene: "peaks",
    palette: ["#0a0710", "#1b1428", "#2e2440", "#4a3a5c"],
    grain: 0.05,
    layers: [
      { image: "linear-gradient(180deg, #2a1a36 0%, #6b3350 42%, #d0714f 72%, #f2ac6b 100%)" },
      blob("rgba(255,214,150,0.55)", "50%", "78%", "44% 30%"),
    ],
  },
  {
    id: "pine-hollow",
    name: "Pine Hollow",
    category: "nature",
    note: "Fog settling between standing pines.",
    base: "#0c1512",
    scene: "pines",
    palette: ["#040806", "#0c1611", "#16241c", "#24382c"],
    grain: 0.06,
    layers: [
      { image: "linear-gradient(180deg, #16231f 0%, #2d4239 48%, #4c6155 100%)" },
      { image: "repeating-linear-gradient(180deg, rgba(220,235,228,0.06) 0 2px, transparent 2px 22px)" },
    ],
  },
  {
    id: "dune-sea",
    name: "Dune Sea",
    category: "nature",
    note: "Wind-cut sand under a bleached sky.",
    base: "#2a1c10",
    scene: "dunes",
    palette: ["#241708", "#3d2712", "#5e3e1d", "#8a5e2d"],
    grain: 0.07,
    layers: [
      { image: "linear-gradient(180deg, #c99a52 0%, #e6bd7e 36%, #f2d6a4 62%, #d9a862 100%)" },
      blob("rgba(255,244,214,0.6)", "70%", "26%", "36% 30%"),
    ],
  },
  {
    id: "tide-line",
    name: "Tide Line",
    category: "nature",
    note: "Long swell rolling into a green sea.",
    base: "#04161c",
    scene: "waves",
    palette: ["#02282f", "#06414a", "#0a5b66", "#1c7c85"],
    grain: 0.05,
    layers: [
      { image: "linear-gradient(180deg, #0a2c36 0%, #114550 44%, #18606b 100%)" },
      blob("rgba(180,244,238,0.30)", "50%", "14%", "60% 26%"),
    ],
  },
  {
    id: "canyon-cut",
    name: "Canyon Cut",
    category: "nature",
    note: "Sheer ochre walls stepping into shadow.",
    base: "#1d0d07",
    scene: "canyon",
    palette: ["#1a0a05", "#3a160b", "#6b2a12", "#a1441d"],
    grain: 0.07,
    layers: [{ image: "linear-gradient(180deg, #e08a48 0%, #b7562a 40%, #6d2d16 78%, #300f07 100%)" }],
  },
  {
    id: "valley-fog",
    name: "Valley Fog",
    category: "nature",
    note: "Ridges fading back through layered haze.",
    base: "#161d24",
    scene: "ridges",
    palette: ["#0e141a", "#1b2630", "#293846", "#3a4c5c", "#4e6274"],
    grain: 0.05,
    layers: [
      { image: "linear-gradient(180deg, #37495a 0%, #5b7182 50%, #8ea3b2 100%)" },
      { image: "linear-gradient(0deg, rgba(190,210,222,0.35), transparent 55%)" },
    ],
  },
  {
    id: "lake-mirror",
    name: "Lake Mirror",
    category: "nature",
    note: "A still lake holding the range upside down.",
    base: "#140f22",
    scene: "peaks",
    sceneOptions: { mirror: true },
    palette: ["#0a0716", "#171029", "#261c3e", "#3a2c55"],
    grain: 0.05,
    layers: [
      { image: "linear-gradient(180deg, #241a3c 0%, #4b3363 38%, #8a5a78 58%, #241a3c 100%)" },
      blob("rgba(255,196,180,0.35)", "50%", "50%", "40% 22%"),
    ],
  },
  {
    id: "boreal-veil",
    name: "Boreal Veil",
    category: "nature",
    note: "Northern light hanging over a black tree line.",
    base: "#030812",
    scene: "pines",
    palette: ["#01050b", "#040a14", "#07101d", "#0b1826"],
    grain: 0.06,
    layers: [
      blob("rgba(72,255,178,0.45)", "34%", "30%", "62% 46%"),
      blob("rgba(130,110,255,0.40)", "72%", "22%", "54% 42%"),
      { image: "linear-gradient(180deg, #050d1a 0%, #0a1930 55%, #123048 100%)" },
    ],
  },
  {
    id: "slate-range",
    name: "Slate Range",
    category: "nature",
    note: "Cold slate ridges under a low gold horizon.",
    base: "#0f1418",
    scene: "peaks",
    sceneOptions: { scale: 0.7 },
    palette: ["#080c0f", "#121a20", "#1e2a33", "#2e3f4b"],
    grain: 0.05,
    layers: [
      { image: "linear-gradient(180deg, #24313c 0%, #56606a 40%, #c79658 78%, #f0c98a 100%)" },
      blob("rgba(255,226,170,0.55)", "26%", "82%", "40% 26%"),
    ],
  },
  {
    id: "moss-rain",
    name: "Moss Rain",
    category: "nature",
    note: "Steady rain over deep moss green.",
    base: "#070f0a",
    scene: "pines",
    sceneOptions: { scale: 1.15 },
    palette: ["#030704", "#071009", "#0c1a10", "#12281a"],
    grain: 0.07,
    layers: [
      { image: "linear-gradient(180deg, #16281c 0%, #223a28 52%, #33523a 100%)" },
      {
        image: "repeating-linear-gradient(255deg, rgba(200,230,210,0.10) 0 1px, transparent 1px 9px)",
      },
    ],
  },
];

/**
 * Hide and cloth need texture at two scales at once: a tight pebble lattice for the
 * grain, and broad mottling for the pigment. Two pebble layers at different cell
 * sizes interfere with each other, which stops the lattice reading as a regular grid.
 */
const LEATHER: Wallpaper[] = [
  {
    id: "saddle-tan",
    name: "Saddle Tan",
    category: "leather",
    note: "Full-grain hide, warm and broken in.",
    base: "#6b3f1d",
    grain: 0.16,
    mottle: 0.6,
    pebble: 0.55,
    layers: [
      { image: "radial-gradient(120% 92% at 46% 36%, rgba(196,124,60,0.95), rgba(66,36,14,0.98))" },
      { image: "radial-gradient(135% 115% at 50% 50%, transparent 32%, rgba(24,12,4,0.72))" },
    ],
  },
  {
    id: "oxblood",
    name: "Oxblood",
    category: "leather",
    note: "Deep burgundy hide with a waxed shine.",
    base: "#3a0d12",
    grain: 0.15,
    mottle: 0.58,
    pebble: 0.5,
    layers: [
      { image: "linear-gradient(118deg, rgba(255,170,160,0.14), transparent 40%)" },
      { image: "radial-gradient(112% 92% at 42% 32%, rgba(150,30,42,0.95), rgba(32,6,10,0.99))" },
    ],
  },
  {
    id: "black-carbon",
    name: "Black Carbon",
    category: "leather",
    note: "Woven carbon fibre under a hard key light.",
    base: "#0b0c0e",
    grain: 0.07,
    layers: [
      {
        image: "repeating-linear-gradient(45deg, #24282e 0 6px, #0d0f12 6px 12px)",
        size: "24px 24px",
      },
      {
        image: "repeating-linear-gradient(-45deg, rgba(255,255,255,0.09) 0 6px, transparent 6px 12px)",
        size: "24px 24px",
      },
      { image: "linear-gradient(122deg, rgba(200,222,245,0.26), transparent 42%)" },
      { image: "radial-gradient(125% 100% at 46% 40%, transparent 24%, rgba(0,0,0,0.72))" },
    ],
  },
  {
    id: "gunmetal",
    name: "Gunmetal",
    category: "leather",
    note: "Brushed steel, directional and cold.",
    base: "#23272c",
    grain: 0.09,
    mottle: 0.2,
    pebble: 0.26,
    layers: [
      {
        image: "repeating-linear-gradient(92deg, rgba(255,255,255,0.075) 0 1px, transparent 1px 3px, rgba(0,0,0,0.10) 3px 4px)",
      },
      { image: "linear-gradient(100deg, #545b63 0%, #23282e 34%, #656d76 52%, #1b1f24 74%, #434a52 100%)" },
      { image: "radial-gradient(125% 100% at 50% 38%, transparent 28%, rgba(0,0,0,0.62))" },
    ],
  },
  {
    id: "walnut-grain",
    name: "Walnut Grain",
    category: "leather",
    note: "Quarter-sawn walnut, oiled.",
    base: "#2f1c10",
    grain: 0.11,
    mottle: 0.45,
    pebble: 0.3,
    layers: [
      {
        image: "repeating-linear-gradient(88deg, rgba(0,0,0,0.38) 0 2px, rgba(140,86,42,0.18) 2px 5px, transparent 5px 13px)",
      },
      {
        image: "repeating-linear-gradient(91deg, rgba(220,158,94,0.20) 0 1px, transparent 1px 21px)",
      },
      { image: "linear-gradient(97deg, #794c27 0%, #38200f 40%, #8a582c 68%, #2a170a 100%)" },
      { image: "radial-gradient(132% 112% at 50% 50%, transparent 34%, rgba(16,8,3,0.72))" },
    ],
  },
  {
    id: "tobacco-suede",
    name: "Tobacco Suede",
    category: "leather",
    note: "Brushed nap that changes with the light.",
    base: "#4a3016",
    grain: 0.2,
    mottle: 0.5,
    pebble: 0.4,
    layers: [
      { image: "repeating-linear-gradient(74deg, rgba(255,220,168,0.11) 0 2px, transparent 2px 5px)" },
      { image: "repeating-linear-gradient(-68deg, rgba(0,0,0,0.18) 0 3px, transparent 3px 7px)" },
      { image: "radial-gradient(122% 100% at 58% 28%, rgba(174,122,64,0.92), rgba(44,26,10,0.97))" },
      { image: "radial-gradient(132% 112% at 50% 50%, transparent 30%, rgba(20,10,4,0.7))" },
    ],
  },
  {
    id: "denim-twill",
    name: "Denim Twill",
    category: "leather",
    note: "Raw selvedge twill, indigo on ecru.",
    base: "#17253d",
    grain: 0.14,
    mottle: 0.34,
    layers: [
      {
        image: "repeating-linear-gradient(62deg, rgba(232,240,252,0.22) 0 1px, transparent 1px 4px)",
        size: "7px 7px",
      },
      {
        image: "repeating-linear-gradient(152deg, rgba(0,0,0,0.28) 0 1px, transparent 1px 3px)",
        size: "6px 6px",
      },
      { image: "linear-gradient(160deg, #2a4268 0%, #14223a 55%, #0d1729 100%)" },
      { image: "radial-gradient(132% 112% at 50% 44%, transparent 32%, rgba(4,8,16,0.68))" },
    ],
  },
  {
    id: "waxed-canvas",
    name: "Waxed Canvas",
    category: "leather",
    note: "Field-tan canvas with a wax sheen.",
    base: "#3d3a22",
    grain: 0.17,
    mottle: 0.44,
    pebble: 0.34,
    layers: [
      {
        image: "repeating-linear-gradient(0deg, rgba(0,0,0,0.26) 0 1px, transparent 1px 4px)",
        size: "8px 8px",
      },
      {
        image: "repeating-linear-gradient(90deg, rgba(0,0,0,0.26) 0 1px, transparent 1px 4px)",
        size: "8px 8px",
      },
      { image: "linear-gradient(130deg, #79713f 0%, #453f22 48%, #6a6136 100%)" },
      { image: "linear-gradient(120deg, rgba(255,248,206,0.18), transparent 46%)" },
    ],
  },
  {
    id: "cognac-stitch",
    name: "Cognac Stitch",
    category: "leather",
    note: "Cognac panel with a contrast saddle stitch.",
    base: "#5c2f14",
    grain: 0.15,
    mottle: 0.56,
    pebble: 0.52,
    layers: [
      {
        image: "repeating-linear-gradient(90deg, transparent 0 14px, rgba(244,220,178,0.9) 14px 24px, transparent 24px 38px)",
        size: "100% 4px",
        position: "center 20%",
        repeat: "no-repeat",
      },
      {
        image: "repeating-linear-gradient(90deg, transparent 0 14px, rgba(244,220,178,0.9) 14px 24px, transparent 24px 38px)",
        size: "100% 4px",
        position: "center 80%",
        repeat: "no-repeat",
      },
      { image: "radial-gradient(122% 100% at 48% 38%, rgba(192,106,46,0.95), rgba(54,24,10,0.98))" },
    ],
  },
  {
    id: "forged-iron",
    name: "Forged Iron",
    category: "leather",
    note: "Hammered iron, still holding heat.",
    base: "#141414",
    grain: 0.13,
    mottle: 0.6,
    pebble: 0.6,
    layers: [
      { image: "linear-gradient(140deg, #3d4147 0%, #101112 46%, #2f3238 100%)" },
      { image: "radial-gradient(122% 100% at 50% 44%, transparent 22%, rgba(0,0,0,0.8))" },
    ],
  },
];

const MONO: Wallpaper[] = [
  {
    id: "vanguard",
    name: "Vanguard",
    category: "mono",
    note: "A single armoured helm lit from one side.",
    base: "#050505",
    scene: "helmet",
    palette: ["#f4f4f4", "#b8b8b8", "#1a1a1a"],
    grain: 0.08,
    layers: [
      { image: "radial-gradient(70% 60% at 50% 42%, rgba(255,255,255,0.14), transparent 70%)" },
      { image: "linear-gradient(0deg, #000 0%, #0b0b0b 60%, #141414 100%)" },
    ],
  },
  {
    id: "sentry-row",
    name: "Sentry Row",
    category: "mono",
    note: "Three helms in formation, identical.",
    base: "#060606",
    scene: "helmet",
    sceneOptions: { count: 3, scale: 0.52 },
    palette: ["#ededed", "#9a9a9a", "#141414"],
    grain: 0.08,
    layers: [
      { image: "radial-gradient(90% 70% at 50% 46%, rgba(255,255,255,0.11), transparent 72%)" },
      { image: "linear-gradient(0deg, #000 0%, #0a0a0a 70%, #111 100%)" },
    ],
  },
  {
    id: "helm-close",
    name: "Helm Close",
    category: "mono",
    note: "Cropped hard - the visor fills the frame.",
    base: "#040404",
    scene: "helmet",
    sceneOptions: { scale: 2.1 },
    palette: ["#fafafa", "#8e8e8e", "#0d0d0d"],
    grain: 0.09,
    layers: [
      { image: "radial-gradient(60% 55% at 38% 40%, rgba(255,255,255,0.18), transparent 68%)" },
      { image: "linear-gradient(115deg, #161616 0%, #000 58%)" },
    ],
  },
  {
    id: "corridor",
    name: "Corridor",
    category: "mono",
    note: "One-point perspective down a white corridor.",
    base: "#000000",
    scene: "corridor",
    palette: ["#f2f2f2", "#8c8c8c", "#161616"],
    grain: 0.07,
    layers: [
      { image: "radial-gradient(40% 40% at 50% 50%, rgba(255,255,255,0.34), transparent 72%)" },
      { image: "linear-gradient(0deg, #000, #0a0a0a)" },
    ],
  },
  {
    id: "slat-light",
    name: "Slat Light",
    category: "mono",
    note: "Hard blind-light thrown across an empty wall.",
    base: "#0a0a0a",
    scene: "slats",
    palette: ["#ffffff", "#c9c9c9", "#101010"],
    grain: 0.08,
    layers: [{ image: "linear-gradient(118deg, #1c1c1c 0%, #050505 62%)" }],
  },
  {
    id: "halftone-moon",
    name: "Halftone Moon",
    category: "mono",
    note: "A full disc rendered as newsprint dots.",
    base: "#0a0a0a",
    scene: "halftone",
    palette: ["#ffffff", "#9d9d9d", "#0a0a0a"],
    grain: 0.06,
    layers: [{ image: "radial-gradient(90% 80% at 50% 45%, #1a1a1a, #030303 72%)" }],
  },
  {
    id: "white-dune",
    name: "White Dune",
    category: "mono",
    note: "Gypsum dunes with the colour taken out.",
    base: "#111111",
    scene: "dunes",
    palette: ["#0c0c0c", "#2a2a2a", "#585858", "#8e8e8e"],
    grain: 0.08,
    layers: [{ image: "linear-gradient(180deg, #d8d8d8 0%, #f2f2f2 40%, #b4b4b4 100%)" }],
  },
  {
    id: "eclipse",
    name: "Eclipse",
    category: "mono",
    note: "A ring of light around a solid black disc.",
    base: "#000000",
    scene: "ring",
    palette: ["#ffffff", "#8a8a8a", "#000000"],
    grain: 0.07,
    layers: [{ image: "radial-gradient(75% 65% at 50% 48%, #1e1e1e, #000 66%)" }],
  },
  {
    id: "grid-horizon",
    name: "Grid Horizon",
    category: "mono",
    note: "A perspective grid running to a flat horizon.",
    base: "#050505",
    scene: "grid",
    palette: ["#ececec", "#6e6e6e", "#0a0a0a"],
    grain: 0.07,
    layers: [
      { image: "linear-gradient(0deg, #000 0%, #101010 52%, #060606 53%, #1b1b1b 100%)" },
    ],
  },
  {
    id: "smoke-bands",
    name: "Smoke Bands",
    category: "mono",
    note: "Slow smoke banded by a shuttered window.",
    base: "#0b0b0b",
    grain: 0.1,
    layers: [
      blob("rgba(255,255,255,0.22)", "30%", "34%", "58% 46%"),
      blob("rgba(255,255,255,0.13)", "72%", "66%", "54% 44%"),
      {
        image: "repeating-linear-gradient(174deg, rgba(0,0,0,0.88) 0 30px, transparent 30px 62px)",
      },
      { image: "radial-gradient(120% 100% at 50% 50%, transparent 24%, rgba(0,0,0,0.88))" },
    ],
  },
];

export const WALLPAPERS: Wallpaper[] = [...AURORA, ...NATURE, ...LEATHER, ...MONO];

const BY_ID = new Map(WALLPAPERS.map((w) => [w.id, w]));

export function getWallpaper(id: string): Wallpaper | undefined {
  return BY_ID.get(id);
}

export function wallpapersIn(category: CategoryId): Wallpaper[] {
  return WALLPAPERS.filter((w) => w.category === category);
}

/** Catalogue index of a wallpaper, 1-based - used for the contact-sheet numbering. */
export function indexOf(id: string): number {
  return WALLPAPERS.findIndex((w) => w.id === id) + 1;
}
