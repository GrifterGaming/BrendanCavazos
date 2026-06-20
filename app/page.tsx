"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { SiteProvider, useSite } from "@/components/SiteProvider";
import LoadingScreen from "@/components/LoadingScreen";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import VideoModal from "@/components/VideoModal";
import Home from "@/components/sections/Home";
import Services from "@/components/sections/Services";
import Work from "@/components/sections/Work";
import About from "@/components/sections/About";
import Testimonials from "@/components/sections/Testimonials";
import Contact from "@/components/sections/Contact";

function CurrentPage() {
  const { page } = useSite();
  switch (page) {
    case "home":
      return <Home />;
    case "services":
      return <Services />;
    case "portfolio":
      return <Work />;
    case "about":
      return <About />;
    case "testimonials":
      return <Testimonials />;
    case "contact":
      return <Contact />;
    default:
      return <Home />;
  }
}

function Shell() {
  const { page, transitioning } = useSite();
  const wrap = useRef<HTMLDivElement>(null);

  // Fade + lift each new view in as it mounts.
  useGSAP(
    () => {
      gsap.fromTo(
        wrap.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
    },
    { dependencies: [page], scope: wrap }
  );

  return (
    <>
      <Nav />
      <div style={{ opacity: transitioning ? 0 : 1, transition: "opacity 0.24s ease" }}>
        <div ref={wrap} key={page}>
          <CurrentPage />
        </div>
        <Footer />
      </div>
      <VideoModal />
    </>
  );
}

export default function Page() {
  const [loaded, setLoaded] = useState(false);

  return (
    <SiteProvider>
      {!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}
      <Shell />
    </SiteProvider>
  );
}
