import Image from "next/image";
import Link from "next/link";
import { CategoryFilter } from "@/components/CategoryFilter";
import { Wallpaper } from "@/components/Wallpaper";
import { CATEGORIES } from "@/lib/categories";
import { WALLPAPERS } from "@/lib/wallpapers";

const counts: Record<string, number> = {
  all: WALLPAPERS.length,
  ...Object.fromEntries(CATEGORIES.map((c) => [c.id, WALLPAPERS.filter((w) => w.category === c.id).length])),
};

const pad = (n: number) => String(n).padStart(2, "0");

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-[1500px] px-5 pb-24 pt-10 sm:px-8 lg:px-12">
      <header className="reveal">
        <div className="flex items-center gap-3">
          <Image
            src="/icon-192.png"
            alt=""
            width={40}
            height={40}
            priority
            className="h-10 w-10 rounded-[10px]"
          />
          <p className="tag">Index &middot; {WALLPAPERS.length} plates &middot; zero image assets</p>
        </div>
        <h1 className="display mt-4 text-[clamp(3rem,13vw,10rem)] leading-[0.82] tracking-[-0.03em]">
          wall
          <span className="text-safelight">.</span>
          papers
        </h1>
        <p className="mt-12 max-w-xl text-sm leading-relaxed text-muted">
          Every plate below is drawn at render time from CSS gradients and inline SVG. Nothing is
          downloaded, nothing is rasterised, and each one stays sharp at any screen size - built for
          screenshots, demos and visual testing.
        </p>
      </header>

      <div className="mt-12">
        <CategoryFilter counts={counts}>
          <ul className="grid grid-cols-1 gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {WALLPAPERS.map((w, i) => (
              <li key={w.id} data-cat={w.category} className="reveal" style={{ animationDelay: `${Math.min(i, 12) * 35}ms` }}>
                <Link href={`/w/${w.id}`} className="plate group" aria-label={`Open ${w.name}`}>
                  <div className="overflow-hidden">
                    <Wallpaper w={w} className="art aspect-[16/10] w-full" />
                  </div>
                  <div className="flex items-baseline justify-between gap-3 px-3 py-2.5">
                    <span className="truncate text-[0.8rem] tracking-tight text-paper">{w.name}</span>
                    <span className="plate-no shrink-0 text-[0.625rem] tracking-[0.18em] text-muted transition-colors">
                      {pad(i + 1)}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </CategoryFilter>
      </div>

      <footer className="mt-24 flex flex-col gap-3 border-t border-hair pt-6 text-[0.625rem] tracking-[0.18em] text-muted sm:flex-row sm:items-center sm:justify-between">
        <span>Bunlong Heng &middot; MIT</span>
        <a
          className="uppercase transition-colors hover:text-safelight"
          href="https://github.com/bunlongheng/wallpapers"
          target="_blank"
          rel="noreferrer"
        >
          github.com/bunlongheng/wallpapers
        </a>
      </footer>
    </main>
  );
}
