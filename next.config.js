/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://utteranc.es https://giscus.app;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https:;
  font-src 'self' https:;
  connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com https://api.github.com https://utteranc.es https://giscus.app;
  frame-src https://utteranc.es https://giscus.app https://www.youtube.com https://www.youtu.be;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
`
  .replace(/\n/g, ' ')
  .trim();

const securityHeaders = [
  { key: 'Content-Security-Policy', value: ContentSecurityPolicy },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
];

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
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
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
