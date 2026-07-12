/** @type {import('next').NextConfig} */
const nextConfig = {
  // Strict Mode double-invokes effects in dev, which double-creates GSAP
  // ScrollTrigger pins (Hero/Treatments/Gallery) and causes stuck/overlapping
  // pinned sections. Keep it off so scroll-pin lifecycles stay singular.
  reactStrictMode: false,
};

export default nextConfig;
