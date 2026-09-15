import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

/**
 * Nothing is fetched from a third party at runtime: wallpapers are CSS + inline SVG,
 * and next/font self-hosts the two typefaces at build time. So every source can be
 * locked to 'self'.
 *
 * script-src keeps 'unsafe-inline' because these pages are statically prerendered and
 * Next inlines its own hydration payload; a nonce needs a per-request middleware,
 * which a fully static site does not have. There is no user input on the site.
 *
 * 'unsafe-eval' is added only in development, where React's dev build requires it. The
 * build phase is the signal - NODE_ENV is not yet settled when Next loads this file.
 */
const csp = (dev: boolean) =>
  [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self'",
    "img-src 'self' data:",
    "connect-src 'self'",
    "manifest-src 'self'",
    // The site embeds nothing and runs no workers, so close those off explicitly
    // rather than letting them inherit default-src 'self'.
    "frame-src 'none'",
    "worker-src 'none'",
    // Embeddable on purpose: the site is a wallpaper backdrop for other tools (the
    // Emulator extension frames it behind its device shells). Framing carries no
    // clickjacking risk here - every page is static, read-only, unauthenticated, and
    // has no control whose activation does anything.
    "frame-ancestors *",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join("; ");

const nextConfig = (phase: string): NextConfig => ({
  devIndicators: false,
  // This repo documents itself in README.md; no generated agent-rule files.
  agentRules: false,
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp(phase === PHASE_DEVELOPMENT_SERVER) },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
          { key: "X-DNS-Prefetch-Control", value: "off" },
        ],
      },
    ];
  },
});

export default nextConfig;
