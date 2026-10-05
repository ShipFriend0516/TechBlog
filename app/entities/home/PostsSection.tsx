import Link from 'next/link';
import SectionHeader from '@/app/entities/home/SectionHeader';
import { formatDotDate } from '@/app/lib/utils/format';
import { HomePost, PopularPost } from '@/app/types/Home';

interface PostsSectionProps {
  latest: HomePost[];
  popular: PopularPost[];
}

const PostsSection = ({ latest, popular }: PostsSectionProps) => {
  if (latest.length === 0) return null;

  return (
    <section>
      <SectionHeader
        eyebrow="Writing"
        title="최근에 쓴 글"
        action={{ href: '/posts', label: '전체 글' }}
      />
      <div className="grid lg:grid-cols-[1fr_280px] gap-10 lg:gap-16">
        <ul className="min-w-0 flex flex-col gap-1">
          {latest.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/posts/${post.slug}`}
                className="group grid sm:grid-cols-[1fr_auto] gap-x-6 gap-y-1 rounded-xl px-4 py-4 -mx-4 transition-colors hover:bg-surface"
              >
                <span className="min-w-0">
                  <span className="text-lg font-semibold leading-snug line-clamp-2 break-keep transition-colors group-hover:text-accent">
                    {post.title}
                  </span>
                  {post.subTitle && (
                    <span className="mt-1 text-sm text-fg-muted line-clamp-1">
                      {post.subTitle}
                    </span>
                  )}
                </span>
                <span className="text-[13px] text-fg-faint tabular-nums sm:pt-1">
                  {formatDotDate(post.date)}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {popular.length > 0 && (
          <aside className="min-w-0">
            <p className="text-sm text-fg-muted mb-3">많이 읽은 글</p>
            <ol className="flex flex-col">
              {popular.map((post, i) => (
                <li key={post.slug}>
                  <Link
                    href={`/posts/${post.slug}`}
                    className="group flex gap-3 rounded-xl px-3 py-2.5 -mx-3 transition-colors hover:bg-surface"
                  >
                    <span className="w-4 shrink-0 text-sm font-semibold text-accent tabular-nums">
                      {i + 1}
                    </span>
                    <span className="min-w-0 text-sm font-medium leading-6 line-clamp-2 break-keep transition-colors group-hover:text-accent">
                      {post.title}
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
