"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HERO_LANDING = "/images/hero-landing.jpg";
const POSTER_EXPLODED = "/frames/frame_151.jpg";

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const landingRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    if (mq.matches) return;

    const video = videoRef.current;
    if (!video) return;

    let st: ScrollTrigger | null = null;
    let rafId: number | null = null;
    let pendingProgress = 0;

    function setupScrub() {
      if (!video || !video.duration) return;
      video.currentTime = 0;

      // Tween currentTime instead of snapping it, so each scroll tick eases
      // into the target frame rather than jumping straight there.
      const seek = gsap.quickTo(video, "currentTime", {
        duration: 0.4,
        ease: "power2.out",
      });

      st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=250%",
        scrub: 1.5,
        pin: true,
        onUpdate: (self) => {
          pendingProgress = self.progress;

          if (rafId === null) {
            rafId = requestAnimationFrame(() => {
              seek(pendingProgress * video.duration);
              rafId = null;
            });
          }

          const revealProgress = gsap.utils.clamp(0, 1, (self.progress - 0.75) / 0.25);
          gsap.set(headlineRef.current, {
            opacity: revealProgress,
            y: 24 * (1 - revealProgress),
          });

          // The static landing image covers the video until scrolling
          // begins, then quickly fades to reveal the scrub underneath.
          const landingOpacity = 1 - gsap.utils.clamp(0, 1, self.progress / 0.08);
          gsap.set(landingRef.current, { opacity: landingOpacity });
        },
      });
    }

    if (video.readyState >= 1) {
      setupScrub();
    } else {
      video.addEventListener("loadedmetadata", setupScrub, { once: true });
    }

    const onError = () => setVideoFailed(true);
    video.addEventListener("error", onError);

    return () => {
      video.removeEventListener("loadedmetadata", setupScrub);
      video.removeEventListener("error", onError);
      if (rafId) cancelAnimationFrame(rafId);
      st?.kill();
    };
  }, []);

  const showStaticFallback = reducedMotion || videoFailed;

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-espresso-deep"
    >
      {showStaticFallback ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${POSTER_EXPLODED})` }}
        />
      ) : (
        <>
          <video
            ref={videoRef}
            muted
            playsInline
            preload="auto"
            poster={HERO_LANDING}
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src="/video/spadro-hero.mp4" type="video/mp4" />
          </video>
          <div
            ref={landingRef}
            className="pointer-events-none absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${HERO_LANDING})` }}
          />
        </>
      )}

      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <div
          ref={headlineRef}
          style={showStaticFallback ? {} : { opacity: 0 }}
        >
          <h1
            className="font-serif text-5xl italic tracking-tightest text-cream sm:text-7xl md:text-8xl"
            style={{ textShadow: "0 4px 20px rgba(0,0,0,0.85)" }}
          >
            The Art of Doing Nothing
          </h1>
          <p
            className="mt-6 font-sans text-sm font-medium uppercase tracking-[0.25em] text-cream sm:text-base"
            style={{ textShadow: "0 2px 12px rgba(0,0,0,0.85)" }}
          >
            SPADRO &middot; Ritual bodywork, undone slowly
          </p>
        </div>
      </div>
    </section>
  );
}
