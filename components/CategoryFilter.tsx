"use client";

import { useSyncExternalStore } from "react";
import { CATEGORIES, type CategoryId } from "@/lib/categories";

type Filter = CategoryId | "all";

/**
 * The URL hash is the source of truth for the active category, so a filtered view can
 * be linked, bookmarked, and survives coming back from a plate. It is external state,
 * hence useSyncExternalStore rather than useState plus a mount effect.
 */
const subscribe = (onChange: () => void) => {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
};
const readHash = () => window.location.hash.slice(1);
const serverHash = () => "";

/**
 * Wraps the server-rendered grid and filters it with a data attribute, so the forty
 * wallpaper recipes stay on the server and only the filter state ships as JS.
 */
export function CategoryFilter({
  counts,
  children,
}: {
  counts: Record<string, number>;
  children: React.ReactNode;
}) {
  const hash = useSyncExternalStore(subscribe, readHash, serverHash);
  const filter: Filter = CATEGORIES.some((c) => c.id === hash) ? (hash as CategoryId) : "all";

  const options: { id: Filter; name: string; blurb: string }[] = [
    { id: "all", name: "All", blurb: "Every plate in the index" },
    ...CATEGORIES,
  ];
  const active = options.find((o) => o.id === filter);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 border-y border-hair py-4">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            className="chip"
            aria-pressed={filter === o.id}
            onClick={() => {
              window.location.hash = o.id;
            }}
          >
            {o.name}
            <span className="count ml-2">{counts[o.id] ?? 0}</span>
          </button>
        ))}
      </div>
      <p className="tag mt-4">{active?.blurb}</p>
      <div data-filter={filter} className="mt-6">
        {children}
      </div>
    </>
  );
}
