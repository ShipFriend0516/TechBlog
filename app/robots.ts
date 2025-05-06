// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseURL = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/private/', '/api/', '/_next/static/chunks/'],
    },
    sitemap: [`${baseURL}/sitemap.xml`, `${baseURL}/rss.xml`],
  };
}
