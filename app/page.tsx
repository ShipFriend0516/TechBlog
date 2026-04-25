import dbConnect from '@/app/lib/dbConnect';
import Post from '@/app/models/Post';
import { Post as PostType } from '@/app/types/Post';
import AboutMe from './entities/profile/AboutMe';
import Experience from './entities/profile/Experience';
import HeroBanner from './entities/profile/HeroBanner';
import LatestArticles from './entities/profile/LatestArticles';
import MoreExplore from './entities/profile/MoreExplore';
import WelcomeClient from './entities/profile/WelcomeClient';

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
    <main className="w-full max-w-5xl mx-auto grid gap-12 p-4 md:p-6">
      <WelcomeClient />
      <HeroBanner />
      <AboutMe />
      <Experience />
      <LatestArticles posts={posts} totalCount={totalCount} />
    </main>
  );
};

export default Home;
