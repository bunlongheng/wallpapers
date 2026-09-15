import type { SceneId, SceneOptions } from "@/lib/wallpapers";

/**
 * Scenes are plain SVG geometry - no filters, no images, no randomness at runtime.
 * Everything is deterministic so a build is reproducible and forty scenes can be
 * prerendered once, and a scene stays cheap enough that they can share one page.
 */

const W = 1600;
const H = 900;

/** Front-most palette entry first; falls back to the last entry, then to white. */
const at = (palette: string[], i: number): string =>
  palette[i] ?? palette[palette.length - 1] ?? "#ffffff";

/** Stable hash-noise in 0..1 - a seeded stand-in for Math.random(). */
const noise = (i: number): number => {
  const x = Math.sin(i * 12.9898 + 4.1414) * 43758.5453;
  return x - Math.floor(x);
};

/** Path coordinates are rounded - a viewBox unit is well under a pixel on screen. */
const r = (n: number): string => (Math.round(n * 10) / 10).toString();

/** Keeps the bottom edge pinned while squashing a scene's height. */
const squash = (scale = 1): string | undefined =>
  scale === 1 ? undefined : `matrix(1,0,0,${scale},0,${H * (1 - scale)})`;

const RANGES = [
  "0,540 170,410 300,478 470,338 610,462 770,366 930,476 1090,400 1250,486 1410,416 1600,506",
  "0,624 150,520 320,592 480,462 640,568 800,486 980,590 1140,512 1320,596 1470,528 1600,606",
  "0,712 180,628 340,690 520,586 690,672 860,604 1040,688 1210,620 1390,700 1520,648 1600,706",
] as const;

function Peaks({ palette, options, uid }: SceneProps) {
  const mirror = options?.mirror ?? false;
  const horizon = 620;
  const body = (
    <g transform={squash(options?.scale)}>
      {RANGES.map((pts, i) => (
        <polygon key={i} points={`${pts} ${W},${H} 0,${H}`} fill={at(palette, RANGES.length - i)} />
      ))}
      <polygon points={`0,780 260,742 600,772 960,738 1320,776 ${W},748 ${W},${H} 0,${H}`} fill={at(palette, 0)} />
    </g>
  );

  if (!mirror) return body;

  // Squeeze the whole range into the sky half so its base sits exactly on the
  // waterline, then flip a copy of it below - that is what makes a reflection read.
  const fit = `scale(1,${horizon / H})`;
  return (
    <>
      <g transform={fit}>{body}</g>
      <g clipPath={`url(#${uid}-below)`}>
        <g transform={`matrix(1,0,0,-1,0,${horizon * 2})`} opacity={0.72}>
          <g transform={fit}>{body}</g>
        </g>
        <rect x={0} y={horizon} width={W} height={H - horizon} fill={at(palette, 0)} opacity={0.1} />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect
            key={i}
            x={0}
            y={horizon + 24 + i * 52}
            width={W}
            height={3}
            fill="#ffffff"
            opacity={0.1}
          />
        ))}
      </g>
      <defs>
        <clipPath id={`${uid}-below`}>
          <rect x={0} y={horizon} width={W} height={H - horizon} />
        </clipPath>
      </defs>
    </>
  );
}

/**
 * One row of conifer silhouettes plus the ground they stand on. Wide steps and a
 * large height variance are what stop a row reading as a comb.
 */
function pineRow(baseY: number, height: number, step: number, seed: number): string {
  let d = `M0,${H} L0,${baseY}`;
  for (let x = -step; x < W + step; x += step) {
    const h = height * (0.5 + noise(seed + x) * 0.85);
    const half = step * (0.4 + noise(seed + x + 7) * 0.14);
    const lean = (noise(seed + x + 13) - 0.5) * step * 0.22;
    const mid = x + step / 2;
    d += ` L${r(mid - half)},${baseY} L${r(mid + lean)},${r(baseY - h)} L${r(mid + half)},${baseY}`;
  }
  return `${d} L${W},${baseY} L${W},${H} Z`;
}

function Pines({ palette, options }: SceneProps) {
  const rows = [
    { y: 570, h: 130, step: 92, seed: 11 },
    { y: 690, h: 210, step: 134, seed: 37 },
    { y: 830, h: 330, step: 196, seed: 71 },
  ];
  return (
    <g transform={squash(options?.scale)}>
      {rows.map((row, i) => (
        <path key={row.seed} d={pineRow(row.y, row.h, row.step, row.seed)} fill={at(palette, rows.length - 1 - i)} />
      ))}
    </g>
  );
}

