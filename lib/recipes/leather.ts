/**
 * Worked materials. Hide and cloth need texture at two scales at once: a tight
 * pebble lattice for the grain and broad mottling for the pigment.
 */

import { vignette, type Recipe } from "./types";

export const LEATHER: Recipe[] = [
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
      vignette("rgba(24,12,4,0.72)", "32%", "135% 115%"),
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
      vignette("rgba(0,0,0,0.72)", "24%", "125% 100%", "46% 40%"),
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
      vignette("rgba(0,0,0,0.62)", "28%", "125% 100%", "50% 38%"),
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
      vignette("rgba(16,8,3,0.72)", "34%", "132% 112%"),
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
      vignette("rgba(20,10,4,0.7)", "30%", "132% 112%"),
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
      vignette("rgba(4,8,16,0.68)", "32%", "132% 112%", "50% 44%"),
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
    id: "pitch-hide",
    name: "Pitch Hide",
    category: "leather",
    note: "Black hide, all grain and no colour.",
    base: "#0e0c0b",
    grain: 0.16,
    mottle: 0.5,
    pebble: 0.58,
    layers: [
      { image: "linear-gradient(122deg, rgba(255,255,255,0.10), transparent 40%)" },
      { image: "radial-gradient(120% 96% at 44% 34%, rgba(64,58,54,0.95), rgba(10,9,8,0.99))" },
      vignette("rgba(0,0,0,0.78)", "30%", "132% 112%"),
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
      vignette("rgba(0,0,0,0.8)", "22%", "122% 100%", "50% 44%"),
    ],
  },
];
