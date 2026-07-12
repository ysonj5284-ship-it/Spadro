"use client";

import Image from "next/image";
import { useState } from "react";
import Reveal from "./Reveal";

const tiers = [
  {
    name: "Essential Escape",
    price: "$140",
    cadence: "per session",
    image: "/images/pricing-essential.jpg",
    features: [
      "60-minute full body massage",
      "Choice of pressure & oil",
      "Quiet room, no add-ons",
    ],
    featured: false,
  },
  {
    name: "Signature Ritual",
    price: "$220",
    cadence: "per session",
    image: "/images/pricing-signature.jpg",
    features: [
      "100-minute signature sequence",
      "Hot stone + scalp ritual",
      "Botanical oil blend of your choice",
      "Complimentary tea service",
    ],
    featured: true,
  },
  {
    name: "Relaxation Prestige",
    price: "$385",
    cadence: "per couple",
    image: "/images/pricing-ritual.jpg",
    features: [
      "Two 90-minute treatments",
      "Private studio for two",
      "Foot ritual + facial add-on",
      "Champagne on arrival",
    ],
    featured: false,
  },
];

function Check() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className="mt-1 shrink-0 text-rose"
    >
      <path
        d="M2 7.5L5.5 11L12 3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Pricing() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="pricing" className="bg-espresso-deep px-6 py-28 md:px-16 lg:px-24">
      <Reveal>
        <h2 className="text-center font-serif text-4xl italic text-cream sm:text-5xl">
          Get Your Ritual
        </h2>
      </Reveal>

      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
        {tiers.map((tier, i) => (
          <Reveal key={tier.name} delay={i * 0.08}>
            <div
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className={`flex h-full flex-col overflow-hidden rounded-[2rem] border bg-espresso transition-all duration-[350ms] ease-out ${
                tier.featured
                  ? "border-rose shadow-[0_0_0_1px_rgba(217,167,140,0.3)]"
                  : "border-cream/10"
              } ${
                hovered === i
                  ? "z-10 scale-[1.04] -translate-y-2.5 opacity-100 shadow-2xl shadow-black/50"
                  : hovered !== null
                  ? "scale-100 translate-y-0 opacity-60"
                  : "scale-100 translate-y-0 opacity-100"
              }`}
            >
              <div className="relative h-40 w-full">
                <Image
                  src={tier.image}
                  alt={tier.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/10 to-transparent" />
              </div>

              <div className="flex flex-1 flex-col p-8">
                {tier.featured && (
                  <span className="mb-3 font-sans text-[11px] uppercase tracking-[0.25em] text-rose">
                    Most Booked
                  </span>
                )}
                <h3 className="font-serif text-2xl italic text-cream">
                  {tier.name}
                </h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-serif text-4xl text-rose">
                    {tier.price}
                  </span>
                  <span className="font-sans text-xs uppercase tracking-wide text-cream/50">
                    {tier.cadence}
                  </span>
                </div>

                <ul className="mt-6 flex flex-1 flex-col gap-3">
                  {tier.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-3 font-sans text-sm text-cream/75"
                    >
                      <Check />
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  className={`mt-8 border px-6 py-3 text-center font-sans text-xs uppercase tracking-[0.2em] transition-colors ${
                    tier.featured
                      ? "border-rose bg-rose text-espresso-deep hover:bg-transparent hover:text-rose"
                      : "border-cream/30 text-cream hover:border-rose hover:text-rose"
                  }`}
                >
                  Reserve
                </a>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
