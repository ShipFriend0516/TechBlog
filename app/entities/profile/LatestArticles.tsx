import Image from 'next/image';
import Link from 'next/link';
import { Post } from '@/app/types/Post';
import SectionHeading from '../common/SectionHeading';

interface LatestArticlesProps {
  posts: Post[];
  totalCount: number;
}

const LatestArticles = ({ posts, totalCount }: LatestArticlesProps) => {
  return (
    <section className="grid gap-6">
      <SectionHeading title="Latest Articles" viewAllHref="/posts" viewAllCount={totalCount} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.slice(0, 3).map((post) => (
          <Link
            href={`/posts/${post.slug}`}
            key={post._id}
            className="group cursor-pointer bg-gradient-to-br from-surface to-raised rounded-2xl overflow-hidden transition-all duration-300 border border-hairline hover:scale-[1.02]"
          >
            <div className="relative h-44 overflow-hidden">
              <Image
                width={500}
                height={400}
                src={
                  post.thumbnailImage ||
                  '/images/placeholder/thumbnail_example2.webp'
                }
                alt={`Article ${post.title}`}
                className="object-cover bg-[position:50%_20%] bg-cover bg-no-repeat w-full h-full transition-transform duration-500 group-hover:scale-110 bg-fg-muted"
              />
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold mb-2 text-fg line-clamp-2 group-hover:text-fg-soft transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-fg-soft line-clamp-3 leading-relaxed">
                {post.subTitle && post.subTitle.slice(0, 80)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default LatestArticles;
