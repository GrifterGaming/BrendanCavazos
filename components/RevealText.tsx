"use client";

import { useRef, type CSSProperties, type ElementType, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

/**
 * Masked headline reveal — the text wipes up from behind an invisible edge as it
 * scrolls into view, matching the hero's EDIT/FRAME/DELIVER effect. Layout margins
 * go on `wrapperStyle` (the clipping box); visual text styles go on `style`.
 * Respects reduced-motion: when set, the text simply stays visible, no animation.
 */
export default function RevealText({
  as: Tag = "h2",
  className,
  style,
  wrapperStyle,
  children,
  start = "top 86%",
}: {
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  wrapperStyle?: CSSProperties;
  children: ReactNode;
  start?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const inner = wrap.current?.firstElementChild;
      if (!inner) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          inner,
          { yPercent: 118 },
          {
            yPercent: 0,
            duration: 0.95,
            ease: "power3.out",
            scrollTrigger: { trigger: wrap.current, start },
          }
        );
      });
      return () => mm.revert();
    },
    { scope: wrap }
  );

  return (
    <div ref={wrap} style={{ overflow: "hidden", ...wrapperStyle }}>
      <Tag className={className} style={{ ...style, display: "block", willChange: "transform" }}>
        {children}
      </Tag>
    </div>
  );
}
