// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseURL = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  return {
    rules: {
      userAgent: '*',
      disallow: ['/admin/', '/private/', '/api/', '/_next/static/'],
    },
    sitemap: [`${baseURL}/sitemap.xml`, `${baseURL}/rss.xml`],
  };
}
