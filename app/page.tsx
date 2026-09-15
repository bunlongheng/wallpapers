import Image from "next/image";
import Link from "next/link";
import { CategoryFilter } from "@/components/CategoryFilter";
import { DemoGate } from "@/components/DemoGate";
import { Wallpaper } from "@/components/Wallpaper";
import { WALLPAPERS, wallpapersIn } from "@/lib/wallpapers";

const counts = {
  all: WALLPAPERS.length,
  aurora: wallpapersIn("aurora").length,
  nature: wallpapersIn("nature").length,
  leather: wallpapersIn("leather").length,
  mono: wallpapersIn("mono").length,
};

const pad = (n: number) => String(n).padStart(2, "0");

export default function Home() {
  return (
    <>
      {/* ?demo=true swaps the page for a full-bleed rotating wallpaper. */}
      <DemoGate />

      <main className="mx-auto w-full max-w-[1500px] px-5 pb-24 pt-10 sm:px-8 lg:px-12">
        <header className="reveal flex items-center gap-4">
          <Image
            src="/icon-80.png"
            alt=""
            width={44}
            height={44}
            unoptimized
            loading="eager"
            className="h-11 w-11 rounded-[12px]"
          />
          <h1 className="display text-[clamp(2.5rem,9vw,5.5rem)] leading-none tracking-[-0.03em]">
            wall
            <span className="text-safelight">.</span>
            papers
          </h1>
        </header>

        <div className="mt-10">
          <CategoryFilter counts={counts}>
            <ul className="grid grid-cols-1 gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {WALLPAPERS.map((w, i) => (
                <li
                  key={w.id}
                  data-cat={w.category}
                  className={i < 8 ? "reveal" : undefined}
                  style={i < 8 ? { animationDelay: `${i * 35}ms` } : undefined}
                >
                  <Link href={`/w/${w.id}`} className="plate group">
                    <div className="overflow-hidden">
                      <Wallpaper w={w} className="art aspect-[16/10] w-full" />
                    </div>
                    <div className="flex items-baseline justify-between gap-3 px-3 py-2.5">
                      <span className="truncate text-[0.8rem] tracking-tight">{w.name}</span>
                      <span className="plate-no tag shrink-0 transition-colors" aria-hidden="true">
                        {pad(i + 1)}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </CategoryFilter>
        </div>

        <footer className="tag mt-24 flex flex-col gap-3 border-t border-hair pt-6 sm:flex-row sm:items-center sm:justify-between">
          <span>Bunlong Heng &middot; MIT</span>
          <a
            className="uppercase transition-colors hover:text-safelight-ink"
            href="https://github.com/bunlongheng/wallpapers"
            target="_blank"
            rel="noreferrer"
          >
            github.com/bunlongheng/wallpapers
          </a>
        </footer>
      </main>
    </>
  );
}
