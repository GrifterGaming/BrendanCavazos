"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useSite } from "../SiteProvider";
import { useReveal } from "@/lib/useReveal";
import RevealText from "../RevealText";
import Button from "../ui/Button";
import { TIMELINE } from "@/lib/data";

export default function About() {
  const { navigate, darkMode } = useSite();
  const ref = useReveal<HTMLDivElement>();
  const photoWrap = useRef<HTMLDivElement>(null);
  const ctaVariant = darkMode ? "canvas" : "primary";

  // Subtle parallax on the portrait + a clip-wipe reveal as it scrolls in.
  // Gated to "no reduced motion" so it stays still for those who prefer that.
  useGSAP(
    () => {
      const img = photoWrap.current?.querySelector("img");
      if (!img) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          img,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: "none",
            scrollTrigger: { trigger: photoWrap.current, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
        gsap.fromTo(
          photoWrap.current,
          { clipPath: "inset(0% 0% 100% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: photoWrap.current, start: "top 85%" },
          }
        );
      });
      return () => mm.revert();
    },
    { scope: photoWrap }
  );

  return (
    <div style={{ background: "var(--bc-bg)", minHeight: "100vh", padding: "88px 24px 96px", transition: "background 0.3s" }}>
      <div ref={ref} className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 items-start" style={{ gap: 80 }}>
          <div ref={photoWrap} className="overflow-hidden" style={{ aspectRatio: "3 / 4", position: "relative" }}>
            <Image
              src="/uploads/brendan-about.webp"
              alt="Brendan Cavazos"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 600px"
              style={{ objectFit: "cover", objectPosition: "center top", transform: "scale(1.12)" }}
            />
          </div>

          <div style={{ paddingTop: 16 }}>
            <p className="reveal font-ui uppercase" style={{ fontSize: 10, fontWeight: 500, letterSpacing: 4, color: "var(--accent)", marginBottom: 16 }}>The Editor</p>
            <RevealText className="font-display uppercase" style={{ fontSize: "clamp(52px,6vw,84px)", color: "var(--bc-text)", lineHeight: 0.87 }} wrapperStyle={{ marginBottom: 32 }}>BRENDAN<br />CAVAZOS</RevealText>
            <p className="reveal font-ui" style={{ fontSize: 16, color: "var(--bc-text2)", lineHeight: 1.8, marginBottom: 20 }}>
              Originally from Charlotte, NC, my career has been fueled by a love for sports and a degree in Communications from ECU. My journey in editing really took off at Fox Sports, where I worked as a Production Assistant for the iconic NASCAR Race Hub.
            </p>
            <p className="reveal font-ui" style={{ fontSize: 16, color: "var(--bc-text2)", lineHeight: 1.8, marginBottom: 44 }}>
              Since 2024, I&apos;ve been editing everything from weekly web shows to social content and live event broadcasts for Professional Bull Riders. Moving from PA to Video Editor in 2026 has allowed me to take more creative control, and I&apos;m currently looking to expand my portfolio and collaborate on new, exciting projects.
            </p>

            <div className="reveal" style={{ borderTop: "1px solid var(--bc-border)", paddingTop: 36, marginBottom: 44 }}>
              <p className="font-ui uppercase" style={{ fontSize: 10, fontWeight: 500, letterSpacing: 3, color: "var(--accent)", marginBottom: 24 }}>Timeline</p>
              <div className="flex flex-col" style={{ gap: 20 }}>
                {TIMELINE.map((row) => (
                  <div key={row.year + row.title} className="flex items-start" style={{ gap: 22 }}>
                    <span
                      className="font-ui"
                      style={{ fontSize: 11, fontWeight: 500, color: row.current ? "var(--accent)" : "var(--bc-text3)", letterSpacing: 1, minWidth: 44, lineHeight: 1.5 }}
                    >
                      {row.year}
                    </span>
                    <div>
                      <p className="font-ui" style={{ fontSize: 14, fontWeight: 500, color: row.current ? "var(--bc-text)" : "var(--bc-text2)", lineHeight: 1.4 }}>{row.title}</p>
                      <p className="font-ui" style={{ fontSize: 13, color: "var(--bc-text3)", lineHeight: 1.4 }}>{row.org}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="reveal">
              <Button variant={ctaVariant} size="lg" onClick={() => navigate("contact")}>Work With Me</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
