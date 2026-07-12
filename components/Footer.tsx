export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-rose/30 bg-espresso-deep px-6 py-16 md:px-16 lg:px-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(122,31,43,0.15),transparent_60%)]" />

      <div className="relative grid grid-cols-1 gap-12 md:grid-cols-3">
        <div>
          <h3 className="font-serif text-2xl italic text-cream">SPADRO</h3>
          <p className="mt-4 max-w-xs font-sans text-sm leading-relaxed text-cream/60">
            Ritual bodywork for the quietly overworked. Stillness, restored,
            one session at a time.
          </p>
        </div>

        <div>
          <h4 className="font-sans text-xs uppercase tracking-[0.25em] text-rose">
            Quick Links
          </h4>
          <ul className="mt-4 flex flex-col gap-2 font-sans text-sm text-cream/70">
            <li><a href="#treatments" className="underline-draw">Treatments</a></li>
            <li><a href="#pricing" className="underline-draw">Get Your Ritual</a></li>
            <li><a href="#gallery" className="underline-draw">Gallery</a></li>
            <li><a href="#contact" className="underline-draw">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-sans text-xs uppercase tracking-[0.25em] text-rose">
            Contact
          </h4>
          <p className="mt-4 font-sans text-sm leading-relaxed text-cream/70">
            14 Marigold Lane, Suite 3
            <br />
            Los Angeles, CA 90026
            <br />
            hello@spadro.studio
          </p>
        </div>
      </div>

      <p className="relative mt-16 font-sans text-[11px] uppercase tracking-[0.2em] text-cream/30">
        &copy; {new Date().getFullYear()} SPADRO. All rights reserved.
      </p>
    </footer>
  );
}
