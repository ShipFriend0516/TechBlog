import Image from 'next/image';
import Link from 'next/link';
import { formatDotDate } from '@/app/lib/utils/format';
import { SeriesPostSummary } from '@/app/types/Series';

const MAX_TAGS = 3;

interface SeriesPostItemProps {
  post: SeriesPostSummary;
  number: number;
}

const SeriesPostItem = ({ post, number }: SeriesPostItemProps) => (
  <li>
    <Link
      href={`/posts/${post.slug}`}
      className="group flex items-center gap-4 md:gap-6 card-interactive rounded-card p-4 md:p-5"
    >
      <span className="w-8 shrink-0 text-center text-2xl font-bold tabular-nums text-fg-faint transition-colors group-hover:text-accent">
        {String(number).padStart(2, '0')}
      </span>

      <div className="min-w-0 flex-1">
        <h3 className="font-semibold leading-snug break-keep line-clamp-2 transition-colors group-hover:text-accent-strong md:text-lg">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-1 text-sm leading-6 text-fg-muted line-clamp-2">
            {post.excerpt}
          </p>
        )}
        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[13px] text-fg-faint tabular-nums">
          <span>{formatDotDate(post.date)}</span>
          {post.timeToRead > 0 && <span>{post.timeToRead}분</span>}
          {post.tags.length > 0 && (
            <span className="hidden sm:flex gap-1.5">
              {post.tags.slice(0, MAX_TAGS).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-accent-subtle px-2 py-0.5 text-[11px] font-medium text-accent"
                >
                  {tag}
                </span>
              ))}
            </span>
          )}
        </div>
      </div>

      {post.thumbnailImage && (
        <div className="relative hidden sm:block w-32 md:w-40 shrink-0 aspect-[16/10] overflow-hidden rounded-xl bg-raised">
          <Image
            src={post.thumbnailImage}
            alt=""
            fill
            sizes="160px"
            className="object-cover transition-transform duration-500 ease-out-expo group-hover:scale-[1.03]"
          />
        </div>
      )}
    </Link>
  </li>
);

export default SeriesPostItem;
