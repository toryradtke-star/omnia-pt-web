import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
  // URLs from the clinic's previous site that Google still has (Search Console showed them as 404s).
  async redirects() {
    return [
      ["/home", "/"],
      ["/about", "/"],
      ["/appointments", "/appointment"],
      ["/blogs", "/news"],
      ["/blogs/what-is-electrical-stimulation-e-stim", "/news/dry-needling-electrical-stimulation-does-it-hurt"],
      ["/blogs/unlocking-pain-relief-the-power-of-dry-needling-with-omnia-wellness-and-recovery", "/news/dry-needling-electrical-stimulation-does-it-hurt"],
      ["/blogs/reclaim-your-health-with-expert-physical-therapy-at-omnia-wellness-and-recovery-in-superior-wisconsin", "/services"],
      ["/blogs/sciatic-what-can-pt-do-for-sciatica", "/services"],
    ].map(([source, destination]) => ({source, destination, permanent: true}));
  },
};

export default nextConfig;
