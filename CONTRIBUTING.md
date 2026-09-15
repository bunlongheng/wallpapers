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

Add one object to the right category array in `lib/wallpapers.ts`. Three rules, all
enforced by `npm test`:

1. **One gradient per layer.** `components/Wallpaper.tsx` builds `background-image`,
   `-size`, `-position` and `-repeat` as four parallel comma lists. Two gradients in one
   layer misaligns every list after it, silently.
2. **A scene needs a palette**, front-most colour first.
3. **`grain`, `pebble` and `mottle` are opacities in 0..1.**

Each category holds exactly ten plates and the tests assert that, so adding an
eleventh means either replacing one or updating the counts in `tests/wallpapers.test.ts`,
`tests/e2e/gallery.spec.ts`, the README and `public/manifest.webmanifest`.

## Adding a scene

Write the drawer in `components/Scene.tsx`, add its id to the `SceneId` union in
`lib/wallpapers.ts`, and register it in `SCENES`. The `Record<SceneId, ...>` type means
you cannot forget the second step. Scenes must be **deterministic** - use the `noise()`
hash, never `Math.random()` - and must prefix every SVG `id` with `uid` so forty scenes
on one page never collide. `npm test` checks all of that.

## House rules

- Keep dependencies minimal. Three runtime deps is the budget.
- No image files. If it cannot be drawn with CSS or SVG, it does not belong here.
- Match the surrounding style; the code is commented where the reasoning is not obvious.
