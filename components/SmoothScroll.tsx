"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Module singleton so other code (navigation, modal) can reach the active
// Lenis instance without prop-drilling.
let lenis: Lenis | null = null;
export function getLenis() {
  return lenis;
}

/**
 * Buttery momentum scrolling, synced to GSAP's ticker so every ScrollTrigger
 * animation stays in lockstep. Skipped entirely when the visitor asked for
 * reduced motion — then the browser's native scroll is used.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    lenis = new Lenis({ duration: 1.1, smoothWheel: true });

    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => {
      lenis?.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  return null;
}
