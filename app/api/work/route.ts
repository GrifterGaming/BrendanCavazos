import { NextResponse } from "next/server";
import { PLAYLISTS } from "@/lib/data";
import { fetchPlaylistSummary } from "@/lib/youtube";

export const dynamic = "force-dynamic";

// Hub summary — one cheap call per playlist (count + thumbnail). No durations,
// so this stays fast no matter how many bins exist. Full videos load per-bin.
export async function GET() {
  console.log("[api/work] start");

  const key = process.env.YOUTUBE_API_KEY;

  if (!key) {
    console.log("[api/work] end — no API key configured");
    return NextResponse.json({ configured: false, playlists: [] });
  }

  try {
    const playlists = await Promise.all(
      PLAYLISTS.map(async (pl) => {
        const { count, thumb } = await fetchPlaylistSummary(pl.id, key);
        return {
          id: pl.id,
          label: pl.label,
          tint: pl.tint || "linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 70%)",
          count,
          thumb,
        };
      })
    );
    console.log("[api/work] end — returned", playlists.length, "bin summary(ies)");
    return NextResponse.json({ configured: true, playlists });
  } catch (err: any) {
    console.log("[api/work] end — error:", err?.message);
    return NextResponse.json(
      { configured: true, error: err?.message || "Could not load playlists", playlists: [] },
      { status: 502 }
    );
  }
}
