"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Mobile browsers resize the viewport when the URL bar hides/shows, which
// re-measures every pin and makes sections jump mid-scroll.
ScrollTrigger.config({ ignoreMobileResize: true });

export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      // Lenis leaves touch scrolling native by default (syncTouch: false),
      // which desyncs from ScrollTrigger's scroll tracking and is why the
      // pinned Hero/Treatments/Gallery sections weren't holding on mobile —
      // this makes touch scroll go through the same virtual position Lenis
      // uses for wheel scroll, which ScrollTrigger.update stays in sync with.
      syncTouch: true,
    });

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Lazy-loaded images below the fold change document height after pins
    // are created; re-measure once everything has actually loaded so pinned
    // sections don't drift into/overlap each other.
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("load", onLoad);
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);

  return null;
}
