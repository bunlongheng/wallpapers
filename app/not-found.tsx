import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="tag">404 &middot; no such plate</p>
      <h1 className="display text-[clamp(3rem,12vw,7rem)] leading-none">Off the index</h1>
      <p className="max-w-sm text-sm text-muted">
        That wallpaper is not in the catalogue. Everything here is generated from a fixed set of
        recipes, so only listed ids resolve.
      </p>
      <Link href="/" className="chip mt-2">
        Back to the index
      </Link>
    </main>
  );
}
