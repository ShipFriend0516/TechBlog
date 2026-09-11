// app/robots.ts
import { MetadataRoute } from 'next';
import { SITE_URL } from '@/app/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      disallow: ['/admin', '/private', '/api'],
    },
    sitemap: [`${SITE_URL}/sitemap.xml`, `${SITE_URL}/rss.xml`],
  };
}
