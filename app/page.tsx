import type { Metadata } from 'next';
import dbConnect from '@/app/lib/dbConnect';
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from '@/app/lib/site';
import Post from '@/app/models/Post';
import { Post as PostType } from '@/app/types/Post';
import AboutMe from './entities/profile/AboutMe';
import Experience from './entities/profile/Experience';
import HeroBanner from './entities/profile/HeroBanner';
import LatestArticles from './entities/profile/LatestArticles';
import WelcomeClient from './entities/profile/WelcomeClient';

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/` },
};

const siteSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      alternateName: ['ShipFriend', 'shipfriend.dev'],
      description: SITE_DESCRIPTION,
      inLanguage: 'ko-KR',
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      alternateName: 'ShipFriend',
      url: `${SITE_URL}/`,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/assets/apple-touch-icon.png`,
      },
      sameAs: ['https://github.com/ShipFriend0516'],
    },
  ],
};

const Home = async () => {
  await dbConnect();
  const publicFilter = {
    $or: [{ isPrivate: false }, { isPrivate: { $exists: false } }],
  };

  const [rawPosts, totalCount] = await Promise.all([
    Post.find(publicFilter)
      .select('slug title _id subTitle thumbnailImage')
      .sort({ date: -1 })
      .limit(3)
      .lean(),
    Post.countDocuments(publicFilter),
  ]);

  const posts = rawPosts as unknown as PostType[];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(siteSchema).replace(/<\//g, '<\\/'),
        }}
      />
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 gap-12 p-4 md:p-6">
        <WelcomeClient />
        <HeroBanner />
        <AboutMe />
        <Experience />
        <LatestArticles posts={posts} totalCount={totalCount} />
      </div>
    </>
  );
};

export default Home;
