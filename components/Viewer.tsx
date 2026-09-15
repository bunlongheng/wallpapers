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
  id,
  title,
  category,
  note,
  index,
  total,
  prev,
  next,
  children,
}: {
  /** This plate's own id, used to ignore keys meant for the plate we just left. */
  id: string;
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
  const chrome = useRef<HTMLDivElement>(null);

  /**
   * (Re)arm the idle countdown that hides the chrome. Long enough to read the title on a
   * first visit, and never fires while a control inside the chrome holds focus.
   */
  const schedule = useCallback(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (chrome.current?.contains(document.activeElement)) return;
      setHidden(true);
    }, 5000);
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
      // A second press can land after the next plate has painted but before this
      // listener has been swapped for its one. Without this guard that press is
      // handled with the previous plate's neighbours and jumps somewhere wrong.
      if (window.location.pathname !== `/w/${id}`) return;
      if (e.key === "ArrowLeft") router.push(`/w/${prev.id}`);
      else if (e.key === "ArrowRight") router.push(`/w/${next.id}`);
      else if (e.key === "Escape") router.push("/");
      else wake();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, id, prev.id, next.id, wake]);

  return (
    <main
      className="relative h-[100dvh] w-full overflow-hidden"
      onPointerMove={wake}
      onPointerDown={wake}
    >
      {children}

      <div
        ref={chrome}
        className="chrome pointer-events-none absolute inset-0"
        data-hidden={hidden}
        onFocus={wake}
      >
        <div className="bar bar-top pointer-events-auto absolute inset-x-0 top-0 flex items-center justify-between gap-4 bg-gradient-to-b from-black/75 to-transparent">
          <Link
            href="/"
            className="ctl tag rounded-none border border-white/40 bg-black/40 px-3 py-2 text-white backdrop-blur-sm transition-colors hover:border-white/80"
          >
            &larr; Index
          </Link>
          <span className="tag rounded-none bg-black/40 px-2 py-1 text-white backdrop-blur-sm">
            <span className="sr-only">Plate </span>
            {String(index).padStart(2, "0")} / {total}
          </span>
        </div>

        <nav className="bar bar-bottom pointer-events-auto absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-black/85 via-black/45 to-transparent">
          <div className="min-w-0">
            <p className="tag text-white">{category}</p>
            <h1 className="display truncate text-2xl leading-tight text-white sm:text-4xl">{title}</h1>
            <p className="mt-1 hidden max-w-md text-xs text-white sm:block">{note}</p>
            <p className="tag mt-2 hidden text-white sm:block">
              Arrows to browse &middot; Esc for the index
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            {/*
              The glyph is decorative: axe cannot read an arrow as a label, and WCAG 2.5.3
              wants the accessible name to match what is visible. The name comes from the
              screen-reader text instead.
            */}
            <Link
              href={`/w/${prev.id}`}
              rel="prev"
              aria-keyshortcuts="ArrowLeft"
              className="ctl tag border border-white/40 bg-black/40 px-4 py-3 text-white backdrop-blur-sm transition-colors hover:border-white/80"
            >
              <span aria-hidden="true">&larr;</span>
              <span className="sr-only">Previous plate: {prev.name}</span>
            </Link>
            <Link
              href={`/w/${next.id}`}
              rel="next"
              aria-keyshortcuts="ArrowRight"
              className="ctl tag border border-white/40 bg-black/40 px-4 py-3 text-white backdrop-blur-sm transition-colors hover:border-white/80"
            >
              <span aria-hidden="true">&rarr;</span>
              <span className="sr-only">Next plate: {next.name}</span>
            </Link>
          </div>
        </nav>
      </div>
    </main>
  );
}
