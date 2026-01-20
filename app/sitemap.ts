import { MetadataRoute } from 'next';
import dbConnect from '@/app/lib/dbConnect';
import Post from '@/app/models/Post';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_DEPLOYMENT_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
    },
    {
      url: `${baseUrl}/posts`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
    },
  ];

  if (!process.env.DB_URI) {
    console.error('Database URI is not defined');
    return staticPages;
  }

  await dbConnect(process.env.DB_URI);
  const posts = await Post.find({}).sort({ date: -1 });

  const postUrls = posts.map((post) => {
    const postDate = new Date(post.updatedAt || post.date);

    return {
      url: `${baseUrl}/posts/${post.slug}`,
      lastModified: postDate,
    };
  });

  return [...staticPages, ...postUrls];
}
