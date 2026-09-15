"use client";

import { useEffect, useState } from "react";
import { Wallpaper } from "@/components/Wallpaper";
import { CATEGORIES, type CategoryId } from "@/lib/categories";
import { WALLPAPERS, wallpapersIn } from "@/lib/wallpapers";

/** How long each plate is held before the next one fades in. */
const HOLD_MS = 3000;

const isCategory = (v: string | null): v is CategoryId => CATEGORIES.some((c) => c.id === v);

/**
 * Full-bleed rotating wallpaper, for embedding as a backdrop.
 *
 *   /?demo=true                 every plate, in catalogue order
 *   /?demo=true&theme=nature    one category only
 *
 * Loaded lazily, so the forty recipes only reach the browser in demo mode and a normal
 * visit to the index still ships none of them.
 */
export default function DemoMode({ theme }: { theme: string | null }) {
  const plates = isCategory(theme) ? wallpapersIn(theme) : WALLPAPERS;
  const [at, setAt] = useState(0);

  // Take the page over: an embedded backdrop should not also lay out the whole grid.
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.demo = "on";
    return () => {
      delete root.dataset.demo;
    };
  }, []);

  useEffect(() => {
    if (plates.length < 2) return;
    const tick = setInterval(() => setAt((i) => (i + 1) % plates.length), HOLD_MS);
    return () => clearInterval(tick);
  }, [plates.length]);

  return (
    <div className="fixed inset-0 z-50 bg-black" aria-hidden="true">
      {/*
        The wrapper does the stacking, not the Wallpaper. Wallpaper sets `relative` on
        its own root, and a utility cannot be overridden by another utility from the
        class list - so positioning it from here would leave the plates stacked
        vertically instead of on top of each other.
      */}
      {plates.map((w, i) => (
        <div
          key={w.id}
          className={`demo-plate absolute inset-0${i === at ? " is-on" : ""}`}
        >
          <Wallpaper w={w} className="h-full w-full" />
        </div>
      ))}
    </div>
  );
}
