"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { DEFAULT_TESTIMONIALS, Testimonial } from "@/lib/data";

export type PageId =
  | "home"
  | "portfolio"
  | "services"
  | "about"
  | "testimonials"
  | "contact";

export type ActiveVideo = { id: string; title: string } | null;

type SiteState = {
  page: PageId;
  transitioning: boolean;
  navigate: (page: PageId) => void;

  darkMode: boolean;
  toggleTheme: () => void;

  activeVideo: ActiveVideo;
  openVideo: (v: { id: string; title: string }) => void;
  closeVideo: () => void;

  testimonials: Testimonial[];
};

const SiteContext = createContext<SiteState | null>(null);

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used inside <SiteProvider>");
  return ctx;
}

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [page, setPage] = useState<PageId>("home");
  const [transitioning, setTransitioning] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [activeVideo, setActiveVideo] = useState<ActiveVideo>(null);
  const [testimonials] = useState<Testimonial[]>(DEFAULT_TESTIMONIALS);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Restore theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("bc_theme") || "dark";
    if (savedTheme === "light") {
      document.documentElement.setAttribute("data-light", "");
      setDarkMode(false);
    }
  }, []);

  const navigate = useCallback(
    (next: PageId) => {
      if (next === page) {
        window.scrollTo(0, 0);
        return;
      }
      setTransitioning(true);
      if (transitionTimer.current) clearTimeout(transitionTimer.current);
      transitionTimer.current = setTimeout(() => {
        setPage(next);
        setTransitioning(false);
        window.scrollTo(0, 0);
      }, 240);
    },
    [page]
  );

  const toggleTheme = useCallback(() => {
    setDarkMode((prev) => {
      const next = !prev;
      if (next) document.documentElement.removeAttribute("data-light");
      else document.documentElement.setAttribute("data-light", "");
      localStorage.setItem("bc_theme", next ? "dark" : "light");
      return next;
    });
  }, []);

  const value: SiteState = {
    page,
    transitioning,
    navigate,
    darkMode,
    toggleTheme,
    activeVideo,
    openVideo: (v) => setActiveVideo(v),
    closeVideo: () => setActiveVideo(null),
    testimonials,
  };

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}
