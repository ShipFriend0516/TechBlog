/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'idmlft3uczstcjaa.public.blob.vercel-storage.com',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: '*',
      },
    ],
  },
  env: {
    DB_URI: process.env.DB_URI,
  },
  reactStrictMode: false,
};

export default nextConfig;