/** Smooth wind-cut curves. Callers stroke the same path again for the lit ridge. */
function duneBand(baseY: number, amp: number, phase: number): string {
  let d = `M0,${r(baseY + Math.sin(phase) * amp)}`;
  for (let x = 0; x <= W; x += 200) {
    const y = baseY + Math.sin(phase + x / 260) * amp;
    const cy = baseY + Math.sin(phase + (x + 100) / 210) * amp * 1.5;
    d += ` Q${x + 100},${r(cy)} ${x + 200},${r(y)}`;
  }
  return d;
}

function Dunes({ palette, options }: SceneProps) {
  const bands = [
    { y: 470, amp: 44, phase: 0.4 },
    { y: 585, amp: 56, phase: 2.1 },
    { y: 700, amp: 48, phase: 3.9 },
    { y: 815, amp: 38, phase: 5.2 },
  ];
  return (
    <g transform={squash(options?.scale)}>
      {bands.map((b, i) => (
        <g key={b.y}>
          <path d={`${duneBand(b.y, b.amp, b.phase)} L${W},${H} L0,${H} Z`} fill={at(palette, bands.length - 1 - i)} />
          <path
            d={duneBand(b.y, b.amp, b.phase)}
            fill="none"
            stroke="#ffffff"
            strokeOpacity={0.16}
            strokeWidth={2}
          />
        </g>
      ))}
    </g>
  );
}

function Waves({ palette, options }: SceneProps) {
  const rows = [420, 500, 580, 660, 745, 835];
  return (
    <g transform={squash(options?.scale)}>
      {rows.map((y, i) => (
        <g key={y}>
          <path
            d={`${duneBand(y, 14 + i * 4, i * 1.7)} L${W},${H} L0,${H} Z`}
            fill={at(palette, rows.length - 1 - i)}
            opacity={0.92}
          />
          <path
            d={duneBand(y, 14 + i * 4, i * 1.7)}
            fill="none"
            stroke="#e8fbff"
            strokeOpacity={0.12 + i * 0.05}
            strokeWidth={2 + i * 0.6}
          />
        </g>
      ))}
    </g>
  );
}

/**
 * A slot canyon seen from the floor: dark walls fill most of the frame and a narrow
 * lit gap runs down the middle. Each step inward is lighter, because it catches more
 * of the light coming down the slot.
 */
function Canyon({ palette, options }: SceneProps) {
  // x offsets of the left wall's inner edge at five heights, outermost step first.
  const edges = [
    [180, 300, 220, 360, 250],
    [330, 450, 380, 510, 400],
    [480, 590, 530, 640, 545],
    [600, 690, 640, 720, 655],
  ];
  const ys = [0, H * 0.28, H * 0.52, H * 0.78, H];
  return (
    <g transform={squash(options?.scale)}>
      {/* Back to front: the innermost, lightest wall first, darker steps over it. */}
      {[...edges].reverse().map((edge, step) => {
        const i = edges.length - 1 - step;
        const left = `M0,0 ${edge.map((x, k) => `L${x},${ys[k]}`).join(" ")} L0,${H} Z`;
        const right = `M${W},0 ${edge.map((x, k) => `L${W - x + (k % 2 ? 40 : -30)},${ys[k]}`).join(" ")} L${W},${H} Z`;
        return (
          <g key={i} fill={at(palette, i)}>
            <path d={left} />
            <path d={right} />
          </g>
        );
      })}
    </g>
  );
}

function Ridges({ palette, options }: SceneProps) {
  const layers = [430, 510, 590, 670, 755, 840];
  return (
    <g transform={squash(options?.scale)}>
      {layers.map((y, i) => (
        <path
          key={y}
          d={`${duneBand(y, 38 - i * 4, i * 2.3 + 0.7)} L${W},${H} L0,${H} Z`}
          fill={at(palette, layers.length - 1 - i)}
          opacity={0.94}
        />
      ))}
    </g>
  );
}

