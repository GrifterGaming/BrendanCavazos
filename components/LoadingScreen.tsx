"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * Cinematic loading screen. Counts 0 → 100, then slides up to reveal the site.
 * The counter and bar are driven straight through refs (not React state) so the
 * timeline never re-renders mid-flight. One job: cover, then get out of the way.
 */
export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const pctEl = useRef<HTMLParagraphElement>(null);
  const done = useRef(false);
  const finish = () => {
    if (done.current) return;
    done.current = true;
    onDone();
  };

  // Safety net: if the GSAP timeline can't run (e.g. the tab is backgrounded so
  // requestAnimationFrame is paused), still reveal the site so no one gets stuck.
  useEffect(() => {
    const t = setTimeout(finish, 4200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useGSAP(
    () => {
      const counter = { v: 0 };
      const tl = gsap.timeline();

      tl.from(".load-fade", {
        opacity: 0,
        y: 14,
        duration: 0.6,
        stagger: 0.12,
        ease: "power2.out",
      });

      tl.to(
        counter,
        {
          v: 100,
          duration: 1.4,
          ease: "power1.inOut",
          onUpdate: () => {
            const val = Math.round(counter.v);
            if (bar.current) bar.current.style.width = val + "%";
            if (pctEl.current) pctEl.current.textContent = val + "%";
          },
        },
        "-=0.2"
      );

      tl.to(root.current, {
        yPercent: -100,
        duration: 0.9,
        ease: "expo.inOut",
        delay: 0.2,
        onComplete: finish,
      });
    },
    { scope: root }
  );

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[500] flex flex-col items-center justify-center bg-black"
    >
      <p
        className="load-fade font-display uppercase leading-none text-white"
        style={{ fontSize: "clamp(80px,12vw,160px)", letterSpacing: "14px" }}
      >
        BC
      </p>
      <p
        className="load-fade font-ui uppercase"
        style={{ fontSize: 11, fontWeight: 500, letterSpacing: 5, color: "rgba(255,255,255,0.28)", marginTop: 18 }}
      >
        BRENDAN CAVAZOS
      </p>
      <div className="load-fade" style={{ marginTop: 56, display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ width: 88, height: 1, background: "rgba(255,255,255,0.1)", overflow: "hidden", position: "relative" }}>
          <div ref={bar} style={{ position: "absolute", top: 0, left: 0, height: "100%", width: "0%", background: "var(--accent)" }} />
        </div>
        <p
          ref={pctEl}
          className="font-ui"
          style={{ fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.3)", letterSpacing: 2, minWidth: 40 }}
        >
          0%
        </p>
      </div>
    </div>
  );
}
