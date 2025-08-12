/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  pageExtensions: ['js', 'jsx', 'mdx'],
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
  transpilePackages: [
    "@radix-ui/react-toast",
    "@radix-ui/react-tooltip",
  ],
};

export default nextConfig;
