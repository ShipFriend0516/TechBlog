import type { Metadata } from 'next';
import ConnectSection from '@/app/entities/home/ConnectSection';
import HomeHero from '@/app/entities/home/HomeHero';
import MeSection from '@/app/entities/home/MeSection';
import PostsSection from '@/app/entities/home/PostsSection';
import SeriesRail from '@/app/entities/home/SeriesRail';
import TrajectorySection from '@/app/entities/home/TrajectorySection';
import WelcomeClient from '@/app/entities/profile/WelcomeClient';
import {
  getAtelierPreview,
  getBlogStats,
  getLatestPosts,
  getNow,
  getPopularPosts,
  getSeriesList,
  getStarPosts,
} from '@/app/lib/home';
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from '@/app/lib/site';
import { getTagStats } from '@/app/lib/tags';

export const revalidate = 300;

const HERO_TAG_LIMIT = 24;

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
  const [latest, popular, series, stars, stats, tags, now, messages] =
    await Promise.all([
      getLatestPosts(5),
      getPopularPosts(3),
      getSeriesList(8),
      getStarPosts(),
      getBlogStats(),
      getTagStats(),
      getNow(),
      getAtelierPreview(3),
    ]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(siteSchema).replace(/<\//g, '<\\/'),
        }}
      />
      <WelcomeClient />
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-16 md:gap-32 px-4 md:px-8 md:pb-12">
        <HomeHero tags={tags.slice(0, HERO_TAG_LIMIT)} />
        <PostsSection latest={latest} popular={popular} />
        <SeriesRail series={series} />
        <TrajectorySection stars={stars} stats={stats} now={stats.generatedAt} />
        <MeSection now={now} />
        <ConnectSection messages={messages} />
      </div>
    </>
  );
};

export default Home;
