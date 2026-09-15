import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./", import.meta.url)) },
  },
  test: {
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
    environment: "node",
    coverage: {
      provider: "v8",
      include: ["components/**", "lib/**"],
      // The "use client" components are browser behaviour - keyboard nav, an idle
      // timer, the hash store, a rotation interval - and are covered by the Playwright
      // suite instead. Unit coverage measures the server-rendered half, which is where
      // the invariants live.
      exclude: [
        "components/Viewer.tsx",
        "components/CategoryFilter.tsx",
        "components/DemoMode.tsx",
        "components/DemoGate.tsx",
      ],
      thresholds: { lines: 95, functions: 95, statements: 95, branches: 90 },
    },
  },
});
