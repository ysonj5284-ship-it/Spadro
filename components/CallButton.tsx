export default function CallButton() {
  return (
    <a
      href="tel:+10000000000"
      aria-label="Call SPADRO"
      className="group fixed bottom-8 right-8 z-40 h-16 w-16 sm:h-20 sm:w-20"
      style={{ perspective: "600px" }}
    >
      <div className="relative h-full w-full transition-transform duration-500 ease-out [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        <div className="absolute inset-0 flex items-center justify-center rounded-full border border-rose bg-espresso-deep/90 shadow-lg [backface-visibility:hidden]">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-rose">
            <path
              d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.2 2.2z"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="absolute inset-0 flex items-center justify-center rounded-full border border-rose bg-rose shadow-lg [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <span className="font-sans text-[10px] uppercase tracking-[0.15em] text-espresso-deep">
            Call
          </span>
        </div>
      </div>
    </a>
  );
}
