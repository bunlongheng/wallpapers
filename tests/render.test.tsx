import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Scene } from "@/components/Scene";
import { Wallpaper } from "@/components/Wallpaper";
import { WALLPAPERS, type Recipe, type SceneId } from "@/lib/wallpapers";

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

  // Which scene reads which option is now a compile-time guarantee (the SceneFields
  // union in lib/wallpapers.ts), so these are type assertions rather than runtime ones.
  it("rejects a scene option the scene ignores, at compile time", () => {
    // @ts-expect-error - `ring` is a flat scene and accepts no options at all
    const badOption: Recipe = { ...WALLPAPERS[0]!, scene: "ring", palette: ["#fff"], sceneOptions: { scale: 2 } };
    // @ts-expect-error - `mirror` belongs to peaks, not pines
    const badMirror: Recipe = { ...WALLPAPERS[0]!, scene: "pines", palette: ["#fff"], sceneOptions: { mirror: true } };
    // @ts-expect-error - a scene cannot be declared without the palette it paints with
    const noPalette: Recipe = { ...WALLPAPERS[0]!, scene: "peaks" };
    expect([badOption, badMirror, noPalette]).toHaveLength(3);
  });

});

describe("untrusted-looking text", () => {
  // Recipe text is author-controlled today, but this pins the guarantee that it is
  // escaped rather than interpolated, so a future data source cannot inject markup.
  it("is escaped, never interpolated as markup", () => {
    const hostile = '<img src=x onerror=alert(1)> & "quoted"';
    const markup = renderToStaticMarkup(
      <Wallpaper w={{ ...WALLPAPERS[0]!, name: hostile, note: hostile }} />,
    );
    expect(markup).not.toContain("<img");
    expect(markup).not.toContain("onerror");
  });
});

describe("the whole index", () => {
  it("emits no duplicate SVG ids across all 40 plates", () => {
    const markup = WALLPAPERS.map((w) => renderToStaticMarkup(<Wallpaper w={w} />)).join("");
    const ids = [...markup.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]!);
    expect(new Set(ids).size, `duplicate ids: ${ids.join(", ")}`).toBe(ids.length);
  });
});
