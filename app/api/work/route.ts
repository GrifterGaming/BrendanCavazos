import { NextResponse } from "next/server";
import { PLAYLISTS } from "@/lib/data";
import { fetchPlaylistVideos } from "@/lib/youtube";

// Always run fresh so a newly-added key (or new videos) show up right away.
export const dynamic = "force-dynamic";

// Returns every playlist with its videos already fetched. The browser calls this
// once and gets a finished list — the API key stays here on the server.
export async function GET() {
  console.log("[api/work] start");

  const key = process.env.YOUTUBE_API_KEY;

  // No key set yet → tell the page so it shows the simple embed instead.
  if (!key) {
    console.log("[api/work] end — no API key configured");
    return NextResponse.json({ configured: false, playlists: [] });
  }

  try {
    const playlists = await Promise.all(
      PLAYLISTS.map(async (pl) => ({
        id: pl.id,
        label: pl.label,
        videos: await fetchPlaylistVideos(pl.id, key),
      }))
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
