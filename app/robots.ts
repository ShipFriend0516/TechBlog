// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseURL = process.env.NEXT_PUBLIC_DEPLOYMENT_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
  return {
    rules: {
      userAgent: '*',
      disallow: ['/admin/', '/private/', '/api/'],
    },
    sitemap: [`${baseURL}/sitemap.xml`, `${baseURL}/rss.xml`],
  };
}
