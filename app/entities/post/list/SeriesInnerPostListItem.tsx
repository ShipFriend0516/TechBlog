import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Link from 'next/link';
import TagBox from '@/app/entities/post/tags/TagBox';
import Image from 'next/image';
import { MdOutlineImageNotSupported } from 'react-icons/md';
import { FaEyeSlash } from 'react-icons/fa';

interface SeriesPostListItemProps {
  slug: string;
  title: string;
  subTitle?: string;
  content: string;
  thumbnailImage: string | StaticImport;
  date: number;
  timeToRead: number;
  tags: string[];
  isPrivate?: boolean;
}

const SeriesPostListItem = ({
  slug,
  title,
  subTitle,
  content,
  thumbnailImage,
  date,
  timeToRead,
  tags,
  isPrivate,
}: SeriesPostListItemProps) => {
  const formattedDate = new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const allInOneRegex =
    /```[\s\S]*?```|`([^`]+)`|^#{1,6}\s+|\*\*([^*]+)\*\*|__([^_]+)__|~~([^~]+)~~|\*([^*]+)\*|_([^_]+)_|\[([^\]]+)\]\([^)]+\)|!\[([^\]]*)\]\([^)]+\)|^>\s*|^\d+\.\s+|^[-*+]\s+|^[-*]{3,}$|\||\<[^>]+\>/gm;

  return (
    <li className="relative w-full border-b mx-auto h-48 group  hover:scale-105 z-0 hover:z-50 transition-transform duration-300 ">
      <Link href={`/posts/${slug}`} className="block h-full" title={title}>
        <div className="relative flex items-center bg-white hover:bg-neutral-100/80 dark:bg-neutral-800 shadow-sm hover:shadow-md transition-shadow duration-200  border-neutral-400 overflow-hidden h-full">
          <div className="flex-1 w-2/3 h-full p-6">
            <h3 className="inline-flex items-center gap-2 text-xl font-semibold text-nowrap text-gray-800 dark:text-white line-clamp-2 ">
              {title}
              {isPrivate && <FaEyeSlash />}
            </h3>
            <h4 className={'font-light text-neutral-800 dark:text-neutral-400'}>
              {subTitle}
            </h4>
            <p className={'text-weak text-sm py-2'}>
              {content
                .slice(0, 500)
                .replaceAll(allInOneRegex, '')
                .slice(0, 150)}
              ...
            </p>
            <div className="font-light flex items-center text-xs text-weak">
              <span className="mr-3">{formattedDate}</span>
              <span className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {timeToRead}분
              </span>
              <TagBox
                tagCloudClassName={
                  'bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 text-xs font-semibold'
                }
                className={'text-xs ml-4'}
                tags={tags}
              />
            </div>
          </div>
          <div className="flex items-center relative   rounded-tr-none rounded-br-none overflow-hidden flex-shrink-0 w-1/3  h-full p-4  ">
            <div
              className={
                'rounded-lg overflow-hidden relative w-full h-full shadow-inner group-hover:shadow-nb-neutral-300 transition-shadow duration-300 border border-neutral-overlay dark:border-neutral-700'
              }
            >
              {thumbnailImage ? (
                <Image
                  src={thumbnailImage}
                  alt={title}
                  fill
                  className="group-hover:scale-110   object-cover rounded-lg  transition-transform duration-300 "
                  loading={'lazy'}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-xs">
                    <MdOutlineImageNotSupported />
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
};

export default SeriesPostListItem;
