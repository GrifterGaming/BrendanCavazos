"use client";

import { useRef, useState } from "react";
import Script from "next/script";
import { useSite } from "../SiteProvider";
import { useReveal } from "@/lib/useReveal";
import RevealText from "../RevealText";
import Button from "../ui/Button";
import { SERVICES } from "@/lib/data";

declare global {
  interface Window {
    grecaptcha: any;
  }
}

const inputStyle: React.CSSProperties = {
  background: "var(--bc-input-bg)",
  border: "1px solid var(--bc-input-bdr)",
  borderRadius: 0,
  padding: "14px 18px",
  color: "var(--bc-text)",
  fontFamily: "var(--font-ui)",
  fontSize: 15,
  width: "100%",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-ui)",
  fontSize: 10,
  fontWeight: 500,
  letterSpacing: 2.5,
  color: "var(--bc-text3)",
  textTransform: "uppercase",
};

const pillStyle = (active: boolean): React.CSSProperties => ({
  background: active ? "var(--accent)" : "var(--bc-input-bg)",
  border: `1px solid ${active ? "var(--accent)" : "var(--bc-input-bdr)"}`,
  borderRadius: 30,
  padding: "10px 20px",
  color: active ? "#fff" : "var(--bc-text)",
  fontFamily: "var(--font-ui)",
  fontSize: 13,
  fontWeight: 500,
  cursor: "pointer",
  transition: "background 0.2s, border-color 0.2s, color 0.2s",
});

type Status = "idle" | "sending" | "sent" | "error";

export default function Contact() {
  const { darkMode } = useSite();
  const ref = useReveal<HTMLDivElement>();
  const ctaVariant = darkMode ? "canvas" : "primary";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [projectTypes, setProjectTypes] = useState<string[]>([]);
  const [honeypot, setHoneypot] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const recaptchaRef = useRef<HTMLDivElement>(null);
  const recaptchaWidgetId = useRef<number | null>(null);

  const renderRecaptcha = () => {
    if (!window.grecaptcha || !process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) return;
    window.grecaptcha.ready(() => {
      if (!recaptchaRef.current || recaptchaWidgetId.current !== null) return;
      recaptchaWidgetId.current = window.grecaptcha.render(recaptchaRef.current, {
        sitekey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
        callback: (token: string) => setCaptchaToken(token),
        "expired-callback": () => setCaptchaToken(null),
      });
    });
  };

  const toggleProjectType = (label: string) => {
    setProjectTypes((prev) =>
      prev.includes(label) ? prev.filter((t) => t !== label) : [...prev, label]
    );
  };

  const resetRecaptcha = () => {
    setCaptchaToken(null);
    if (window.grecaptcha && recaptchaWidgetId.current !== null) {
      window.grecaptcha.reset(recaptchaWidgetId.current);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!captchaToken) {
      setStatus("error");
      setErrorMsg("Please complete the reCAPTCHA.");
      return;
    }

    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message, projectTypes, captchaToken, honeypot }),
      });
      const data = await res.json();

      if (res.ok && data.ok) {
        setStatus("sent");
      } else {
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong. Please try again.");
        resetRecaptcha();
      }
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
      resetRecaptcha();
    }
  };

  return (
    <div style={{ background: "var(--bc-bg)", minHeight: "100vh", padding: "88px 24px 96px", transition: "background 0.3s" }}>
      <Script src="https://www.google.com/recaptcha/api.js" strategy="lazyOnload" onLoad={renderRecaptcha} />
      <div ref={ref} className="max-w-[900px] mx-auto">
        <p className="reveal font-ui uppercase" style={{ fontSize: 10, fontWeight: 500, letterSpacing: 4, color: "var(--accent)", marginBottom: 16 }}>Let&apos;s Work</p>
        <RevealText className="font-display uppercase" style={{ fontSize: "clamp(64px,8vw,104px)", color: "var(--bc-text)", lineHeight: 0.87 }} wrapperStyle={{ marginBottom: 52 }}>GET IN<br />TOUCH</RevealText>

        {status === "sent" ? (
          <div className="reveal text-center" style={{ background: "var(--bc-surface)", padding: 56, transition: "background 0.3s" }}>
            <div className="flex items-center justify-center mx-auto" style={{ width: 52, height: 52, background: "var(--accent)", borderRadius: "50%", marginBottom: 22 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <h3 className="font-display uppercase" style={{ fontSize: 48, color: "var(--bc-text)", marginBottom: 12 }}>Message Sent</h3>
            <p className="font-ui" style={{ fontSize: 15, color: "var(--bc-text3)", lineHeight: 1.6 }}>I&apos;ll be in touch soon. Looking forward to working together.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="reveal flex flex-col" style={{ gap: 16 }}>
            <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: 16 }}>
              <div className="flex flex-col" style={{ gap: 8 }}>
                <label style={labelStyle}>Name</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" style={inputStyle} />
              </div>
              <div className="flex flex-col" style={{ gap: 8 }}>
                <label style={labelStyle}>Email</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" style={inputStyle} />
              </div>
              <div className="flex flex-col" style={{ gap: 8 }}>
                <label style={labelStyle}>Phone (Optional)</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(000) 000-0000" style={inputStyle} />
              </div>
            </div>

            <div className="flex flex-col" style={{ gap: 10 }}>
              <label style={labelStyle}>What Do You Need Help With? (Optional)</label>
              <div className="flex flex-wrap" style={{ gap: 10 }}>
                {SERVICES.map((s) => (
                  <button
                    key={s.flatTitle}
                    type="button"
                    onClick={() => toggleProjectType(s.flatTitle)}
                    style={pillStyle(projectTypes.includes(s.flatTitle))}
                  >
                    {s.flatTitle}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col" style={{ gap: 8 }}>
              <label style={labelStyle}>About Your Project</label>
              <textarea required rows={6} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell me about your project..." style={{ ...inputStyle, resize: "vertical", minHeight: 140 }} />
            </div>

            {/* Spam trap — hidden from real visitors, bots that auto-fill every field land here */}
            <input
              type="text"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
            />

            <div ref={recaptchaRef} />

            {status === "error" && (
              <p className="font-ui" style={{ fontSize: 14, color: "var(--accent)" }}>{errorMsg}</p>
            )}

            <div>
              <Button type="submit" variant={ctaVariant} size="lg" disabled={status === "sending"}>
                {status === "sending" ? "Sending..." : "Send Message"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
