/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['three'],
  // ESLint stays relaxed (lots of preview-quality components, not worth blocking
  // a deploy on a missing alt prop). TypeScript is now strict — production
  // build fails on real type errors so we catch regressions.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
