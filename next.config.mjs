/** @type {import('next').NextConfig} */
const nextConfig = {
  // Off so the one-shot GSAP intro animations (loading screen, hero, nav, page
  // transitions) aren't double-invoked in dev. Has no effect on production.
  reactStrictMode: false,
};

export default nextConfig;
