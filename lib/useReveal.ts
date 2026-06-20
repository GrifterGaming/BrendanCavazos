"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

/**
 * Scroll-reveal hook. Attach the returned ref to a container; every child
 * (or element) carrying the `.reveal` class fades + rises into view, staggered,
 * as the container enters the viewport. One job: reveal on scroll.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(options?: {
  y?: number;
  stagger?: number;
  start?: string;
  duration?: number;
}) {
  const ref = useRef<T>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const targets = el.querySelectorAll<HTMLElement>(".reveal");
      if (!targets.length) return;

      gsap.fromTo(
        targets,
        { opacity: 0, y: options?.y ?? 26 },
        {
          opacity: 1,
          y: 0,
          duration: options?.duration ?? 0.8,
          ease: "power3.out",
          stagger: options?.stagger ?? 0.09,
          scrollTrigger: {
            trigger: el,
            start: options?.start ?? "top 82%",
          },
        }
      );
    },
    { scope: ref }
  );

  return ref;
}
