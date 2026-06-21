import { NextResponse } from "next/server";
import { fetchPlaylistVideos, sumDurations } from "@/lib/youtube";

export const dynamic = "force-dynamic";

// One bin's full videos + total runtime. Loaded only when a visitor clicks
// into that bin, so the hub stays fast.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ playlistId: string }> }
) {
  const { playlistId } = await params;
  console.log("[api/work/:id] start", playlistId);

  const key = process.env.YOUTUBE_API_KEY;
  if (!key) {
    console.log("[api/work/:id] end — no API key configured");
    return NextResponse.json({ configured: false, videos: [], totalDuration: "" });
  }

  try {
    const videos = await fetchPlaylistVideos(playlistId, key);
    console.log("[api/work/:id] end — returned", videos.length, "video(s)");
    return NextResponse.json({
      configured: true,
      videos,
      totalDuration: sumDurations(videos),
    });
  } catch (err: any) {
    console.log("[api/work/:id] end — error:", err?.message);
    return NextResponse.json(
      { configured: true, error: err?.message || "Could not load videos", videos: [], totalDuration: "" },
      { status: 502 }
    );
  }
}
