"use client";

import { useState } from "react";
import { CATEGORIES, type CategoryId } from "@/lib/categories";

type Filter = CategoryId | "all";

/**
 * Wraps the server-rendered grid and filters it with a data attribute, so the forty
 * wallpaper recipes stay on the server and only the filter state ships as JS.
 */
export function CategoryFilter({ counts, children }: { counts: Record<string, number>; children: React.ReactNode }) {
  const [filter, setFilter] = useState<Filter>("all");
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
            onClick={() => setFilter(o.id)}
          >
            {o.name}
            <span className="ml-2 opacity-60">{counts[o.id] ?? 0}</span>
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
