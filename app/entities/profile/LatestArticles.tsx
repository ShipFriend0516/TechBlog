import { AxiosError } from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { Post } from '@/app/types/Post';
import ErrorBox from '../common/Error/ErrorBox';
import Skeleton from '../common/Skeleton/Skeleton';

interface LatestArticlesProps {
  posts: Post[];
  loading: boolean;
  error?: Error | AxiosError | null;
}

const LatestArticles = ({
  posts,
  loading,
  error = null,
}: LatestArticlesProps) => {
  return (
    <section className="grid gap-6">
      <div className="space-y-2">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
          Latest Articles
        </h2>
        <div className="h-1 w-24 bg-gray-900 dark:bg-gray-100 rounded-full"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {loading ? (
          <>
            <LatestArticleSkeleton />
            <LatestArticleSkeleton />
            <LatestArticleSkeleton />
          </>
        ) : (
          posts &&
          posts.slice(0, 3).map((post) => (
            <Link
              href={`/posts/${post.slug}`}
              key={post._id}
              className="group cursor-pointer bg-gradient-to-br from-gray-50 to-gray-100  dark:from-primary-rich rounded-2xl overflow-hidden shadow transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:scale-[1.02]"
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
                  className="object-cover bg-[position:50%_20%] bg-cover bg-no-repeat w-full h-full transition-transform duration-500 group-hover:scale-110 bg-gray-500"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                  {post.subTitle && post.subTitle.slice(0, 80)}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
      <ErrorBox error={error} />
    </section>
  );
};

const LatestArticleSkeleton = () => {
  return (
    <div
      className={
        'flex flex-col gap-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-primary-rich  rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700'
      }
    >
      <Skeleton className={'w-full h-44 rounded-none'} />
      <div className="p-6 space-y-3">
        <Skeleton className={'w-full h-7'} />
        <Skeleton className={'w-3/4 h-5'} />
      </div>
    </div>
  );
};

export default LatestArticles;
