import { NextResponse } from "next/server";
import { PLAYLISTS } from "@/lib/data";
import { fetchPlaylistVideos, sumDurations } from "@/lib/youtube";

export const dynamic = "force-dynamic";

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
        const videos = await fetchPlaylistVideos(pl.id, key);
        return {
          id: pl.id,
          label: pl.label,
          tint: pl.tint || "linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 70%)",
          videos,
          totalClips: videos.length,
          totalDuration: sumDurations(videos),
        };
      })
    );
    console.log("[api/work] end — returned", playlists.length, "playlist(s)");
    return NextResponse.json({ configured: true, playlists });
  } catch (err: any) {
    console.log("[api/work] end — error:", err?.message);
    return NextResponse.json(
      { configured: true, error: err?.message || "Could not load videos", playlists: [] },
      { status: 502 }
    );
  }
}
