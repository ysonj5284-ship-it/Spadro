"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const treatments = [
  {
    name: "Deep Tissue Massage",
    description:
      "Slow, deliberate pressure through the deep muscle layers, warmed with rose oil to ease chronic tension.",
    image: "/images/treatment-deep-tissue.jpg",
  },
  {
    name: "Espresso Hot Stone",
    description:
      "Volcanic stones carry heat into the tissue while long strokes release the day from your shoulders and spine.",
    image: "/images/treatment-espresso-hot-stone.jpg",
  },
  {
    name: "Signature Ritual Massage",
    description:
      "Our full-body signature sequence — a blend of Swedish, myofascial, and pressure-point work, closed with a scalp ritual.",
    image: "/images/treatment-signature-ritual.jpg",
  },
  {
    name: "Botanical Facial Restore",
    description:
      "A quiet, unhurried facial using warm botanical oils and gua sha to lift, depuff, and restore natural color.",
    image: "/images/treatment-botanical-facial.jpg",
  },
  {
    name: "Aromatic Foot & Leg Ritual",
    description:
      "Warm towel wraps, reflexology pressure points, and a slow rose-oil leg massage to ground you after travel.",
    image: "/images/treatment-aromatic-foot-leg.jpg",
  },
];

const CREAM = "#F3E9E2";
const CREAM_DIM = "#8A7A70";
const ROSE = "#D9A78C";

function paintWord(el: HTMLElement, local: number, from: string, to: string) {
  el.style.color = gsap.utils.interpolate(from, to, local);
}

export default function Treatments() {
  const pinRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const nameWordRefs = useRef<HTMLSpanElement[][]>([]);
  const descWordRefs = useRef<HTMLSpanElement[][]>([]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const n = treatments.length;
    const cards = cardRefs.current;

    gsap.set(cards, { yPercent: 100, rotateX: 15, scale: 0.9, opacity: 0, transformOrigin: "center bottom" });
    gsap.set(cards[0], { yPercent: 0, rotateX: 0, scale: 1, opacity: 1 });

    const st = ScrollTrigger.create({
      trigger: pinRef.current,
      start: "top top",
      end: `+=${(n - 1) * 100}%`,
      pin: true,
      scrub: 0.8,
      snap: {
        snapTo: 1 / (n - 1),
        duration: 0.35,
        ease: "power1.inOut",
      },
      onUpdate: (self) => {
        const overall = self.progress * (n - 1);

        cards.forEach((card, i) => {
          if (!card) return;
          const enter = gsap.utils.clamp(0, 1, overall - i + 1);
          const exit = gsap.utils.clamp(0, 1, overall - i);
          const sweep = Math.max(enter - exit, 0);

          gsap.set(card, {
            yPercent: 100 * (1 - enter) - 40 * exit,
            rotateX: 15 * (1 - enter) + 10 * exit,
            scale: 0.9 + 0.1 * enter - 0.25 * exit,
            opacity: enter - exit,
            zIndex: i,
          });

          // Sweep the highlight word by word as the card enters,
          // and un-sweep it in reverse as it exits.
          const nameWords = nameWordRefs.current[i] || [];
          nameWords.forEach((el, j) => {
            if (!el) return;
            const local = gsap.utils.clamp(0, 1, (sweep - j / nameWords.length) * nameWords.length);
            paintWord(el, local, CREAM, ROSE);
          });

          const descWords = descWordRefs.current[i] || [];
          descWords.forEach((el, j) => {
            if (!el) return;
            const local = gsap.utils.clamp(0, 1, (sweep - j / descWords.length) * descWords.length);
            paintWord(el, local, CREAM_DIM, CREAM);
          });
        });
      },
    });

    return () => st.kill();
  }, []);

  return (
    <section id="treatments" className="relative bg-espresso">
      <div
        ref={pinRef}
        className="relative flex h-screen w-full items-center justify-center px-6 md:px-16 lg:px-24"
      >
        <h2 className="absolute left-1/2 top-12 -translate-x-1/2 whitespace-nowrap font-serif text-3xl italic text-cream sm:top-16 sm:text-5xl">
          Choose Your Ritual
        </h2>
        <div
          className="relative h-[60vh] w-full max-w-5xl sm:h-[55vh]"
          style={{ perspective: "1600px" }}
        >
          {treatments.map((t, i) => (
            <div
              key={t.name}
              ref={(el) => {
                if (el) cardRefs.current[i] = el;
              }}
              className="absolute inset-0 grid grid-cols-1 grid-rows-[auto_minmax(0,1fr)] items-center gap-6 will-change-transform md:grid-cols-2 md:grid-rows-1 md:gap-16"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="text-center md:text-left">
                <h3 className="font-serif text-4xl italic sm:text-6xl md:text-7xl">
                  {t.name.split(" ").map((word, j) => (
                    <span
                      key={j}
                      ref={(el) => {
                        if (el) {
                          if (!nameWordRefs.current[i]) nameWordRefs.current[i] = [];
                          nameWordRefs.current[i][j] = el;
                        }
                      }}
                      style={{ color: CREAM }}
                      className="inline-block"
                    >
                      {word}&nbsp;
                    </span>
                  ))}
                </h3>
                <p className="mx-auto mt-6 max-w-md font-sans text-sm leading-relaxed sm:text-base md:mx-0">
                  {t.description.split(" ").map((word, j) => (
                    <span
                      key={j}
                      ref={(el) => {
                        if (el) {
                          if (!descWordRefs.current[i]) descWordRefs.current[i] = [];
                          descWordRefs.current[i][j] = el;
                        }
                      }}
                      style={{ color: CREAM_DIM }}
                      className="inline-block"
                    >
                      {word}&nbsp;
                    </span>
                  ))}
                </p>
              </div>

              <div className="relative h-full w-full overflow-hidden rounded-[2rem] shadow-2xl shadow-black/50">
                <Image
                  src={t.image}
                  alt={t.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 45vw"
                  priority={i === 0}
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
