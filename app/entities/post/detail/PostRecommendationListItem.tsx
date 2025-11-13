import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';
import { MdOutlineImageNotSupported } from 'react-icons/md';
import TagBox from '@/app/entities/post/tags/TagBox';

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
  // 날짜 포맷팅
  const formattedDate = new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <li className="w-full mb-4 mx-auto ">
      <Link href={`/posts/${slug}`} className="block" title={title}>
        <div className="relative flex items-center bg-white dark:bg-neutral-800  shadow-sm hover:shadow-md transition-shadow duration-200  border-neutral-400    border-l-4 border-l-emerald-700  overflow-hidden">
          <div className="relative w-0 md:w-32 h-24 mr-4  rounded-tr-none rounded-br-none overflow-hidden flex-shrink-0">
            {thumbnailImage ? (
              <Image
                src={thumbnailImage}
                alt={title}
                fill
                className="hidden md:block object-cover"
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
          <div className="flex-1 p-1">
            <h3 className=" text-sm  text-nowrap text-gray-800 dark:text-white line-clamp-2 mb-2">
              {title}
            </h3>
            <div className="font-light flex items-center text-xs md:text-sm text-weak">
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
              <TagBox className={'hidden lg:block ml-4'} tags={tags} />
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
};

export default PostRecommendationListItem;