function Corridor({ palette }: SceneProps) {
  const light = at(palette, 0);
  const mid = at(palette, 1);
  const vx = W / 2;
  const vy = H * 0.5;
  const bays = [0.06, 0.22, 0.38, 0.54, 0.7, 0.84];
  const box = (t: number) => {
    const w = (W / 2) * (1 - t);
    const h = (H / 2) * (1 - t);
    return { l: vx - w, r: vx + w, t: vy - h, b: vy + h };
  };
  return (
    <g>
      {bays.slice(0, -1).map((t, i) => {
        const a = box(t);
        const b = box(bays[i + 1]!);
        const shade = 0.06 + i * 0.11;
        return (
          <g key={t}>
            <path d={`M${a.l},${a.t} L${a.r},${a.t} L${b.r},${b.t} L${b.l},${b.t} Z`} fill={mid} opacity={shade} />
            <path d={`M${a.l},${a.b} L${a.r},${a.b} L${b.r},${b.b} L${b.l},${b.b} Z`} fill={light} opacity={shade * 0.8} />
            <path d={`M${a.l},${a.t} L${a.l},${a.b} L${b.l},${b.b} L${b.l},${b.t} Z`} fill={light} opacity={shade * 1.5} />
            <path d={`M${a.r},${a.t} L${a.r},${a.b} L${b.r},${b.b} L${b.r},${b.t} Z`} fill={mid} opacity={shade * 0.5} />
            <path
              d={`M${b.l},${b.t} L${b.r},${b.t} L${b.r},${b.b} L${b.l},${b.b} Z`}
              fill="none"
              stroke={light}
              strokeWidth={1.5}
              strokeOpacity={0.3 + i * 0.1}
            />
          </g>
        );
      })}
      <circle cx={vx} cy={vy} r={46} fill={light} opacity={0.95} />
      <circle cx={vx} cy={vy} r={96} fill={light} opacity={0.18} />
    </g>
  );
}

function Slats({ palette }: SceneProps) {
  const light = at(palette, 0);
  return (
    <g transform="rotate(-16 800 450)">
      {Array.from({ length: 11 }, (_, i) => (
        <rect
          key={i}
          x={-400}
          y={-260 + i * 132}
          width={2400}
          height={46 + (i % 3) * 8}
          fill={light}
          opacity={0.1 + (i % 4) * 0.06}
        />
      ))}
    </g>
  );
}

function Halftone({ palette, uid }: SceneProps) {
  const light = at(palette, 0);
  const mid = at(palette, 1);
  return (
    <>
      <defs>
        <pattern id={`${uid}-coarse`} width={22} height={22} patternUnits="userSpaceOnUse">
          <circle cx={11} cy={11} r={4.4} fill={mid} />
        </pattern>
        <pattern id={`${uid}-fine`} width={14} height={14} patternUnits="userSpaceOnUse">
          <circle cx={7} cy={7} r={4.6} fill={light} />
        </pattern>
      </defs>
      <circle cx={800} cy={430} r={320} fill={`url(#${uid}-coarse)`} />
      <circle cx={800} cy={430} r={222} fill={`url(#${uid}-fine)`} />
      <circle cx={800} cy={430} r={132} fill={light} />
    </>
  );
}

function Ring({ palette }: SceneProps) {
  const light = at(palette, 0);
  const dark = at(palette, 2);
  return (
    <g>
      <circle cx={800} cy={430} r={268} fill="none" stroke={light} strokeWidth={9} opacity={0.95} />
      <circle cx={800} cy={430} r={288} fill="none" stroke={light} strokeWidth={2} opacity={0.35} />
      <circle cx={800} cy={430} r={262} fill={dark} />
      <circle cx={800} cy={430} r={330} fill="none" stroke={light} strokeWidth={1} opacity={0.14} />
    </g>
  );
}

function Grid({ palette }: SceneProps) {
  const light = at(palette, 0);
  const mid = at(palette, 1);
  const horizon = H * 0.52;
  return (
    <g>
      <line x1={0} y1={horizon} x2={W} y2={horizon} stroke={light} strokeWidth={2} opacity={0.8} />
      {Array.from({ length: 25 }, (_, i) => {
        const x = -W + (i * W * 3) / 24;
        return <line key={i} x1={x} y1={H} x2={W / 2} y2={horizon} stroke={mid} strokeWidth={1.6} opacity={0.5} />;
      })}
      {Array.from({ length: 14 }, (_, i) => {
        const t = (i + 1) / 14;
        const y = horizon + (H - horizon) * t * t;
        return <line key={i} x1={0} y1={y} x2={W} y2={y} stroke={mid} strokeWidth={1.6} opacity={0.5} />;
      })}
    </g>
  );
}

type SceneProps = { palette: string[]; options?: SceneOptions; uid: string };

const SCENES: Record<SceneId, (props: SceneProps) => React.ReactElement> = {
  peaks: Peaks,
  ridges: Ridges,
  pines: Pines,
  dunes: Dunes,
  waves: Waves,
  canyon: Canyon,
  corridor: Corridor,
  slats: Slats,
  halftone: Halftone,
  ring: Ring,
  grid: Grid,
};

export function Scene({
  id,
  palette,
  options,
  uid,
}: {
  id: SceneId;
  palette: string[];
  options?: SceneOptions;
  /** Prefix for any SVG element id, so two scenes on one page never collide. */
  uid: string;
}) {
  const Draw = SCENES[id];
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      className="absolute inset-0 h-full w-full"
    >
      <Draw palette={palette} options={options} uid={uid} />
    </svg>
  );
}
