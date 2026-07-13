"use client";

import { useState } from "react";

const links = [
  { href: "#treatments", label: "Treatments" },
  { href: "#pricing", label: "Get Your Ritual" },
  { href: "#gallery", label: "Gallery" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-6 md:px-16 lg:px-24">
      <button
        onClick={() => {
          const lenis = (window as any).__lenis;
          if (lenis) lenis.scrollTo(0);
          else window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className="rounded-full border border-rose/40 bg-espresso-deep/40 px-5 py-2 font-sans text-xs uppercase tracking-[0.25em] text-cream backdrop-blur-sm"
      >
        SPADRO
      </button>

      <div className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="rounded-full border border-rose/40 bg-espresso-deep/40 px-5 py-2 font-sans text-xs uppercase tracking-[0.25em] text-cream backdrop-blur-sm transition-colors hover:border-rose"
        >
          {open ? "Close" : "Menu"}
        </button>

        {open && (
          <nav className="absolute right-0 top-full mt-3 flex w-max min-w-[200px] flex-col items-start gap-3 rounded-2xl border border-rose/25 bg-espresso-deep/95 px-6 py-5 backdrop-blur-sm">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="underline-draw whitespace-nowrap font-serif text-lg italic text-cream hover:text-rose"
              >
                {l.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
