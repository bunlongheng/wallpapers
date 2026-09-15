import type { CSSProperties } from "react";
import type { Wallpaper as WallpaperDef } from "@/lib/wallpapers";
import { Scene } from "./Scene";

/**
 * Paints one wallpaper recipe. The CSS layer stack is built as four parallel
 * comma-lists, which is why `Layer.image` is required to hold exactly one gradient.
 */
export function Wallpaper({ w, className = "" }: { w: WallpaperDef; className?: string }) {
  const style: CSSProperties = {
    backgroundColor: w.base,
    backgroundImage: w.layers.map((l) => l.image).join(", "),
    backgroundSize: w.layers.map((l) => l.size ?? "cover").join(", "),
    backgroundPosition: w.layers.map((l) => l.position ?? "center").join(", "),
    backgroundRepeat: w.layers.map((l) => l.repeat ?? (l.size ? "repeat" : "no-repeat")).join(", "),
  };

  return (
    <div className={`relative isolate overflow-hidden ${className}`} style={style}>
      {w.scene && w.palette && (
        <Scene id={w.scene} palette={w.palette} options={w.sceneOptions} uid={w.id} />
      )}
      {w.mottle !== undefined && (
        <div className="mottle absolute inset-0" style={{ opacity: w.mottle }} aria-hidden="true" />
      )}
      {w.pebble !== undefined && (
        <div className="pebble absolute inset-0" style={{ opacity: w.pebble }} aria-hidden="true" />
      )}
      {w.grain !== undefined && (
        <div className="grain absolute inset-0" style={{ opacity: w.grain }} aria-hidden="true" />
      )}
    </div>
  );
}
