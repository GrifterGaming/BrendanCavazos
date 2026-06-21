"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useSite } from "../SiteProvider";
import Marquee from "../Marquee";
import RevealText from "../RevealText";
import RevealImage from "../RevealImage";
import type { VideoItem } from "@/lib/youtube";

type BinSummary = { id: string; label: string; tint: string; count: number; thumb: string };
type BinData = { videos: VideoItem[]; totalDuration: string };

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.22'/%3E%3C/svg%3E\")";

// ---------- Bin card (hub view) ----------
function BinCard({ bin, idx, onSelect }: { bin: BinSummary; idx: number; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className="bin-card group relative overflow-hidden text-left w-full border-none p-0 cursor-pointer"
      style={{ aspectRatio: "4 / 3", background: bin.tint }}
    >
      {/* thumbnail */}
      {bin.thumb && (
        <span
          className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url(${bin.thumb})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.45 }}
        />
      )}
      {/* color tint on top of the photo for bin identity */}
      <span className="absolute inset-0" style={{ background: bin.tint, opacity: 0.55 }} />
      {/* darken toward bottom for label legibility */}
      <span className="absolute inset-0" style={{ background: "linear-gradient(transparent 35%, rgba(0,0,0,0.7))" }} />
      {/* grain */}
      <span className="absolute inset-0 pointer-events-none" style={{ backgroundImage: GRAIN, mixBlendMode: "overlay" }} />

      <span className="absolute inset-0 flex flex-col justify-between" style={{ padding: "28px 32px" }}>
        <span className="flex items-center justify-between">
          <span className="font-ui" style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", letterSpacing: 2 }}>
            {String(idx + 1).padStart(2, "0")}
          </span>
          <span className="font-ui" style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", letterSpacing: 1 }}>
            {bin.count} {bin.count === 1 ? "CLIP" : "CLIPS"}
          </span>
        </span>
        <span className="block">
          <span
            className="font-display uppercase block transition-transform duration-300 group-hover:-translate-y-1"
            style={{ fontSize: "clamp(28px,4vw,48px)", color: "#fff", lineHeight: 0.9 }}
          >
            {bin.label}
          </span>
          <span className="block group-hover:w-full transition-all duration-500" style={{ height: 2, width: 0, background: "var(--accent)", marginTop: 14 }} />
        </span>
      </span>
    </button>
  );
}

