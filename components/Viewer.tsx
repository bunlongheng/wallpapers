"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

type Neighbour = { id: string; name: string };

/**
 * Full-bleed wallpaper view. The chrome hides itself after a couple of idle seconds
 * so the frame can be screenshotted clean, and comes back on any input.
 */
export function Viewer({
  title,
  category,
  note,
  index,
  total,
  prev,
  next,
  children,
}: {
  title: string;
  category: string;
  note: string;
  index: number;
  total: number;
  prev: Neighbour;
  next: Neighbour;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [hidden, setHidden] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  /** (Re)arm the idle countdown that hides the chrome. */
  const schedule = useCallback(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setHidden(true), 2600);
  }, []);

  const wake = useCallback(() => {
    setHidden(false);
    schedule();
  }, [schedule]);

  useEffect(() => {
    schedule();
    return () => clearTimeout(timer.current);
  }, [schedule]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "ArrowLeft") router.push(`/w/${prev.id}`);
      else if (e.key === "ArrowRight") router.push(`/w/${next.id}`);
      else if (e.key === "Escape") router.push("/");
      else wake();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, prev.id, next.id, wake]);

  return (
    <main
      className="relative h-[100dvh] w-full overflow-hidden"
      onPointerMove={wake}
      onPointerDown={wake}
    >
      {children}

      <div className="chrome pointer-events-none absolute inset-0" data-hidden={hidden}>
        <div className="pointer-events-auto absolute inset-x-0 top-0 flex items-center justify-between gap-4 bg-gradient-to-b from-black/65 to-transparent p-4 sm:p-6">
          <Link
            href="/"
            className="tag rounded-none border border-white/25 px-3 py-2 text-white/80 backdrop-blur-sm transition-colors hover:border-white/70 hover:text-white"
          >
            &larr; Index
          </Link>
          <span className="tag text-white/70">
            {String(index).padStart(2, "0")} / {total}
          </span>
        </div>

        <nav className="pointer-events-auto absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-black/70 to-transparent p-4 sm:p-6">
          <div className="min-w-0">
            <p className="tag text-white/60">{category}</p>
            <h1 className="display truncate text-2xl leading-tight text-white sm:text-4xl">{title}</h1>
            <p className="mt-1 hidden max-w-md text-xs text-white/70 sm:block">{note}</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Link
              href={`/w/${prev.id}`}
              rel="prev"
              aria-label={`Previous: ${prev.name}`}
              className="tag border border-white/25 px-4 py-3 text-white/80 backdrop-blur-sm transition-colors hover:border-white/70 hover:text-white"
            >
              &larr;
            </Link>
            <Link
              href={`/w/${next.id}`}
              rel="next"
              aria-label={`Next: ${next.name}`}
              className="tag border border-white/25 px-4 py-3 text-white/80 backdrop-blur-sm transition-colors hover:border-white/70 hover:text-white"
            >
              &rarr;
            </Link>
          </div>
        </nav>
      </div>
    </main>
  );
}
