"use client";

import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useSite, PageId } from "./SiteProvider";
import { getLenis, subscribeToLenisScroll } from "./SmoothScroll";

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
  const overlay = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);

  // Slide-in on mount
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

  // Scroll-hide: nav slides up when scrolling down, comes back on scroll up.
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const handleScroll = ({ scroll }: { scroll: number }) => {
        if (menuOpen) return;
        const direction = scroll > lastY.current ? "down" : "up";
        lastY.current = scroll;
        if (direction === "down" && scroll > 80) {
          gsap.to(nav.current, { yPercent: -100, duration: 0.35, ease: "power2.inOut", overwrite: "auto" });
        } else {
          gsap.to(nav.current, { yPercent: 0, duration: 0.35, ease: "power2.inOut", overwrite: "auto" });
        }
      };
      const unsub = subscribeToLenisScroll(handleScroll);
      return unsub;
    });
    return () => mm.revert();
  }, [menuOpen]);

  // Overlay open/close animation + scroll lock
  useEffect(() => {
    if (!overlay.current) return;
    const links = overlay.current.querySelectorAll("[data-menu-link]");
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (menuOpen) {
      // Snap nav back into view whenever the menu opens
      gsap.to(nav.current, { yPercent: 0, duration: 0.2, ease: "power2.out", overwrite: true });
      getLenis()?.stop();
      gsap.to(overlay.current, { opacity: 1, duration: 0.25, ease: "none" });
      gsap.set(links, { yPercent: prefersReduced ? 0 : 40, opacity: prefersReduced ? 1 : 0 });
      if (!prefersReduced) {
        gsap.to(links, { yPercent: 0, opacity: 1, duration: 0.5, ease: "power3.out", stagger: 0.07, delay: 0.12 });
      }
    } else {
      getLenis()?.start();
      gsap.to(overlay.current, { opacity: 0, duration: 0.2, ease: "none" });
    }
  }, [menuOpen]);

  // Escape closes menu
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const handleNavigate = (id: PageId) => {
    setMenuOpen(false);
    navigate(id);
  };

  return (
    <>
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
          {/* Logo */}
          <button
            onClick={() => handleNavigate("home")}
            className="flex items-center gap-3.5 bg-transparent border-none cursor-pointer p-0"
          >
            <span className="font-display leading-none" style={{ fontSize: 22, color: "var(--bc-text)", letterSpacing: 4 }}>
              BC
            </span>
            <span style={{ width: 1, height: 16, background: "var(--bc-border2)" }} />
            <span className="font-ui uppercase hidden sm:inline" style={{ fontSize: 10, fontWeight: 500, color: "var(--bc-text3)", letterSpacing: 3 }}>
              Video Editor
            </span>
          </button>

          <div className="flex items-center gap-5 md:gap-9">
            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-9">
              {LINKS.map((l) => (
                <button key={l.id} onClick={() => navigate(l.id)} className="bc-navlink" data-active={page === l.id}>
                  {l.label}
                </button>
              ))}
            </div>

            {/* Theme toggle — hidden on mobile (available in overlay) */}
            <button
              onClick={toggleTheme}
              className="font-ui uppercase cursor-pointer hidden sm:block"
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

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex md:hidden flex-col items-center justify-center bg-transparent border-none cursor-pointer"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              style={{ gap: 5, width: 36, height: 36, padding: 6 }}
            >
              <span
                style={{
                  display: "block",
                  width: 22,
                  height: 1.5,
                  background: "var(--bc-text)",
                  borderRadius: 1,
                  transition: "transform 0.25s ease",
                  transform: menuOpen ? "translateY(3.25px) rotate(45deg)" : "none",
                }}
              />
              <span
                style={{
                  display: "block",
                  width: 22,
                  height: 1.5,
                  background: "var(--bc-text)",
                  borderRadius: 1,
                  transition: "transform 0.25s ease",
                  transform: menuOpen ? "translateY(-3.25px) rotate(-45deg)" : "none",
                }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile full-screen overlay menu — sits behind the nav bar (z-99) */}
      <div
        ref={overlay}
        className="md:hidden fixed inset-0 z-[99] flex flex-col items-center justify-center"
        style={{
          background: "var(--bc-bg)",
          opacity: 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transition: "background 0.3s",
        }}
      >
        <div className="flex flex-col items-center" style={{ gap: 4 }}>
          {LINKS.map((l) => (
            <button
              key={l.id}
              data-menu-link
              onClick={() => handleNavigate(l.id)}
              className="font-display uppercase bg-transparent border-none cursor-pointer bc-navlink"
              style={{
                fontSize: "clamp(44px,11vw,72px)",
                color: l.id === page ? "var(--bc-text)" : "var(--bc-text3)",
                lineHeight: 1.1,
                letterSpacing: 2,
              }}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Theme toggle inside overlay */}
        <button
          data-menu-link
          onClick={toggleTheme}
          className="font-ui uppercase cursor-pointer"
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: 2,
            padding: "8px 20px",
            borderRadius: "var(--radius-full)",
            border: "1px solid var(--bc-border2)",
            color: "var(--bc-text3)",
            background: "transparent",
            marginTop: 40,
          }}
        >
          {darkMode ? "☀ Light" : "◑ Dark"}
        </button>
      </div>
    </>
  );
}
