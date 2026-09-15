import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-display",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
  preload: false,
});

function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit;
  const vercel = process.env.NEXT_PUBLIC_VERCEL_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3050";
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "Wallpapers - 40 plates, zero assets",
    template: "%s - Wallpapers",
  },
  description:
    "A lightweight wallpaper gallery. Every plate is drawn from CSS gradients and inline SVG, so nothing is downloaded and everything stays sharp at any resolution.",
  openGraph: {
    type: "website",
    title: "Wallpapers - 40 plates, zero assets",
    description: "40 procedural wallpapers across 4 categories. No image files, ever.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wallpapers - 40 plates, zero assets",
    description: "40 procedural wallpapers across 4 categories. No image files, ever.",
  },
  robots: { index: true, follow: true },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#08080a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
