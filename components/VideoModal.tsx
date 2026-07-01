"use client";

import { useEffect } from "react";
import { useSite } from "./SiteProvider";
import { getLenis } from "./SmoothScroll";

export default function VideoModal() {
  const { activeVideo, closeVideo } = useSite();

  useEffect(() => {
    if (!activeVideo) return;
    // Freeze background scroll while the video is open.
    getLenis()?.stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeVideo();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      getLenis()?.start();
    };
  }, [activeVideo, closeVideo]);

  if (!activeVideo) return null;

  const embed = `https://www.youtube-nocookie.com/embed/${activeVideo.id}?autoplay=1&rel=0&modestbranding=1`;

  return (
    <div
      onClick={closeVideo}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
      style={{ background: "rgba(0,0,0,0.95)", animation: "fadeIn 0.18s ease" }}
    >
      <div onClick={(e) => e.stopPropagation()} className="w-[90vw] max-w-[1080px]">
        <div className="flex items-center justify-between mb-3.5 px-0.5">
          <p
            className="font-ui"
            style={{ fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.65)", maxWidth: "80%" }}
          >
            {activeVideo.title}
          </p>
          <button
            onClick={closeVideo}
            aria-label="Close video"
            className="bg-transparent border-none cursor-pointer"
            style={{ color: "rgba(255,255,255,0.45)", fontSize: 32, lineHeight: 1, padding: "0 4px" }}
          >
            ×
          </button>
        </div>
        <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, background: "#000" }}>
          <iframe
            src={embed}
            title={activeVideo.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
          />
        </div>
      </div>
    </div>
  );
}
