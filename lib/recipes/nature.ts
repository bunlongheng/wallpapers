/**
 * Landscape scenes: ridgelines, tree cover, dunes, tide and a slot canyon.
 */

import { blob, type Recipe } from "./types";

export const NATURE: Recipe[] = [
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
