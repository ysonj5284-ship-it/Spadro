"use client";

import { FormEvent, useState } from "react";
import Reveal from "./Reveal";

type Errors = Partial<Record<"name" | "email" | "phone" | "message", string>>;

export default function Contact() {
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    const message = String(form.get("message") || "").trim();

    const next: Errors = {};
    if (!name) next.name = "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email.";
    if (!/^[\d\s+()-]{7,}$/.test(phone)) next.phone = "Enter a valid phone number.";
    if (!message) next.message = "Tell us a little about what you need.";

    setErrors(next);
    if (Object.keys(next).length === 0) {
      // TODO: wire up to email/CRM (e.g. Resend, HubSpot) once backend is ready.
      setSubmitted(true);
      e.currentTarget.reset();
    }
  }

  const inputClass =
    "w-full border-b border-cream/25 bg-transparent py-3 font-sans text-sm text-cream placeholder:text-cream/40 focus:border-rose focus:outline-none";

  return (
    <section id="contact" className="bg-espresso-deep pb-28">
      <Reveal>
        <div className="overflow-hidden border-y border-rose/30 py-6">
          <div className="flex w-max animate-marquee whitespace-nowrap">
            {Array.from({ length: 8 }).map((_, i) => (
              <span
                key={i}
                className="mx-6 font-serif text-4xl italic text-cream sm:text-5xl"
              >
                Reserve Your Ritual
                <span className="ml-6 text-rose">&middot;</span>
              </span>
            ))}
          </div>
        </div>
      </Reveal>

      <div className="mt-16 grid grid-cols-1 gap-16 px-6 md:grid-cols-2 md:px-16 lg:px-24">
        <Reveal>
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
            <div>
              <input name="name" placeholder="Name" className={inputClass} />
              {errors.name && (
                <p className="mt-1 font-sans text-xs text-wine">{errors.name}</p>
              )}
            </div>
            <div>
              <input name="email" placeholder="Email" className={inputClass} />
              {errors.email && (
                <p className="mt-1 font-sans text-xs text-wine">{errors.email}</p>
              )}
            </div>
            <div>
              <input name="phone" placeholder="Phone" className={inputClass} />
              {errors.phone && (
                <p className="mt-1 font-sans text-xs text-wine">{errors.phone}</p>
              )}
            </div>
            <div>
              <select
                name="treatment"
                defaultValue=""
                className={`${inputClass} appearance-none`}
              >
                <option value="" disabled>
                  Preferred Treatment
                </option>
                <option>Deep Tissue Massage</option>
                <option>Espresso Hot Stone</option>
                <option>Signature Ritual Massage</option>
                <option>Botanical Facial Restore</option>
                <option>Aromatic Foot & Leg Ritual</option>
              </select>
            </div>
            <div>
              <textarea
                name="message"
                placeholder="Message"
                rows={4}
                className={`${inputClass} resize-none`}
              />
              {errors.message && (
                <p className="mt-1 font-sans text-xs text-wine">{errors.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="mt-2 self-start border border-rose px-8 py-3 font-sans text-sm uppercase tracking-[0.2em] text-cream transition-colors hover:bg-rose hover:text-espresso-deep"
            >
              Send Request
            </button>

            {submitted && (
              <p className="font-sans text-sm text-rose">
                Thank you — we'll be in touch shortly to confirm your ritual.
              </p>
            )}
          </form>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="flex h-full flex-col justify-between gap-10">
            <div>
              <h3 className="font-sans text-xs uppercase tracking-[0.25em] text-rose">
                Studio
              </h3>
              <p className="mt-3 font-serif text-xl text-cream">
                14 Marigold Lane, Suite 3
                <br />
                Los Angeles, CA 90026
              </p>
            </div>

            <div>
              <h3 className="font-sans text-xs uppercase tracking-[0.25em] text-rose">
                Hours
              </h3>
              <p className="mt-3 font-sans text-sm leading-relaxed text-cream/70">
                Tuesday – Sunday, 10am – 8pm
                <br />
                Closed Mondays
              </p>
            </div>

            <a
              href="https://wa.me/10000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit border border-rose px-8 py-3 font-sans text-sm uppercase tracking-[0.2em] text-cream transition-colors hover:bg-rose hover:text-espresso-deep"
            >
              Book via WhatsApp
            </a>

            <div className="relative h-48 w-full overflow-hidden border border-cream/10 bg-espresso">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(217,167,140,0.18),transparent_60%)]" />
              <svg
                viewBox="0 0 400 200"
                className="h-full w-full opacity-40"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 140 L60 120 L120 150 L180 90 L240 110 L300 60 L360 80 L400 40"
                  stroke="#D9A78C"
                  strokeWidth="1"
                  fill="none"
                />
                <circle cx="240" cy="110" r="4" fill="#7A1F2B" />
              </svg>
              <span className="absolute bottom-3 left-3 font-sans text-[11px] uppercase tracking-[0.2em] text-cream/50">
                Marigold Lane
              </span>
            </div>

            <div className="flex gap-6 font-sans text-xs uppercase tracking-[0.2em] text-cream/60">
              <a href="#" className="underline-draw hover:text-rose">
                Instagram
              </a>
              <a href="#" className="underline-draw hover:text-rose">
                Facebook
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
