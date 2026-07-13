"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HERO_LANDING = "/images/hero-landing.jpg";
const POSTER_EXPLODED = "/frames/frame_151.jpg";

// WebP frames extracted at native resolution from the dedicated 9:16 mobile
// hero video — on mobile the video is scrubbed by drawing these onto a
// canvas, because seeking a paused <video> doesn't repaint on several mobile
// browsers, while a canvas draw IS the repaint and works everywhere.
const MOBILE_FRAME_COUNT = 150;
const mobileFrameSrc = (i: number) =>
  `/hero-mobile-frames/frame_${String(i + 1).padStart(3, "0")}.webp`;

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const landingRef = useRef<HTMLDivElement>(null);
  // The pin's onUpdate calls whatever renderer is wired in here — the video
  // seeker on desktop, the canvas frame drawer on mobile. Kept in a ref so
  // the pin itself never has to wait for the media element to exist.
  const renderFrameRef = useRef<((progress: number) => void) | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  // null until matchMedia runs on the client — neither the video nor the
  // canvas renders before then, so phones never download the 12MB desktop
  // video and desktops never download the mobile frame sequence.
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  // The pin MUST be created synchronously on first mount: ScrollTrigger
  // refreshes pins in creation order, so a pin high on the page that is
  // created after the pins below it makes every lower section mis-measure
  // and overlap. Only the media renderer (which needs the video/canvas
  // element from the next render) is deferred, via renderFrameRef.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    if (mq.matches) return;

    setIsMobile(window.matchMedia("(max-width: 768px)").matches);

    let rafId: number | null = null;
    let pendingProgress = 0;

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "+=250%",
      scrub: 1.5,
      pin: true,
      onUpdate: (self) => {
        pendingProgress = self.progress;

        if (rafId === null) {
          rafId = requestAnimationFrame(() => {
            renderFrameRef.current?.(pendingProgress);
            rafId = null;
          });
        }

        const revealProgress = gsap.utils.clamp(0, 1, (self.progress - 0.75) / 0.25);
        gsap.set(headlineRef.current, {
          opacity: revealProgress,
          y: 24 * (1 - revealProgress),
        });

        // The static landing image covers the video until scrolling
        // begins, then quickly fades to reveal the video underneath.
        const landingOpacity = 1 - gsap.utils.clamp(0, 1, self.progress / 0.08);
        gsap.set(landingRef.current, { opacity: landingOpacity });
      },
    });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      st.kill();
    };
  }, []);

  // Wires the actual frame renderer once the media element for this device
  // class has rendered.
  useEffect(() => {
    if (isMobile === null) return;

    if (isMobile) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);

      const loaded: boolean[] = new Array(MOBILE_FRAME_COUNT).fill(false);
      const frames: HTMLImageElement[] = [];
      let lastDrawn = -1;

      const drawCover = (img: HTMLImageElement) => {
        const s = Math.max(canvas.width / img.width, canvas.height / img.height);
        const w = img.width * s;
        const h = img.height * s;
        ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
      };

      renderFrameRef.current = (progress) => {
        let idx = Math.round(progress * (MOBILE_FRAME_COUNT - 1));
        // if the exact frame hasn't arrived yet, show the nearest earlier
        // one so the scrub degrades to slightly coarser, never to frozen
        while (idx > 0 && !loaded[idx]) idx--;
        if (!loaded[idx] || idx === lastDrawn) return;
        lastDrawn = idx;
        drawCover(frames[idx]);
      };

      for (let i = 0; i < MOBILE_FRAME_COUNT; i++) {
        const img = new Image();
        img.onload = () => {
          loaded[i] = true;
          if (i === 0) renderFrameRef.current?.(0);
        };
        img.src = mobileFrameSrc(i);
        frames.push(img);
      }

      return () => {
        renderFrameRef.current = null;
      };
    }

    const video = videoRef.current;
    if (!video) return;

    const onError = () => setVideoFailed(true);
    video.addEventListener("error", onError);
    video.currentTime = 0;

    let seek: ((value: number) => void) | null = null;
    const ensureSeekReady = () => {
      if (seek || !video.duration) return;
      seek = gsap.quickTo(video, "currentTime", {
        duration: 0.4,
        ease: "power2.out",
      });
    };
    if (video.readyState >= 1) ensureSeekReady();
    video.addEventListener("loadedmetadata", ensureSeekReady);

    renderFrameRef.current = (progress) => {
      ensureSeekReady();
      if (seek && video.duration) seek(progress * video.duration);
    };

    return () => {
      video.removeEventListener("loadedmetadata", ensureSeekReady);
      video.removeEventListener("error", onError);
      renderFrameRef.current = null;
    };
  }, [isMobile]);

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
          {isMobile === false && (
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
          )}
          {isMobile === true && (
            <canvas
              ref={canvasRef}
              className="absolute inset-0 h-full w-full"
            />
          )}
          <div
            ref={landingRef}
            className="pointer-events-none absolute inset-0 bg-cover bg-center"
            style={{
              // The mobile video opens on its own intact-rose scene, so its
              // first frame is the landing image there; desktop keeps the
              // landscape landing still.
              backgroundImage: `url(${isMobile ? mobileFrameSrc(0) : HERO_LANDING})`,
            }}
          />
        </>
      )}

      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <div
          ref={headlineRef}
          style={showStaticFallback ? {} : { opacity: 0 }}
        >
          <h1
            className="font-serif text-4xl italic tracking-tightest text-cream sm:text-7xl md:text-8xl"
            style={{ textShadow: "0 4px 20px rgba(0,0,0,0.85)" }}
          >
            The Art of Doing Nothing
          </h1>
          <p
            className="mt-6 font-sans text-xs font-medium uppercase tracking-[0.25em] text-cream sm:text-base"
            style={{ textShadow: "0 2px 12px rgba(0,0,0,0.85)" }}
          >
            SPADRO &middot; Ritual bodywork, undone slowly
          </p>
        </div>
      </div>
    </section>
  );
}
