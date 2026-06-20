"use client";

import { useState } from "react";
import { useSite } from "../SiteProvider";
import { useReveal } from "@/lib/useReveal";
import Button from "../ui/Button";
import { CONTACT } from "@/lib/data";

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

export default function Contact() {
  const { darkMode } = useSite();
  const ref = useReveal<HTMLDivElement>();
  const ctaVariant = darkMode ? "canvas" : "primary";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const sub = encodeURIComponent("Portfolio Inquiry from " + name);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    window.location.href = `mailto:${CONTACT.email}?subject=${sub}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <div style={{ background: "var(--bc-bg)", minHeight: "100vh", padding: "88px 24px 96px", transition: "background 0.3s" }}>
      <div ref={ref} className="max-w-[900px] mx-auto">
        <p className="reveal font-ui uppercase" style={{ fontSize: 10, fontWeight: 500, letterSpacing: 4, color: "var(--accent)", marginBottom: 16 }}>Let&apos;s Work</p>
        <h2 className="reveal font-display uppercase" style={{ fontSize: "clamp(64px,8vw,104px)", color: "var(--bc-text)", lineHeight: 0.87, marginBottom: 52 }}>GET IN<br />TOUCH</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 2, marginBottom: 56 }}>
          <div className="reveal" style={{ background: "var(--bc-surface)", padding: "32px 36px", transition: "background 0.3s" }}>
            <p className="font-ui uppercase" style={{ fontSize: 10, fontWeight: 500, letterSpacing: 3, color: "var(--accent)", marginBottom: 12 }}>Email</p>
            <a href={`mailto:${CONTACT.email}`} className="font-ui" style={{ fontSize: 16, fontWeight: 500, color: "var(--bc-text)", textDecoration: "none", wordBreak: "break-word" }}>{CONTACT.email}</a>
          </div>
          <div className="reveal" style={{ background: "var(--bc-surface)", padding: "32px 36px", transition: "background 0.3s" }}>
            <p className="font-ui uppercase" style={{ fontSize: 10, fontWeight: 500, letterSpacing: 3, color: "var(--accent)", marginBottom: 12 }}>Phone</p>
            <a href={`tel:${CONTACT.phoneHref}`} className="font-ui" style={{ fontSize: 16, fontWeight: 500, color: "var(--bc-text)", textDecoration: "none" }}>{CONTACT.phone}</a>
          </div>
        </div>

        {submitted ? (
          <div className="reveal text-center" style={{ background: "var(--bc-surface)", padding: 56, transition: "background 0.3s" }}>
            <div className="flex items-center justify-center mx-auto" style={{ width: 52, height: 52, background: "var(--accent)", borderRadius: "50%", marginBottom: 22 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <h3 className="font-display uppercase" style={{ fontSize: 48, color: "var(--bc-text)", marginBottom: 12 }}>Message Sent</h3>
            <p className="font-ui" style={{ fontSize: 15, color: "var(--bc-text3)", lineHeight: 1.6 }}>I&apos;ll be in touch soon. Looking forward to working together.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="reveal flex flex-col" style={{ gap: 16 }}>
            <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 16 }}>
              <div className="flex flex-col" style={{ gap: 8 }}>
                <label style={labelStyle}>Name</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" style={inputStyle} />
              </div>
              <div className="flex flex-col" style={{ gap: 8 }}>
                <label style={labelStyle}>Email</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" style={inputStyle} />
              </div>
            </div>
            <div className="flex flex-col" style={{ gap: 8 }}>
              <label style={labelStyle}>Message</label>
              <textarea required rows={6} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell me about your project..." style={{ ...inputStyle, resize: "vertical", minHeight: 140 }} />
            </div>
            <div>
              <Button type="submit" variant={ctaVariant} size="lg">Send Message</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
