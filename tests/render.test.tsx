import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Scene } from "@/components/Scene";
import { Wallpaper } from "@/components/Wallpaper";
import { WALLPAPERS, type SceneId } from "@/lib/wallpapers";

/** Split a CSS value list on its top-level commas, ignoring the ones inside gradients. */
function topLevelParts(value: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = "";
  for (const ch of value) {
    if (ch === "(") depth++;
    else if (ch === ")") depth--;
    if (ch === "," && depth === 0) {
      parts.push(current.trim());
      current = "";
      continue;
    }
    current += ch;
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

function styleOf(markup: string): Record<string, string> {
  const raw = /style="([^"]*)"/.exec(markup)?.[1] ?? "";
  const decoded = raw.replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&#x27;/g, "'");
  const out: Record<string, string> = {};
  let depth = 0;
  let current = "";
  for (const ch of decoded) {
    if (ch === "(") depth++;
    else if (ch === ")") depth--;
    if (ch === ";" && depth === 0) {
      const [k, ...v] = current.split(":");
      if (k) out[k.trim()] = v.join(":").trim();
      current = "";
      continue;
    }
    current += ch;
  }
  const [k, ...v] = current.split(":");
  if (k?.trim()) out[k.trim()] = v.join(":").trim();
  return out;
}

const BACKGROUND_LISTS = [
  "background-image",
  "background-size",
  "background-position",
  "background-repeat",
] as const;

describe("Wallpaper renders a usable layer stack", () => {
  // The four background-* lists are built in parallel from the same layers array. If any
  // one of them comes out a different length the browser cycles it and every layer after
  // the mismatch is painted with the wrong size, position or repeat - silently.
  it.each(WALLPAPERS.map((w) => [w.id, w] as const))("%s keeps all four lists aligned", (_id, w) => {
    const style = styleOf(renderToStaticMarkup(<Wallpaper w={w} />));
    for (const prop of BACKGROUND_LISTS) {
      expect(style[prop], `${w.id} is missing ${prop}`).toBeDefined();
      expect(topLevelParts(style[prop]!), `${w.id} ${prop}`).toHaveLength(w.layers.length);
    }
    expect(style["background-color"]).toBe(w.base);
  });

  it("renders one overlay div per declared texture", () => {
    for (const w of WALLPAPERS) {
      const markup = renderToStaticMarkup(<Wallpaper w={w} />);
      const expected = [w.grain, w.pebble, w.mottle].filter((o) => o !== undefined).length;
      const overlays = markup.match(/class="(grain|pebble|mottle) /g) ?? [];
      expect(overlays, w.id).toHaveLength(expected);
    }
  });
});

describe("Scenes", () => {
  const SCENE_IDS: SceneId[] = [
    "peaks",
    "ridges",
    "pines",
    "dunes",
    "waves",
    "canyon",
    "helmet",
    "corridor",
    "slats",
    "halftone",
    "ring",
    "grid",
  ];

  it.each(SCENE_IDS)("%s draws with a short or a long palette", (id) => {
    for (const palette of [["#ffffff"], ["#111", "#444", "#888", "#ccc"], Array(8).fill("#123456")]) {
      const markup = renderToStaticMarkup(<Scene id={id} palette={palette} uid="t" />);
      expect(markup).toContain("<svg");
      expect(markup).toContain('aria-hidden="true"');
      expect(markup.length).toBeGreaterThan(120);
    }
  });

  it("is deterministic - the same input renders byte-identical markup", () => {
    for (const id of SCENE_IDS) {
      const once = renderToStaticMarkup(<Scene id={id} palette={["#111", "#444"]} uid="t" />);
      const twice = renderToStaticMarkup(<Scene id={id} palette={["#111", "#444"]} uid="t" />);
      expect(twice, id).toBe(once);
    }
  });

  it("is reachable - every scene in the registry is used by at least one wallpaper", () => {
    const used = new Set(WALLPAPERS.map((w) => w.scene).filter(Boolean));
    expect([...SCENE_IDS].filter((id) => !used.has(id))).toEqual([]);
  });

  // `mirror` is only honoured by peaks and `count` only by helmet, so setting either on
  // another scene is a silent no-op. Catch that here rather than in a screenshot.
  it("has no recipe setting a scene option its scene ignores", () => {
    for (const w of WALLPAPERS) {
      if (!w.sceneOptions) continue;
      if (w.sceneOptions.mirror !== undefined) expect(w.scene, w.id).toBe("peaks");
      if (w.sceneOptions.count !== undefined) expect(w.scene, w.id).toBe("helmet");
      if (w.sceneOptions.scale !== undefined) {
        expect(["peaks", "ridges", "pines", "dunes", "waves", "canyon", "helmet"], w.id).toContain(
          w.scene,
        );
      }
    }
  });
});

describe("the whole index", () => {
  it("emits no duplicate SVG ids across all 40 plates", () => {
    const markup = WALLPAPERS.map((w) => renderToStaticMarkup(<Wallpaper w={w} />)).join("");
    const ids = [...markup.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]!);
    expect(new Set(ids).size, `duplicate ids: ${ids.join(", ")}`).toBe(ids.length);
  });
});
