/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'idmlft3uczstcjaa.public.blob.vercel-storage.com',
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
};

export default nextConfig;
