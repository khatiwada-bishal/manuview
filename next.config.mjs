/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["mammoth", "pdf-parse", "pdfjs-dist"],
  },
};

export default nextConfig;
