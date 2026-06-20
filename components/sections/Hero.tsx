"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useSite } from "../SiteProvider";
import Button from "../ui/Button";
import { YT_HERO_ID } from "@/lib/data";

const REEL_BG = `https://www.youtube.com/embed/${YT_HERO_ID}?autoplay=1&mute=1&loop=1&playlist=${YT_HERO_ID}&controls=0&showinfo=0&rel=0&playsinline=1&modestbranding=1`;

export default function Hero() {
  const { navigate } = useSite();
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-top", { opacity: 0, y: 16, duration: 0.7 })
        .from(".hero-line", { opacity: 0, yPercent: 110, duration: 0.9, stagger: 0.12 }, "-=0.35")
        .from(".hero-bottom", { opacity: 0, y: 24, duration: 0.8 }, "-=0.45");
    },
    { scope: ref }
  );

  return (
    <section ref={ref}>
      <div className="relative h-screen overflow-hidden" style={{ background: "#000" }}>
        <iframe
          src={REEL_BG}
          title="Hero reel"
          tabIndex={-1}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "177.8vh",
            height: "56.3vw",
            minWidth: "100%",
            minHeight: "100%",
            transform: "translate(-50%,-50%)",
            border: "none",
            pointerEvents: "none",
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        />
        <div className="absolute inset-0" style={{ background: "var(--bc-overlay)", transition: "background 0.3s" }} />
        <div className="absolute inset-0" style={{ boxShadow: "inset 0 0 180px rgba(0,0,0,0.65)" }} />
        <div
          className="absolute inset-0 z-[2] flex flex-col justify-between"
          style={{ padding: "88px 24px 52px" }}
        >
          <div className="hero-top flex justify-between items-start md:px-8">
            <p className="font-ui uppercase" style={{ fontSize: 11, fontWeight: 500, letterSpacing: 4, color: "rgba(255,255,255,0.5)" }}>
              Brendan Cavazos
            </p>
            <div className="text-right">
              <p className="font-ui uppercase" style={{ fontSize: 11, fontWeight: 500, letterSpacing: 3, color: "rgba(255,255,255,0.35)", lineHeight: 1.8 }}>
                Video Editor
              </p>
              <p className="font-ui uppercase" style={{ fontSize: 11, fontWeight: 500, letterSpacing: 3, color: "rgba(255,255,255,0.35)", lineHeight: 1.8 }}>
                FORT WORTH TX
              </p>
            </div>
          </div>
          <div className="md:px-8 overflow-hidden">
            <h1
              className="font-display uppercase text-white"
              style={{ fontSize: "clamp(64px,12vw,182px)", lineHeight: 0.84, letterSpacing: 2 }}
            >
              <span className="hero-line block">EDIT.</span>
              <span className="hero-line block" style={{ color: "var(--accent)" }}>FRAME.</span>
              <span className="hero-line block">DELIVER</span>
            </h1>
          </div>
          <div className="hero-bottom flex justify-between items-end md:px-8">
            <div className="flex gap-3 flex-wrap">
              <Button variant="canvas" size="lg" onClick={() => navigate("portfolio")}>View My Work</Button>
              <Button variant="secondary" size="lg" onClick={() => navigate("contact")}>Hire Me</Button>
            </div>
            <div className="hidden sm:flex flex-col items-center gap-2" style={{ opacity: 0.4 }}>
              <div style={{ width: 1, height: 36, background: "#fff" }} />
              <p className="font-ui uppercase text-white" style={{ fontSize: 9, letterSpacing: 3 }}>Scroll</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
