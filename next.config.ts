import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import { withSentryConfig } from "@sentry/nextjs";

import { env } from "./env.mjs";

const nextConfig: NextConfig = {
  /* config options here */
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  // Optionally, add any other Next.js config below
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
});

// Merge MDX config with Next.js config
const mdxNextConfig = withMDX(nextConfig);

// Make sure adding Sentry options is the last code to run before exporting
export default withSentryConfig(mdxNextConfig, {
  org: "mitimara",
  project: "mitimara",

  // An auth token is required for uploading source maps.
  authToken: env.SENTRY_AUTH_TOKEN,

  silent: true, // Can be used to suppress logs
  sourcemaps: {
    disable: true,
  },

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,
});
