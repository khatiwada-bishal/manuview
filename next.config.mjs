/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: process.env.NEXT_STANDALONE === "1" ? "standalone" : undefined,
  experimental: {
    serverComponentsExternalPackages: ["mammoth", "pdf-parse", "pdfjs-dist"],
  },
};

export default nextConfig;
