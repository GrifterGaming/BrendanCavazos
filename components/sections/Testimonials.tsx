"use client";

import { useSite } from "../SiteProvider";
import { useReveal } from "@/lib/useReveal";
import RevealText from "../RevealText";
import Button from "../ui/Button";

export default function Testimonials() {
  const { navigate, darkMode, testimonials } = useSite();
  const ref = useReveal<HTMLDivElement>();
  const ctaVariant = darkMode ? "canvas" : "primary";

  return (
    <div style={{ background: "var(--bc-bg)", minHeight: "100vh", padding: "88px 24px 96px", transition: "background 0.3s" }}>
      <div ref={ref} className="max-w-[1200px] mx-auto">
        <div style={{ marginBottom: 72 }}>
          <p className="reveal font-ui uppercase" style={{ fontSize: 10, fontWeight: 500, letterSpacing: 4, color: "var(--accent)", marginBottom: 16 }}>What Clients Say</p>
          <RevealText className="font-display uppercase" style={{ fontSize: "clamp(64px,8vw,104px)", color: "var(--bc-text)", lineHeight: 0.87 }}>TESTIMONIALS</RevealText>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 3 }}>
          {testimonials.map((t) => (
            <div key={t.id} className="reveal flex flex-col" style={{ background: "var(--bc-surface)", padding: "56px 48px", gap: 32, transition: "background 0.3s" }}>
              <div style={{ width: 28, height: 2, background: "var(--accent)" }} />
              <p className="font-ui italic" style={{ fontSize: 18, color: "var(--bc-text)", lineHeight: 1.72, flex: 1 }}>&ldquo;{t.quote}&rdquo;</p>
              <div>
                <p className="font-ui uppercase" style={{ fontSize: 12, fontWeight: 600, color: "var(--bc-text)", letterSpacing: 2, marginBottom: 5 }}>{t.name}</p>
                <p className="font-ui" style={{ fontSize: 12, color: "var(--accent)" }}>{t.role}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between flex-wrap" style={{ borderTop: "1px solid var(--bc-border)", paddingTop: 64, marginTop: 64, gap: 24 }}>
          <div>
            <h3 className="font-display uppercase" style={{ fontSize: 52, color: "var(--bc-text)", lineHeight: 0.9 }}>WANT TO BE NEXT?</h3>
            <p className="font-ui" style={{ fontSize: 14, color: "var(--bc-text3)", marginTop: 10 }}>Available for freelance projects and collaborations.</p>
          </div>
          <Button variant={ctaVariant} size="lg" onClick={() => navigate("contact")}>Work With Me</Button>
        </div>
      </div>
    </div>
  );
}
