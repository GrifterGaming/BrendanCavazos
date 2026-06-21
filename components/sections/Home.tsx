"use client";

import { useSite } from "../SiteProvider";
import { useReveal } from "@/lib/useReveal";
import Hero from "./Hero";
import Marquee from "../Marquee";
import { MARQUEE_SERVICES, SERVICES } from "@/lib/data";

export default function Home() {
  const { navigate, testimonials } = useSite();
  const servicesRef = useReveal<HTMLDivElement>();

  const marqueeQuotes = testimonials.map((t) => ({
    short: "“" + (t.quote.length > 65 ? t.quote.slice(0, 62) + "…" : t.quote) + "”",
    attribution: t.name + " — " + (t.role.split("·")[0] || t.role).trim(),
  }));

  return (
    <>
      <Hero />

      {/* Testimonials marquee */}
      <div
        style={{ background: "var(--bc-bg)", borderTop: "1px solid var(--bc-border)", borderBottom: "1px solid var(--bc-border)", padding: "18px 0", transition: "background 0.3s" }}
      >
        <Marquee>
          {marqueeQuotes.map((t, i) => (
            <span key={i} className="inline-flex items-center" style={{ gap: 36, paddingRight: 36, flexShrink: 0 }}>
              <span className="font-ui italic" style={{ fontSize: 12, color: "var(--bc-mq-text)" }}>{t.short}</span>
              <span className="font-ui uppercase" style={{ fontSize: 10, fontWeight: 600, letterSpacing: 2, color: "var(--accent)" }}>{t.attribution}</span>
              <span style={{ width: 4, height: 4, background: "var(--bc-border2)", borderRadius: "50%", flexShrink: 0 }} />
            </span>
          ))}
        </Marquee>
      </div>

      {/* Services preview list */}
      <div style={{ background: "var(--bc-bg)", padding: "80px 24px 0", transition: "background 0.3s" }}>
        <div ref={servicesRef} className="max-w-[1200px] mx-auto">
          <div
            className="reveal flex items-end justify-between"
            style={{ marginBottom: 48, borderBottom: "1px solid var(--bc-border)", paddingBottom: 24 }}
          >
            <div>
              <p className="font-ui uppercase" style={{ fontSize: 10, fontWeight: 500, letterSpacing: 4, color: "var(--accent)", marginBottom: 12 }}>What I Do</p>
              <h2 className="font-display uppercase" style={{ fontSize: "clamp(48px,6vw,80px)", color: "var(--bc-text)", lineHeight: 0.88 }}>SERVICES</h2>
            </div>
            <button
              onClick={() => navigate("services")}
              className="bg-transparent border-none cursor-pointer font-ui uppercase p-0"
              style={{ fontSize: 11, fontWeight: 500, color: "var(--bc-text3)", letterSpacing: 2, textDecoration: "underline", textUnderlineOffset: 4 }}
            >
              View All
            </button>
          </div>

          <div>
            {SERVICES.map((s) => (
              <button
                key={s.n}
                onClick={() => navigate("services")}
                className="reveal bc-service-row w-full flex items-center justify-between bg-transparent border-none cursor-pointer text-left"
                style={{ padding: "28px 0", borderBottom: "1px solid var(--bc-border)" }}
              >
                <span className="flex items-baseline gap-6">
                  <span className="font-ui" style={{ fontSize: 11, fontWeight: 600, color: "var(--accent)", letterSpacing: 2, minWidth: 24 }}>{s.n}</span>
                  <span className="font-display uppercase" style={{ fontSize: "clamp(28px,3.5vw,52px)", color: "var(--bc-text)", lineHeight: 1 }}>{s.flatTitle}</span>
                </span>
                <span className="font-ui bc-service-arrow" style={{ fontSize: 18, color: "var(--bc-text3)" }}>→</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Services ghost marquee */}
      <div style={{ background: "var(--bc-bg)", padding: "48px 0 80px", transition: "background 0.3s" }}>
        <Marquee variant="rev">
          <span className="inline-flex items-center" style={{ gap: 28, paddingRight: 28 }}>
            {MARQUEE_SERVICES.map((label) => (
              <span key={label} className="inline-flex items-center" style={{ gap: 28 }}>
                <span className="font-display uppercase" style={{ fontSize: "clamp(28px,4vw,56px)", color: "var(--bc-mq-ghost)", letterSpacing: 3 }}>{label}</span>
                <span style={{ width: 5, height: 5, background: "var(--accent)", borderRadius: "50%", flexShrink: 0, opacity: 0.3 }} />
              </span>
            ))}
          </span>
        </Marquee>
      </div>
    </>
  );
}
