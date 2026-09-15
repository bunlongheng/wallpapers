"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";

/**
 * Reads ?demo / ?theme straight off the URL rather than through useSearchParams, so the
 * index stays a fully static prerender with no Suspense boundary. The demo bundle -
 * which carries the forty recipes - is only fetched once demo mode is actually on.
 */
const DemoMode = dynamic(() => import("./DemoMode"), { ssr: false });

const subscribe = (onChange: () => void) => {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
};
const readSearch = () => window.location.search;
const serverSearch = () => "";

export function DemoGate() {
  const search = useSyncExternalStore(subscribe, readSearch, serverSearch);
  const params = new URLSearchParams(search);
  const demo = params.get("demo");
  if (demo === null || demo === "false" || demo === "0") return null;

  const info = !["false", "0"].includes(params.get("info") ?? "");
  const unit = params.get("unit") === "c" ? "c" : "f";

  const num = (v: string | null) => (v !== null && v.trim() !== "" && !Number.isNaN(Number(v)) ? Number(v) : undefined);
  const place = {
    city: params.get("city") ?? undefined,
    region: params.get("region") ?? undefined,
    lat: num(params.get("lat")),
    lon: num(params.get("lon")),
  };

  return <DemoMode theme={params.get("theme")} info={info} unit={unit} place={place} />;
}