// ---------- Thumbnail card (bin view) ----------
function VideoCard({ item, onPlay }: { item: VideoItem; onPlay: () => void }) {
  return (
    <button onClick={onPlay} className="video-card group text-left w-full border-none p-0 cursor-pointer" style={{ background: "none" }}>
      <div className="relative overflow-hidden" style={{ aspectRatio: "16 / 9", background: "var(--bc-surface)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <span
          className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url(${item.thumb})`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <span className="absolute inset-0 transition-colors duration-200 group-hover:bg-black/40" />
        <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <span className="flex items-center justify-center" style={{ width: 46, height: 46, borderRadius: "50%", background: "rgba(255,255,255,0.92)" }}>
            <span style={{ borderStyle: "solid", borderWidth: "8px 0 8px 15px", borderColor: "transparent transparent transparent #111", marginLeft: 3 }} />
          </span>
        </span>
        {item.duration && (
          <span className="absolute bottom-2 right-2 font-ui" style={{ fontSize: 11, color: "#fff", background: "rgba(0,0,0,0.75)", padding: "2px 6px", letterSpacing: 1 }}>
            {item.duration}
          </span>
        )}
        <span className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-700" style={{ background: "var(--accent)" }} />
      </div>
      <p className="font-ui truncate" style={{ fontSize: 13, fontWeight: 500, color: "var(--bc-text)", marginTop: 10, marginBottom: 0 }}>
        {item.title}
      </p>
    </button>
  );
}

// ---------- Main Work component ----------
export default function Work() {
  const { openVideo, testimonials } = useSite();
  const marqueeCards = [...testimonials, ...testimonials];

  const [bins, setBins] = useState<BinSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(false);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [binCache, setBinCache] = useState<Record<string, BinData>>({});
  const [binLoading, setBinLoading] = useState(false);

  const gridRef = useRef<HTMLDivElement>(null);
  const binRef = useRef<HTMLDivElement>(null);

  // Load hub summaries
  useEffect(() => {
    let active = true;
    fetch("/api/work")
      .then((r) => r.json())
      .then((data) => {
        if (!active) return;
        setConfigured(!!data.configured);
        setBins(data.playlists || []);
        setLoading(false);
      })
      .catch(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  // Staggered clip-wipe entrance for the bin cards (motion-safe).
  useGSAP(
    () => {
      if (loading || selectedId) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".bin-card",
          { opacity: 0, y: 28, clipPath: "inset(0% 0% 100% 0%)" },
          { opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, stagger: 0.1, ease: "power3.out" }
        );
      });
      return () => mm.revert();
    },
    { scope: gridRef, dependencies: [loading, selectedId, bins.length] }
  );

  // Staggered fade for the video grid when a bin's clips load (motion-safe).
  useGSAP(
    () => {
      if (!binCache[selectedId || ""]) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".video-card", { opacity: 0, y: 24, duration: 0.6, stagger: 0.06, ease: "power3.out" });
      });
      return () => mm.revert();
    },
    { scope: binRef, dependencies: [selectedId, binCache[selectedId || ""]?.videos.length] }
  );

  const openBin = (id: string) => {
    setSelectedId(id);
    window.scrollTo(0, 0);
    if (binCache[id]) return; // already loaded
    setBinLoading(true);
    fetch(`/api/work/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setBinCache((c) => ({ ...c, [id]: { videos: data.videos || [], totalDuration: data.totalDuration || "" } }));
        setBinLoading(false);
      })
      .catch(() => setBinLoading(false));
  };

  const selectedBin = bins.find((b) => b.id === selectedId) || null;
  const binData = selectedId ? binCache[selectedId] : null;
  const videos = binData?.videos || [];
  const featured = videos[0] || null;
  const rest = videos.slice(1);
  const totalClips = bins.reduce((s, b) => s + b.count, 0);

  return (
    <div style={{ background: "var(--bc-bg)", minHeight: "100vh", paddingTop: 88, paddingBottom: 96, transition: "background 0.3s" }}>

      {/* ── HUB ── */}
      {!selectedBin && (
        <>
          <div className="max-w-[1100px] mx-auto" style={{ padding: "0 24px 48px" }}>
            <p className="font-ui uppercase" style={{ fontSize: 10, fontWeight: 500, letterSpacing: 4, color: "var(--accent)", marginBottom: 14 }}>Work Archive</p>
            <RevealText className="font-display uppercase" style={{ fontSize: "clamp(64px,8vw,104px)", color: "var(--bc-text)", lineHeight: 0.87 }} wrapperStyle={{ marginBottom: 16 }}>
              SELECT A BIN
            </RevealText>
            {!loading && configured && (
              <p className="font-ui uppercase" style={{ fontSize: 11, color: "var(--bc-text3)", letterSpacing: 2 }}>
                {bins.length} {bins.length === 1 ? "BIN" : "BINS"} · {totalClips} CLIPS TOTAL
              </p>
            )}
          </div>

          {loading && (
            <div className="flex justify-center items-center" style={{ height: 320 }}>
              <div style={{ width: 36, height: 36, border: "2px solid var(--bc-border)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            </div>
          )}

          {!loading && !configured && (
            <div className="max-w-[1100px] mx-auto text-center" style={{ padding: "80px 24px" }}>
              <p className="font-ui" style={{ fontSize: 14, color: "var(--bc-text3)" }}>Videos unavailable — API key not configured.</p>
            </div>
          )}

          {!loading && configured && (
            <div ref={gridRef} className="max-w-[1100px] mx-auto" style={{ padding: "0 24px" }}>
              <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 3 }}>
                {bins.map((bin, i) => (
                  <BinCard key={bin.id} bin={bin} idx={i} onSelect={() => openBin(bin.id)} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* ── BIN ── */}
      {selectedBin && (
        <div ref={binRef} className="max-w-[1100px] mx-auto" style={{ padding: "0 24px" }}>
          <button
            onClick={() => setSelectedId(null)}
            className="font-ui uppercase flex items-center gap-2 cursor-pointer"
            style={{ background: "none", border: "none", color: "var(--bc-text3)", fontSize: 11, letterSpacing: 2, padding: 0, marginBottom: 24 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            BACK
          </button>
          <p className="font-ui uppercase" style={{ fontSize: 10, fontWeight: 500, letterSpacing: 4, color: "var(--accent)", marginBottom: 14 }}>Work Archive</p>
          <RevealText key={selectedBin.id} className="font-display uppercase" style={{ fontSize: "clamp(48px,6vw,80px)", color: "var(--bc-text)", lineHeight: 0.87 }} wrapperStyle={{ marginBottom: 10 }}>
            {selectedBin.label}
          </RevealText>
          {binData && (
            <p className="font-ui uppercase" style={{ fontSize: 11, color: "var(--bc-text3)", letterSpacing: 2, marginBottom: 48 }}>
              {videos.length} {videos.length === 1 ? "CLIP" : "CLIPS"}{binData.totalDuration ? ` · ${binData.totalDuration}` : ""}
            </p>
          )}

          {/* loading this bin */}
          {binLoading && !binData && (
            <div className="flex justify-center items-center" style={{ height: 320 }}>
              <div style={{ width: 36, height: 36, border: "2px solid var(--bc-border)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            </div>
          )}

          {binData && videos.length === 0 && (
            <p className="font-ui" style={{ fontSize: 14, color: "var(--bc-text3)", padding: "40px 0" }}>No videos in this bin yet.</p>
          )}

          {/* Featured cut */}
          {featured && (
            <div style={{ marginBottom: rest.length > 0 ? 56 : 0 }}>
              <p className="font-ui uppercase" style={{ fontSize: 10, fontWeight: 500, letterSpacing: 4, color: "var(--bc-text3)", marginBottom: 14 }}>Featured Cut</p>
              <RevealImage key={featured.id} style={{ overflow: "hidden" }}>
                <button
                  onClick={() => openVideo({ id: featured.id, title: featured.title })}
                  className="group relative overflow-hidden w-full border-none p-0 cursor-pointer text-left"
                  style={{ aspectRatio: "21 / 9", background: selectedBin.tint, border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <span
                    className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${featured.thumb})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.6 }}
                  />
                  <span className="absolute inset-0 transition-colors duration-300 group-hover:bg-black/30" />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                      style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", backdropFilter: "blur(4px)" }}
                    >
                      <span style={{ borderStyle: "solid", borderWidth: "10px 0 10px 18px", borderColor: "transparent transparent transparent #fff", marginLeft: 4 }} />
                    </span>
                  </span>
                  <span className="absolute bottom-0 left-0 right-0" style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.8))", padding: "40px 28px 24px" }}>
                    <span className="font-display uppercase block text-white" style={{ fontSize: "clamp(18px,3vw,32px)", lineHeight: 1 }}>{featured.title}</span>
                    {featured.duration && (
                      <span className="font-ui block text-white" style={{ fontSize: 12, opacity: 0.5, marginTop: 6, letterSpacing: 1 }}>{featured.duration}</span>
                    )}
                  </span>
                </button>
              </RevealImage>
            </div>
          )}

          {/* Remaining clips */}
          {rest.length > 0 && (
            <>
              <p className="font-ui uppercase" style={{ fontSize: 10, fontWeight: 500, letterSpacing: 4, color: "var(--bc-text3)", marginBottom: 20 }}>More From This Bin</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 3 }}>
                {rest.map((item) => (
                  <VideoCard key={item.id} item={item} onPlay={() => openVideo({ id: item.id, title: item.title })} />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Testimonials marquee ── */}
      <div style={{ borderTop: "1px solid var(--bc-border)", marginTop: 96, padding: "48px 0 80px", transition: "border-color 0.3s" }}>
        <div className="max-w-[1100px] mx-auto" style={{ padding: "0 24px", marginBottom: 24 }}>
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
