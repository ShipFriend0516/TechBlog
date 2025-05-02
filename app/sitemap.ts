import { MetadataRoute } from 'next';
import dbConnect from '@/app/lib/dbConnect';
import Post from '@/app/models/Post';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/posts`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ];

  if (!process.env.DB_URI) {
    console.error('Database URI is not defined');
    return staticPages;
  }

  await dbConnect(process.env.DB_URI);
  const posts = await Post.find({}).sort({ date: -1 });

  const now = new Date();
  const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 3));
  const oneYearAgo = new Date(now.setFullYear(now.getFullYear() - 1));

  const postUrls = posts.map((post) => {
    const postDate = new Date(post.updatedAt || post.date);
    let priority = 0.7; // 기본값 (오래된 포스트)
    let changeFrequency: 'weekly' | 'monthly' | 'yearly' = 'yearly';

    if (post.seriesId) {
      priority = Math.max(priority, 0.8);
    }

    if (postDate >= threeMonthsAgo) {
      priority = 0.9;
      changeFrequency = 'weekly';
    } else if (postDate >= oneYearAgo) {
      priority = Math.max(priority, 0.75);
      changeFrequency = 'monthly';
    }

    return {
      url: `${baseUrl}/posts/${post.slug}`,
      lastModified: postDate,
      changeFrequency,
      priority,
    };
  });

  return [...staticPages, ...postUrls];
}
