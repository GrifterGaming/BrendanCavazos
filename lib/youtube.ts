// Talks to the YouTube Data API. Runs on the server only, so the API key never
// reaches the browser. One job: given a playlist, return its videos.

export type VideoItem = { id: string; title: string; thumb: string };

export async function fetchPlaylistVideos(
  playlistId: string,
  key: string
): Promise<VideoItem[]> {
  const videos: VideoItem[] = [];
  let pageToken = "";

  // YouTube returns at most 50 items per call, so page through until done
  // (capped at 5 pages / 250 videos so one huge playlist can't hang the request).
  for (let page = 0; page < 5; page++) {
    const url =
      `https://www.googleapis.com/youtube/v3/playlistItems` +
      `?part=snippet&maxResults=50&playlistId=${playlistId}` +
      `&key=${key}` +
      (pageToken ? `&pageToken=${pageToken}` : "");

    const res = await fetch(url);
    const data = await res.json();

    if (data.error) {
      throw new Error(data.error.message || "YouTube API error");
    }

    for (const v of data.items || []) {
      const snap = v.snippet || {};
      const id = (snap.resourceId || {}).videoId || "";
      if (!id) continue;
      // Skip deleted/private videos (YouTube keeps them in the list as placeholders).
      if (snap.title === "Deleted video" || snap.title === "Private video") continue;
      const t = snap.thumbnails || {};
      const thumb =
        (t.maxres || t.high || t.medium || t.default || {}).url ||
        `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
      videos.push({ id, title: snap.title || "", thumb });
    }

    pageToken = data.nextPageToken || "";
    if (!pageToken) break;
  }

  return videos;
}
