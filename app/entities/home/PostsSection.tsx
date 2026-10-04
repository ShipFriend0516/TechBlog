import Image from 'next/image';
import Link from 'next/link';
import SectionHeader from '@/app/entities/home/SectionHeader';
import { formatDate } from '@/app/lib/utils/format';
import { HomePost, PopularPost } from '@/app/types/Home';

interface PostsSectionProps {
  latest: HomePost[];
  popular: PopularPost[];
}

const FeaturedCard = ({ post }: { post: HomePost }) => (
  <Link
    href={`/posts/${post.slug}`}
    className="group block rounded-[20px] bg-surface p-5 md:p-6 transition-all duration-300 ease-out-expo hover:bg-raised hover:shadow-glow-md hover:-translate-y-0.5"
  >
    <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-gradient-to-br from-nebula-subtle via-raised to-accent-subtle">
      {post.thumbnailImage && (
        <Image
          src={post.thumbnailImage}
          alt={`${post.title} 썸네일`}
          fill
          sizes="(min-width: 768px) 600px, 100vw"
          className="object-cover transition-transform duration-500 ease-out-expo group-hover:scale-[1.03]"
        />
      )}
    </div>
    <p className="mt-5 text-xs font-semibold text-accent">NEW</p>
    <h3 className="mt-1 text-xl md:text-2xl font-bold leading-snug break-keep transition-colors group-hover:text-accent-strong">
      {post.title}
    </h3>
    {post.subTitle && (
      <p className="mt-2 text-fg-soft leading-7 line-clamp-2">{post.subTitle}</p>
    )}
    <p className="mt-4 text-[13px] text-fg-muted">
      {formatDate(post.date)}
      {post.timeToRead ? ` · ${post.timeToRead}분` : ''}
    </p>
  </Link>
);

const PostsSection = ({ latest, popular }: PostsSectionProps) => {
  const [featured, ...rest] = latest;
  if (!featured) return null;

  return (
    <section>
      <SectionHeader
        eyebrow="Writing"
        title="최근에 쓴 글"
        action={{ href: '/posts', label: '전체 글' }}
      />
      <div className="grid lg:grid-cols-[1fr_320px] gap-10 lg:gap-12">
        <div className="min-w-0">
          <FeaturedCard post={featured} />
          <ul className="mt-4">
            {rest.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/posts/${post.slug}`}
                  className="group flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4 rounded-xl px-3 py-3.5 -mx-3 transition-colors hover:bg-surface"
                >
                  <span className="font-medium leading-snug line-clamp-2 break-keep sm:leading-normal sm:line-clamp-1 sm:break-normal transition-colors group-hover:text-accent">
                    {post.title}
                  </span>
                  <span className="shrink-0 text-[13px] text-fg-muted tabular-nums">
                    {formatDate(post.date)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {popular.length > 0 && (
          <aside className="min-w-0">
            <p className="text-sm font-semibold text-fg-soft mb-4">많이 읽은 글</p>
            <ol className="flex flex-col gap-1">
              {popular.map((post, i) => (
                <li key={post.slug}>
                  <Link
                    href={`/posts/${post.slug}`}
                    className="group flex gap-4 rounded-xl px-3 py-3 -mx-3 transition-colors hover:bg-surface"
                  >
                    <span
                      className={`w-6 shrink-0 text-lg font-bold tabular-nums ${
                        i < 3 ? 'text-accent' : 'text-fg-faint'
                      }`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-medium leading-snug line-clamp-2 break-keep transition-colors group-hover:text-accent">
                        {post.title}
                      </span>
                      <span className="mt-1 block text-xs text-fg-muted tabular-nums">
                        조회 {post.view.toLocaleString()}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </aside>
        )}
      </div>
    </section>
  );
};

export default PostsSection;
