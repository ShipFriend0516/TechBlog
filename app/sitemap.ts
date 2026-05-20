import { MetadataRoute } from 'next';
import dbConnect from '@/app/lib/dbConnect';
import Post from '@/app/models/Post';
import Series from '@/app/models/Series';

function toDateString(date: Date | string | undefined): string {
  if (!date) return new Date().toISOString().split('T')[0];
  return new Date(date).toISOString().split('T')[0];
}

function maxDateString(dates: (Date | string | undefined)[]): string {
  const timestamps = dates.filter(Boolean).map((d) => new Date(d!).getTime());
  if (!timestamps.length) return toDateString(new Date());
  return toDateString(new Date(Math.max(...timestamps)));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_DEPLOYMENT_URL ||
    process.env.NEXTAUTH_URL ||
    'http://localhost:3000';

  if (!process.env.DB_URI) {
    console.error('Database URI is not defined');
    return [{ url: baseUrl }];
  }

  await dbConnect(process.env.DB_URI);

  // 포스트 URL 생성
  const posts = await Post.find({}).sort({ updatedAt: -1 }).lean();
  const postsLastmod = posts.length
    ? maxDateString(posts.map((p) => p.updatedAt || p.date))
    : toDateString(new Date());

  const postUrls: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/posts/${encodeURIComponent(post.slug)}`,
    lastModified: toDateString(post.updatedAt || post.date),
  }));

  // 시리즈 URL 생성
  const allSeries = await Series.find({}, { slug: 1, updatedAt: 1 }).lean();
  const seriesLastmod = allSeries.length
    ? maxDateString(allSeries.map((s) => s.updatedAt))
    : toDateString(new Date());

  const seriesUrls: MetadataRoute.Sitemap = allSeries.map((series) => ({
    url: `${baseUrl}/series/${encodeURIComponent(series.slug)}`,
    lastModified: toDateString(series.updatedAt),
  }));

  // 포트폴리오 URL 생성 (고정 항목, lastmod 없음)
  const portfolioSlugs = ['shipfriend', 'preview', 'primitive', 'storyhelper'];
  const portfolioUrls: MetadataRoute.Sitemap = portfolioSlugs.map((slug) => ({
    url: `${baseUrl}/portfolio/${slug}`,
  }));

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: postsLastmod,
    },
    {
      url: `${baseUrl}/posts`,
      lastModified: postsLastmod,
    },
    {
      url: `${baseUrl}/portfolio`,
    },
    {
      url: `${baseUrl}/series`,
      lastModified: seriesLastmod,
    },
    {
      url: `${baseUrl}/tags`,
      lastModified: postsLastmod,
    },
  ];

  return [...staticPages, ...postUrls, ...seriesUrls, ...portfolioUrls];
}
