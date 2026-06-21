"use client";

import { useSite } from "../SiteProvider";
import { useReveal } from "@/lib/useReveal";
import RevealText from "../RevealText";
import Button from "../ui/Button";
import { PROCESS, SERVICES } from "@/lib/data";

export default function Services() {
  const { navigate, darkMode } = useSite();
  const ref = useReveal<HTMLDivElement>();
  const ctaVariant = darkMode ? "canvas" : "primary";

  return (
    <div style={{ background: "var(--bc-bg)", minHeight: "100vh", padding: "88px 24px 96px", transition: "background 0.3s" }}>
      <div ref={ref} className="max-w-[1200px] mx-auto">
        <p className="reveal font-ui uppercase" style={{ fontSize: 10, fontWeight: 500, letterSpacing: 4, color: "var(--accent)", marginBottom: 16 }}>What I Do</p>
        <RevealText className="font-display uppercase" style={{ fontSize: "clamp(64px,8vw,104px)", color: "var(--bc-text)", lineHeight: 0.87 }} wrapperStyle={{ marginBottom: 64 }}>SERVICES</RevealText>

        {/* Service cards */}
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 2, marginBottom: 2 }}>
          {SERVICES.map((s) => (
            <div key={s.n} className="reveal bc-card flex flex-col" style={{ background: "var(--bc-surface)", padding: "56px 44px", transition: "background 0.3s" }}>
              <div style={{ width: 28, height: 2, background: "var(--accent)", marginBottom: 36 }} />
              <p className="font-ui uppercase" style={{ fontSize: 10, fontWeight: 600, letterSpacing: 3, color: "var(--accent)", marginBottom: 18 }}>{s.n}</p>
              <h3 className="font-display uppercase" style={{ fontSize: 52, color: "var(--bc-text)", lineHeight: 0.93, marginBottom: 24 }}>
                {s.titleLines[0]}<br />{s.titleLines[1]}
              </h3>
              <p className="font-ui" style={{ fontSize: 15, color: "var(--bc-text2)", lineHeight: 1.75, marginBottom: 40, flex: 1 }}>{s.body}</p>
              <Button variant="secondary" size="md" onClick={() => navigate("contact")}>Get a Quote</Button>
            </div>
          ))}
        </div>

        {/* Process */}
        <div style={{ borderTop: "1px solid var(--bc-border)", paddingTop: 72, marginTop: 72 }}>
          <p className="reveal font-ui uppercase" style={{ fontSize: 10, fontWeight: 500, letterSpacing: 4, color: "var(--accent)", marginBottom: 16 }}>The Process</p>
          <h3 className="reveal font-display uppercase" style={{ fontSize: 64, color: "var(--bc-text)", lineHeight: 0.9, marginBottom: 48 }}>HOW IT WORKS</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: 2 }}>
            {PROCESS.map((p) => (
              <div key={p.n} className="reveal bc-card" style={{ background: "var(--bc-surface)", padding: "36px 32px", transition: "background 0.3s" }}>
                <p className="font-display" style={{ fontSize: 56, color: "rgba(196,18,48,0.15)", lineHeight: 1, marginBottom: 16 }}>{p.n}</p>
                <p className="font-ui uppercase" style={{ fontSize: 11, fontWeight: 500, color: "var(--bc-text)", letterSpacing: 2, marginBottom: 10 }}>{p.title}</p>
                <p className="font-ui" style={{ fontSize: 13, color: "var(--bc-text3)", lineHeight: 1.7 }}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div
          className="reveal flex items-center justify-between flex-wrap"
          style={{ marginTop: 2, background: "var(--bc-surface)", padding: "48px 44px", gap: 24, transition: "background 0.3s" }}
        >
          <div>
            <h3 className="font-display uppercase" style={{ fontSize: 52, color: "var(--bc-text)", lineHeight: 0.9 }}>READY TO START?</h3>
            <p className="font-ui" style={{ fontSize: 14, color: "var(--bc-text3)", marginTop: 10 }}>Available for freelance projects and collaborations.</p>
          </div>
          <Button variant={ctaVariant} size="lg" onClick={() => navigate("contact")}>Get In Touch</Button>
        </div>
      </div>
    </div>
  );
}
