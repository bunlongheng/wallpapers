import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Viewer } from "@/components/Viewer";
import { Wallpaper } from "@/components/Wallpaper";
import { CATEGORIES } from "@/lib/categories";
import { WALLPAPERS, getWallpaper, indexOf } from "@/lib/wallpapers";

type Params = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return WALLPAPERS.map((w) => ({ id: w.id }));
}

/** Unknown ids fall through to the 404 page rather than rendering anything. */
export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const w = getWallpaper(id);
  if (!w) return { title: "Not found" };
  return { title: w.name, description: w.note };
}

export default async function WallpaperPage({ params }: Params) {
  const { id } = await params;
  const w = getWallpaper(id);
  if (!w) notFound();

  const i = indexOf(w.id) - 1;
  const prev = WALLPAPERS[(i - 1 + WALLPAPERS.length) % WALLPAPERS.length]!;
  const next = WALLPAPERS[(i + 1) % WALLPAPERS.length]!;
  const category = CATEGORIES.find((c) => c.id === w.category)?.name ?? w.category;

  return (
    <Viewer
      id={w.id}
      title={w.name}
      category={category}
      note={w.note}
      index={i + 1}
      total={WALLPAPERS.length}
      prev={{ id: prev.id, name: prev.name }}
      next={{ id: next.id, name: next.name }}
    >
      <Wallpaper w={w} className="h-full w-full" />
    </Viewer>
  );
}
