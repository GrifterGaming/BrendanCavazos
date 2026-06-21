"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

/**
 * Image reveal — a clip-path wipe (bottom→top) plus a gentle scale settle on the
 * inner content as it scrolls into view. Respects reduced-motion: when set, the
 * image just shows normally with no animation.
 */
export default function RevealImage({
  className,
  style,
  children,
  start = "top 88%",
}: {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  start?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = wrap.current;
      if (!el) return;
      const inner = el.firstElementChild;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          el,
          { clipPath: "inset(0% 0% 100% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start },
          }
        );
        if (inner) {
          gsap.fromTo(
            inner,
            { scale: 1.08 },
            {
              scale: 1,
              duration: 1.1,
              ease: "power3.out",
              scrollTrigger: { trigger: el, start },
            }
          );
        }
      });
      return () => mm.revert();
    },
    { scope: wrap }
  );

  return (
    <div ref={wrap} className={className} style={style}>
      {children}
    </div>
  );
}
