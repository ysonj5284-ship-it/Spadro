"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "./Reveal";

gsap.registerPlugin(ScrollTrigger);

const shots = [
  { src: "/images/gallery-1.jpg", alt: "Treatment room, warm low light" },
  { src: "/images/gallery-2.jpg", alt: "Massage oils and stone detail" },
  { src: "/images/gallery-3.jpg", alt: "Studio ambience" },
  { src: "/images/gallery-4.jpg", alt: "Hands and towels detail" },
  { src: "/images/gallery-5.jpg", alt: "Treatment room, evening" },
  { src: "/images/gallery-6.jpg", alt: "Product detail, rose oil" },
];

export default function Gallery() {
  const [active, setActive] = useState<string | null>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const n = shots.length;
    const cards = cardRefs.current;

    // Start every card off-screen below, tilted back, slightly scaled down.
    gsap.set(cards, { yPercent: 100, rotateX: 15, scale: 0.9, transformOrigin: "center bottom" });
    gsap.set(cards[0], { yPercent: 0, rotateX: 0, scale: 1 });

    const st = ScrollTrigger.create({
      trigger: pinRef.current,
      start: "top top",
      end: `+=${(n - 1) * 100}%`,
      pin: true,
      scrub: 0.6,
      snap: {
        snapTo: 1 / (n - 1),
        duration: 0.3,
        ease: "power1.inOut",
      },
      onUpdate: (self) => {
        const overall = self.progress * (n - 1);

        cards.forEach((card, i) => {
          if (!card) return;
          const incoming = gsap.utils.clamp(0, 1, overall - i + 1);
          const recede = gsap.utils.clamp(0, 1, overall - i);
          const dir = i % 2 === 0 ? -1 : 1;

          gsap.set(card, {
            yPercent: 100 * (1 - incoming),
            rotateX: 15 * (1 - incoming),
            scale: 0.92 + 0.08 * incoming - 0.1 * recede,
            x: 30 * recede * dir,
            y: -22 * recede,
            rotateZ: 5 * recede * dir,
            zIndex: i,
          });

          const overlay = card.querySelector<HTMLElement>("[data-recede-overlay]");
          if (overlay) gsap.set(overlay, { opacity: 0.35 * recede });
        });
      },
    });

    return () => st.kill();
  }, []);

  return (
    <section id="gallery" className="bg-espresso px-6 pt-28 md:px-16 lg:px-24">
      <Reveal>
        <h2 className="text-center font-serif text-4xl italic text-cream sm:text-5xl">
          Studio Gallery
        </h2>
      </Reveal>

      <div
        ref={pinRef}
        className="relative mt-16 flex h-screen w-full items-center justify-center"
      >
        <div
          className="relative h-[70vh] w-full max-w-4xl sm:h-[78vh]"
          style={{ perspective: "1600px" }}
        >
          {shots.map((s, i) => (
            <div
              key={s.src}
              ref={(el) => {
                if (el) cardRefs.current[i] = el;
              }}
              className="absolute inset-0 overflow-hidden rounded-[2rem] shadow-2xl shadow-black/50 will-change-transform"
              style={{ transformStyle: "preserve-3d" }}
            >
              <button
                onClick={() => setActive(s.src)}
                className="relative block h-full w-full overflow-hidden"
              >
                <Image
                  src={s.src}
                  alt={s.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 896px"
                  priority={i === 0}
                  className="object-cover"
                />
                <div
                  data-recede-overlay
                  className="pointer-events-none absolute inset-0 bg-espresso-deep opacity-0"
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-espresso-deep/95 p-6"
          onClick={() => setActive(null)}
        >
          <button
            className="absolute right-6 top-6 font-sans text-sm uppercase tracking-[0.2em] text-cream/70 hover:text-rose"
            onClick={() => setActive(null)}
          >
            Close
          </button>
          <div className="relative h-[80vh] w-full max-w-4xl">
            <Image src={active} alt="" fill className="object-contain" />
          </div>
        </div>
      )}
    </section>
  );
}
