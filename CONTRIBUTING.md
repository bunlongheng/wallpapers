# Contributing

Thanks for looking. This is a small, deliberately simple project - a wallpaper is data,
not a file, and almost every contribution is one object in one array.

## Setup

```bash
npm install          # also installs a husky pre-push hook
npm run dev          # http://localhost:3050
```

No database, no API keys, no accounts. It runs offline.

## Before you open a PR

```bash
npm run typecheck
npm run lint
npm test             # vitest - catalogue and render invariants
npm run test:e2e     # playwright - desktop and iPhone, includes axe
```

The pre-push hook runs the first three. It does **not** run the e2e suite (that needs a
server), so run it yourself when you touch a route, a component, or anything visual. CI
runs everything, including the e2e suite against the production build.

## Adding a wallpaper

Add one object to the right file under `lib/recipes/` (`aurora.ts`, `nature.ts`,
`leather.ts`, `mono.ts`). Three rules:

1. **One gradient per layer.** `components/Wallpaper.tsx` builds `background-image`,
   `-size`, `-position` and `-repeat` as four parallel comma lists. Two gradients in one
   layer misaligns every list after it, silently.
2. **A scene needs a palette**, front-most colour first - and may only carry options its
   scene actually reads. The `Recipe` type is a discriminated union, so both are compile
   errors rather than silent no-ops.
3. **`grain`, `pebble` and `mottle` are opacities in 0..1.**

Each category holds exactly ten plates and `tests/wallpapers.test.ts` asserts that, so
adding an eleventh means either replacing one or updating that assertion plus the copy
that hardcodes the number: `app/layout.tsx`, `public/manifest.webmanifest`,
`package.json`'s description, and the README. The e2e suite derives its counts from the
catalogue, so it needs no edit.

## Adding a scene

Write the drawer in `components/Scene.tsx`, add its id to the `SceneId` union in
`lib/recipes/types.ts` (and to the right option group there if it reads `scale`), and
register it in `SCENES`. The `Record<SceneId, ...>` type means
you cannot forget the second step. Scenes must be **deterministic** - use the `noise()`
hash, never `Math.random()` - and must prefix every SVG `id` with `uid` so forty scenes
on one page never collide. `npm test` checks all of that.

## Toolchain notes

- **ESLint stays on 9.** `eslint-config-next@16.3.5` declares `eslint >=9`, but the
  `eslint-plugin-react` it bundles calls an API ESLint 10 removed
  (`contextOrFilename.getFilename is not a function`), so `npm run lint` crashes on 10.
  Revisit when `eslint-config-next` ships a 10-compatible plugin tree.
- **TypeScript stays on 5.** 7.0 is a larger migration and the Next TS plugin has not
  caught up; there is nothing in this codebase that needs it.

## House rules

- Keep dependencies minimal. Three runtime deps is the budget.
- No image files. If it cannot be drawn with CSS or SVG, it does not belong here.
- Match the surrounding style; the code is commented where the reasoning is not obvious.
