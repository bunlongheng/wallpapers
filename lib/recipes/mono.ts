/**
 * High-contrast black and white - part cinema, part poster. The first three are
 * graphic-design pieces built purely from gradient hard-stops: a form, a split and
 * a sweep.
 */

import { blob, vignette, type Recipe } from "./types";

export const MONO: Recipe[] = [
  {
    id: "gradation",
    name: "Gradation",
    category: "mono",
    note: "A tonal scale, posterised into hard steps.",
    base: "#0b0b0b",
    grain: 0.07,
    layers: [
      { image: "radial-gradient(62% 52% at 28% 30%, rgba(255,255,255,0.16), transparent 72%)" },
      {
        image:
          "linear-gradient(100deg, #f7f7f7 0 12%, #cfcfcf 12% 26%, #a2a2a2 26% 40%, #767676 40% 55%, #4c4c4c 55% 70%, #292929 70% 85%, #0b0b0b 85% 100%)",
      },
    ],
  },
  {
    id: "split-field",
    name: "Split Field",
    category: "mono",
    note: "A hard diagonal cut, with a gradient running either side of it.",
    base: "#0a0a0a",
    grain: 0.06,
    layers: [
      { image: "linear-gradient(118deg, transparent 0 49.7%, #ffffff 49.7% 50.1%, transparent 50.1%)" },
      { image: "linear-gradient(118deg, #f7f7f7 0%, #8e8e8e 49.9%, #0e0e0e 50%, #3c3c3c 100%)" },
    ],
  },
  {
    id: "arc-sweep",
    name: "Arc Sweep",
    category: "mono",
    note: "A single conic sweep from white through black and back.",
    base: "#080808",
    grain: 0.07,
    layers: [
      { image: "radial-gradient(38% 34% at 50% 52%, rgba(255,255,255,0.35), transparent 70%)" },
      {
        image:
          "conic-gradient(from 204deg at 50% 52%, #f6f6f6, #141414 30%, #dcdcdc 56%, #0a0a0a 82%, #f6f6f6)",
      },
      vignette("rgba(0,0,0,0.82)", "34%", "128% 108%"),
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
      vignette("rgba(0,0,0,0.88)", "24%", "120% 100%"),
    ],
  },
];
