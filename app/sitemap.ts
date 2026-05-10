import { MetadataRoute } from 'next';
import dbConnect from '@/app/lib/dbConnect';
import Post from '@/app/models/Post';
import Series from '@/app/models/Series';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_DEPLOYMENT_URL ||
    process.env.NEXTAUTH_URL ||
    'http://localhost:3000';

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/posts`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/series`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tags`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
  ];

  if (!process.env.DB_URI) {
    console.error('Database URI is not defined');
    return staticPages;
  }

  await dbConnect(process.env.DB_URI);

  // 포스트 URL 생성
  const posts = await Post.find({}).sort({ date: -1 });
  const postUrls = posts.map((post) => {
    const postDate = new Date(post.updatedAt || post.date);
    // 최신 포스트는 높은 우선순위, 오래된 포스트는 낮은 우선순위
    const priority = Math.min(Math.max(0.5, 0.9 - posts.indexOf(post) * 0.01), 0.9);

    return {
      url: `${baseUrl}/posts/${post.slug}`,
      lastModified: postDate,
      changeFrequency: 'monthly' as const,
      priority,
    };
  });

  // 시리즈 URL 생성 (Series 컬렉션에서 slug 직접 조회)
  const allSeries = await Series.find({}, { slug: 1, updatedAt: 1 }).lean();
  const seriesUrls = allSeries.map((series) => ({
    url: `${baseUrl}/series/${series.slug}`,
    lastModified: series.updatedAt ? new Date(series.updatedAt as Date) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // 포트폴리오 URL 생성 (고정된 포트폴리오 항목들)
  const portfolioSlugs = ['shipfriend', 'preview', 'primitive', 'storyhelper'];
  const portfolioUrls = portfolioSlugs.map((slug) => ({
    url: `${baseUrl}/portfolio/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...postUrls, ...seriesUrls, ...portfolioUrls];
}
