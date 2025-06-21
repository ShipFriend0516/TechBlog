/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

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
  }, // 빌드 시 RSS 피드를 생성하는 스크립트 실행
  async rewrites() {
    return [
      {
        source: '/rss.xml',
        destination: '/api/rss',
      },
      {
        source: '/atom.xml',
        destination: '/api/rss',
      },
      {
        source: '/feed.json',
        destination: '/api/rss',
      },
    ];
  },
  env: {
    DB_URI: process.env.DB_URI,
  },
  reactStrictMode: false,
};

module.exports = withBundleAnalyzer(nextConfig);
