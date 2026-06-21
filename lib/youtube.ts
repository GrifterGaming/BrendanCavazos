export type VideoItem = { id: string; title: string; thumb: string; duration: string };

// Parse ISO 8601 duration (PT4M12S) into a readable string (4:12)
function parseDuration(iso: string): string {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return "";
  const h = parseInt(m[1] || "0");
  const min = parseInt(m[2] || "0");
  const sec = parseInt(m[3] || "0");
  const mm = String(min).padStart(h > 0 ? 2 : 1, "0");
  const ss = String(sec).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

// Sum all video durations into a single readable string (e.g. "1:23:45")
export function sumDurations(videos: VideoItem[]): string {
  let total = 0;
  for (const v of videos) {
    const parts = v.duration.split(":").map(Number);
    if (parts.length === 3) total += parts[0] * 3600 + parts[1] * 60 + parts[2];
    else if (parts.length === 2) total += parts[0] * 60 + parts[1];
  }
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export async function fetchPlaylistVideos(
  playlistId: string,
  key: string
): Promise<VideoItem[]> {
  const videos: VideoItem[] = [];
  let pageToken = "";

  for (let page = 0; page < 5; page++) {
    const url =
      `https://www.googleapis.com/youtube/v3/playlistItems` +
      `?part=snippet&maxResults=50&playlistId=${playlistId}` +
      `&key=${key}` +
      (pageToken ? `&pageToken=${pageToken}` : "");

    const res = await fetch(url);
    const data = await res.json();
    if (data.error) throw new Error(data.error.message || "YouTube API error");

    for (const v of data.items || []) {
      const snap = v.snippet || {};
      const id = (snap.resourceId || {}).videoId || "";
      if (!id) continue;
      if (snap.title === "Deleted video" || snap.title === "Private video") continue;
      const t = snap.thumbnails || {};
      const thumb =
        (t.maxres || t.high || t.medium || t.default || {}).url ||
        `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
      videos.push({ id, title: snap.title || "", thumb, duration: "" });
    }

    pageToken = data.nextPageToken || "";
    if (!pageToken) break;
  }

  // Batch-fetch durations (YouTube allows up to 50 IDs per request)
  const ids = videos.map((v) => v.id);
  for (let i = 0; i < ids.length; i += 50) {
    const chunk = ids.slice(i, i + 50).join(",");
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${chunk}&key=${key}`
    );
    const data = await res.json();
    for (const item of data.items || []) {
      const video = videos.find((v) => v.id === item.id);
      if (video) video.duration = parseDuration(item.contentDetails?.duration || "");
    }
  }

  return videos;
}
