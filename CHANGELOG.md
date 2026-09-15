# Changelog

## 1.1.0 - 2026-09-15

Audit pass across ten lenses, then a verification pass on the fixes.

### Fixed

- **Accessibility.** The chip count was dimmed with `opacity`, which axe folds into the
  foreground and read as 2.65:1. Plate links carried an `aria-label` that did not contain
  their visible text (WCAG 2.5.3). Viewer arrows were symbol-only labels. Lighthouse
  accessibility went 96 to 100.
- **Viewer chrome contrast.** `.tag` was unlayered CSS, and unlayered rules beat every
  Tailwind utility, so `text-white` on a `.tag` element was silently a no-op and the
  chrome stayed muted grey over light plates. Component classes now live in
  `@layer components`, with an e2e test on the computed colour because axe cannot grade
  text over a gradient.
- **Waves** painted its back row with the front-most palette colour, inverting the order
  every other scene follows.
- **The category filter's CSS** had a specificity bug where the hide rule out-specified
  the show rule.
- `duneBand` documented a `crest` parameter that never existed; two map callbacks shadowed
  the module-level rounding helper.

### Added

- CI on GitHub Actions: typecheck, lint, `npm audit`, unit tests with coverage
  thresholds, then a production build and the e2e suite on Chromium and WebKit.
- Render-level tests over all 40 plates and all 12 scenes: the four parallel CSS lists,
  determinism, SVG id uniqueness, escaping, and a gradients-only rule for recipes.
- axe assertions on the index and on the darkest and lightest plates, with no retries.
- A deep-linkable category filter (`/#leather`), an Open Graph image, a maskable icon,
  `CONTRIBUTING.md`, `SECURITY.md` and safe-area insets.

### Changed

- `Recipe`'s scene fields are a discriminated union, so a scene without a palette, or a
  scene carrying an option it never reads, is now a compile error rather than a silent
  no-op.
- `lib/wallpapers.ts` is a small entry point over per-category modules in `lib/recipes/`.
- Lighthouse performance went 83 to 96-99: an opacity-only reveal on the first row only,
  one preloaded font weight, and the header icon off both the preload and the optimiser
  paths. `content-visibility` on the tiles was tried and removed - measured across three
  runs each way it changed nothing, and it stops off-screen plates being painted into a
  full-page screenshot, which is what this site is for.
- Every PNG in the repo recompressed: 2.37 MB to 538 KB.

## 1.0.0 - 2026-09-15

First release. 40 procedural wallpapers across 4 categories, drawn from CSS gradients and
inline SVG with no image assets.
