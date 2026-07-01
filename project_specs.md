# Project Specs — Brendan Cavazos Portfolio

## What it does / who uses it
A single-page portfolio for **Brendan Cavazos**, a video editor (Sports / Broadcast / Social Media).
Visitors browse his work, services, background, testimonials, and contact him.
Rebuilt faithfully from the Claude Design file `Portfolio.dc.html`, with GSAP animations added on top.

## Tech stack
- **Framework:** Next.js (App Router) + TypeScript
- **Styling:** Tailwind CSS + a ported design-token CSS layer (CSS variables for dark/light themes)
- **Animation:** GSAP + ScrollTrigger (via `@gsap/react` `useGSAP`)
- **Hosting target:** Vercel
- **No database.** One serverless API route (`/api/contact`) sends contact-form emails via Resend — everything else remains client-side. No Supabase needed for this build.

## Pages / user flows (single-page, client-side view switcher — matches the design)
Top nav switches between in-page views (no full reload), exactly like the original:
- **Home** — hero (3 switchable styles), testimonial marquee, services preview, ghost marquee
- **Work** — YouTube playlist embed by default; optional API-key input loads a video grid; click opens a video modal
- **Services** — 3 service cards, 4-step process, "ready to start" CTA
- **About** — photo, bio, timeline, CTA
- **Testimonials** — 2-col grid; inline edit mode (add/edit/remove, saved to localStorage)
- **Contact** — contact form (sends via API + reCAPTCHA); no email/phone shown on the site
All views are public. No authentication.

## Data models / storage
No server data. Browser `localStorage` only, mirroring the original:
- `bc_theme` — `dark` | `light`
- `bc_testimonials` — JSON array `{ id, name, role, quote }`
- `yt_api_key` — optional YouTube Data API key the visitor pastes to load the work grid

## Third-party services
- **YouTube** — hero reel embed + work playlist embed; optional YouTube Data API v3 (key supplied by the visitor, never committed)
- **Resend** — transactional email for the contact form (server-side only; no submissions are stored, just sent and logged transiently to the server console)
- **Google reCAPTCHA v2** — spam protection (checkbox) on the contact form
- No Stripe, no Supabase, no auth.

## Brand / design system (from the imported design)
- Palette: near-monochrome. Dark theme default (`#0a0a0a` bg, white text), light theme toggle (`#f5f5f5`). Single accent red `#c41230`.
- Type: **Bebas Neue** (display, uppercase) + **Inter** (UI), via Google Fonts.
- Geometry: flat cards (no radius/shadow), pill CTAs (radius 30px). No gradients.

## Animations (GSAP — tasteful, not cheesy; respects prefers-reduced-motion)
- Loading screen counts up, then slides away to reveal the hero
- Hero lockup reveals line-by-line; nav fades in
- Cross-view transition (fade + slight slide) when switching nav items
- ScrollTrigger reveals on services rows, service cards, process steps, about, testimonial cards, contact blocks
- Accent "rule" lines draw in (scaleX); subtle hero/photo parallax
- Marquees run as smooth CSS loops; buttons use opacity hover + scale(0.98) press

## What "done" looks like
- `npm run build` passes with no TypeScript/build errors
- `npm run dev` runs with no console errors
- All six views render and switch; theme toggle works and persists; hero switcher works; work playlist shows; testimonials edit + persist; contact form sends via the API route with reCAPTCHA; video modal opens/closes
- Layout matches the design on desktop and is responsive on mobile
