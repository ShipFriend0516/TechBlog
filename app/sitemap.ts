import { MetadataRoute } from 'next';
import dbConnect from '@/app/lib/dbConnect';
import Post from '@/app/models/Post';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
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

  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/posts/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.date),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...postUrls];
}
