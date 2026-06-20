"use client";

import { useEffect, useState } from "react";
import { useSite } from "../SiteProvider";
import { useReveal } from "@/lib/useReveal";
import Marquee from "../Marquee";
import { PLAYLISTS } from "@/lib/data";
import type { VideoItem } from "@/lib/youtube";

type LoadedPlaylist = { id: string; label: string; videos: VideoItem[] };

export default function Work() {
  const { openVideo, testimonials } = useSite();
  const headRef = useReveal<HTMLDivElement>();
  const marqueeCards = [...testimonials, ...testimonials];

  const [playlists, setPlaylists] = useState<LoadedPlaylist[]>([]);
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(false);

  // Ask our own backend for the videos. The API key lives on the server, so it
  // never reaches the browser and visitors never see a prompt.
  useEffect(() => {
    let active = true;
    fetch("/api/work")
      .then((r) => r.json())
      .then((data) => {
        if (!active) return;
        setConfigured(!!data.configured);
        setPlaylists(data.playlists || []);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div style={{ background: "var(--bc-bg)", minHeight: "100vh", paddingTop: 88, paddingBottom: 96, transition: "background 0.3s" }}>
      <div ref={headRef} className="max-w-[1200px] mx-auto" style={{ padding: "0 24px 56px" }}>
        <p className="reveal font-ui uppercase" style={{ fontSize: 10, fontWeight: 500, letterSpacing: 4, color: "var(--accent)", marginBottom: 16 }}>Portfolio</p>
        <h2 className="reveal font-display uppercase" style={{ fontSize: "clamp(64px,8vw,104px)", color: "var(--bc-text)", lineHeight: 0.87 }}>MY WORK</h2>
      </div>

      {/* Loading spinner */}
      {loading && (
        <div className="flex justify-center items-center" style={{ height: 320 }}>
          <div style={{ width: 36, height: 36, border: "2px solid var(--bc-border)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        </div>
      )}

      {/* Key configured → thumbnail grid per playlist */}
      {!loading && configured && (
        <div className="max-w-[1200px] mx-auto flex flex-col" style={{ padding: "0 24px", gap: 80 }}>
          {playlists.map((pl) => (
            <div key={pl.id}>
              <p className="font-ui uppercase" style={{ fontSize: 10, fontWeight: 500, letterSpacing: 4, color: "var(--bc-text3)", marginBottom: 24 }}>
                {pl.label}
              </p>
              {pl.videos.length === 0 ? (
                <p className="font-ui" style={{ fontSize: 14, color: "var(--bc-text4)" }}>No videos in this playlist yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 3 }}>
                  {pl.videos.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => openVideo({ id: item.id, title: item.title })}
                      className="group relative cursor-pointer overflow-hidden border-none p-0"
                      style={{ background: "var(--bc-surface)", aspectRatio: "16 / 9" }}
                    >
                      <span
                        className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundImage: `url(${item.thumb})`, backgroundSize: "cover", backgroundPosition: "center" }}
                      />
                      <span className="absolute inset-0 transition-colors duration-200 group-hover:bg-black/40" />
                      <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        <span className="flex items-center justify-center" style={{ width: 54, height: 54, borderRadius: "50%", background: "rgba(255,255,255,0.92)" }}>
                          <span style={{ borderStyle: "solid", borderWidth: "9px 0 9px 17px", borderColor: "transparent transparent transparent #111", marginLeft: 4 }} />
                        </span>
                      </span>
                      <span className="absolute left-0 right-0 bottom-0 text-left" style={{ background: "linear-gradient(transparent,rgba(0,0,0,0.75))", padding: "28px 14px 13px" }}>
                        <span className="font-ui block text-white" style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.35 }}>{item.title}</span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* No key → simple embedded player per playlist (still works for everyone) */}
      {!loading && !configured && (
        <div className="max-w-[1200px] mx-auto flex flex-col" style={{ padding: "0 24px", gap: 72 }}>
          {PLAYLISTS.map((pl) => (
            <div key={pl.id}>
              <p className="font-ui uppercase" style={{ fontSize: 10, fontWeight: 500, letterSpacing: 4, color: "var(--bc-text3)", marginBottom: 20 }}>
                {pl.label}
              </p>
              <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", background: "#000" }}>
                <iframe
                  src={`https://www.youtube.com/embed/videoseries?list=${pl.id}&controls=1&rel=0&modestbranding=1`}
                  title={pl.label}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Client testimonials card marquee */}
      <div style={{ borderTop: "1px solid var(--bc-border)", marginTop: 96, padding: "48px 0 80px", transition: "border-color 0.3s" }}>
        <div className="max-w-[1200px] mx-auto" style={{ padding: "0 24px", marginBottom: 24 }}>
          <p className="font-ui uppercase" style={{ fontSize: 10, fontWeight: 500, letterSpacing: 4, color: "var(--accent)" }}>Client Testimonials</p>
        </div>
        <Marquee variant="cards">
          {marqueeCards.map((t, i) => (
            <div
              key={i}
              className="flex flex-col justify-between"
              style={{ background: "var(--bc-surface)", padding: "28px 32px", gap: 20, width: 380, flexShrink: 0, whiteSpace: "normal", marginRight: 3, transition: "background 0.3s" }}
            >
              <p className="font-ui italic" style={{ fontSize: 14, color: "var(--bc-text)", lineHeight: 1.65 }}>&ldquo;{t.quote}&rdquo;</p>
              <div>
                <p className="font-ui uppercase" style={{ fontSize: 11, fontWeight: 600, color: "var(--bc-text)", letterSpacing: 1.5, marginBottom: 3 }}>{t.name}</p>
                <p className="font-ui" style={{ fontSize: 11, color: "var(--accent)" }}>{t.role}</p>
              </div>
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
}
