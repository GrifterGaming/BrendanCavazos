"use client";

import { useSite, PageId } from "./SiteProvider";

const LINKS: { id: PageId; label: string }[] = [
  { id: "portfolio", label: "Work" },
  { id: "services", label: "Services" },
  { id: "about", label: "About" },
  { id: "testimonials", label: "Testimonials" },
  { id: "contact", label: "Contact" },
];

export default function Footer() {
  const { navigate } = useSite();
  return (
    <footer
      className="px-6 md:px-14 py-8"
      style={{ background: "var(--bc-footer)", borderTop: "1px solid var(--bc-border)", transition: "background 0.3s" }}
    >
      <div className="max-w-[1440px] mx-auto flex items-center justify-between flex-wrap gap-4">
        <span
          className="font-display uppercase"
          style={{ fontSize: 18, color: "var(--bc-text3)", letterSpacing: 4 }}
        >
          BRENDAN CAVAZOS
        </span>
        <div className="flex items-center gap-6 md:gap-8 flex-wrap">
          {LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => navigate(l.id)}
              className="bg-transparent border-none cursor-pointer p-0 font-ui uppercase"
              style={{ fontSize: 10, fontWeight: 500, color: "var(--bc-text4)", letterSpacing: 2, transition: "color 0.3s" }}
            >
              {l.label}
            </button>
          ))}
        </div>
        <span className="font-ui" style={{ fontSize: 11, color: "var(--bc-text5)" }}>
          © 2026 Brendan Cavazos
        </span>
      </div>
    </footer>
  );
}
