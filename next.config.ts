import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  env: {
    // Public newsletter identifier, already used by the site's signup form.
    NEXT_PUBLIC_BEEHIIV_PUBLICATION_ID: process.env.NEXT_PUBLIC_BEEHIIV_PUBLICATION_ID || '9a736cb9-4761-4b27-bcca-76c181b9a915',
  },
  images: { unoptimized: true },
  experimental: {
    staticGenerationMaxConcurrency: 2,
    staticGenerationMinPagesPerWorker: 128,
  },
};

export default nextConfig;
