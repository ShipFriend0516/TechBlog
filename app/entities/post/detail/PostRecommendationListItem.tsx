import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';
import { MdOutlineImageNotSupported } from 'react-icons/md';

interface PostRecommendationListItemProps {
  slug: string;
  title: string;
  thumbnailImage: string | StaticImport;
  date: number;
  timeToRead: number;
  tags: string[];
}

const PostRecommendationListItem: FC<PostRecommendationListItemProps> = ({
  slug,
  title,
  thumbnailImage,
  date,
  timeToRead,
  tags,
}) => {
  const formattedDate = new Date(date)
    .toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .replace(/\. /g, '.')
    .replace(/\.$/, '');

  return (
    <li className="mb-1">
      <Link
        href={`/posts/${slug}`}
        title={title}
        className="group flex items-center gap-4 px-2.5 py-3.5 rounded-xl transition-colors duration-200 hover:bg-neutral-50 dark:hover:bg-neutral-800"
      >
        <div className="relative w-[116px] aspect-[16/9] rounded-[10px] overflow-hidden flex-shrink-0 bg-neutral-100 dark:bg-neutral-800">
          {thumbnailImage ? (
            <Image
              src={thumbnailImage}
              alt={title}
              width={116}
              height={65}
              className="object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-400">
              <MdOutlineImageNotSupported />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {tags.length > 0 && (
            <div className="flex gap-1.5 mb-1.5 flex-wrap">
              {tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 text-[11px] font-medium bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="text-sm font-bold leading-snug line-clamp-1 text-gray-900 dark:text-white group-hover:text-primary-mountain transition-colors duration-200">
            {title}
          </div>
          <div className="text-xs text-weak mt-1">
            {formattedDate} · {timeToRead}분 읽기
          </div>
        </div>

        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-neutral-400 group-hover:text-primary-mountain transition-colors overflow-hidden relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-[18px] h-[18px] group-hover:animate-arrowChase"
            aria-hidden="true"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </Link>
    </li>
  );
};

export default PostRecommendationListItem;
