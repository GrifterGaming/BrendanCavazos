"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useSite, PageId } from "./SiteProvider";

const LINKS: { id: PageId; label: string }[] = [
  { id: "portfolio", label: "Work" },
  { id: "services", label: "Services" },
  { id: "about", label: "About" },
  { id: "testimonials", label: "Testimonials" },
  { id: "contact", label: "Contact" },
];

export default function Nav() {
  const { page, navigate, darkMode, toggleTheme } = useSite();
  const nav = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(nav.current, {
        y: -64,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        delay: 0.15,
      });
    },
    { scope: nav }
  );

  return (
    <nav
      ref={nav}
      className="fixed top-0 left-0 right-0 z-[100] h-16 flex items-center"
      style={{
        background: "var(--bc-nav)",
        borderBottom: "1px solid var(--bc-border)",
        backdropFilter: "blur(8px)",
        transition: "background 0.3s",
      }}
    >
      <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between px-6 md:px-12">
        <button
          onClick={() => navigate("home")}
          className="flex items-center gap-3.5 bg-transparent border-none cursor-pointer p-0"
        >
          <span
            className="font-display leading-none"
            style={{ fontSize: 22, color: "var(--bc-text)", letterSpacing: 4 }}
          >
            BC
          </span>
          <span style={{ width: 1, height: 16, background: "var(--bc-border2)" }} />
          <span
            className="font-ui uppercase hidden sm:inline"
            style={{ fontSize: 10, fontWeight: 500, color: "var(--bc-text3)", letterSpacing: 3 }}
          >
            Video Editor
          </span>
        </button>

        <div className="flex items-center gap-5 md:gap-9">
          <div className="hidden md:flex items-center gap-9">
            {LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => navigate(l.id)}
                className="bc-navlink"
                data-active={page === l.id}
              >
                {l.label}
              </button>
            ))}
          </div>
          <button
            onClick={toggleTheme}
            className="font-ui uppercase cursor-pointer"
            style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: 2,
              padding: "6px 14px",
              borderRadius: "var(--radius-full)",
              border: "1px solid var(--bc-border2)",
              color: "var(--bc-text3)",
              background: "var(--bc-surface)",
              transition: "all 0.2s",
            }}
          >
            {darkMode ? "☀ Light" : "◑ Dark"}
          </button>
        </div>
      </div>
    </nav>
  );
}
