'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import Profile from '@/app/entities/common/Profile';
import Timestamp from '@/app/entities/common/Timestamp';
import { Post } from '@/app/types/Post';
import example from '@/public/images/placeholder/thumbnail_example2.webp';

const PostPreview = ({
  slug,
  title,
  subTitle,
  author,
  date,
  profileImage,
  thumbnailImage,
  tags,
}: Omit<Post, 'content'>) => {
  const [isLoading, setIsLoading] = useState(true);
  const lightmodeStyle = `bg-white text-black hover:shadow-neutral-200/80 `;
  const darkmodeStyle = `dark:bg-neutral-900 dark:text-neutral-200 dark:border-neutral-800 dark:shadow-neutral-800/40 dark:hover:shadow-neutral-800/80`;

  return (
    <Link href={`/posts/${slug}`} className={'block mx-auto group rounded-2xl active:bg-gray-600/20'}>
      <div
        className={`w-full h-full post-preview p-px rounded-2xl transition-all duration-300 origin-bottom hover:-translate-y-2 hover:shadow-xl active:scale-95 overflow-hidden ${lightmodeStyle} ${darkmodeStyle}`}
      >
        <div
          className={
            'image-container  rounded-t-2xl overflow-hidden h-1/2 flex justify-center relative '
          }
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
              <AiOutlineLoading3Quarters className="w-8 h-8 animate-spin text-gray-500" />
            </div>
          )}
          <Image
            src={thumbnailImage || example}
            priority={true}
            alt={title}
            width={500}
            height={300}
            className={`object-cover bg-cover w-full h-full transition duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }   transition duration-200`}
            onLoad={() => setIsLoading(false)}
          />
        </div>
        <div className={'h-1/2 flex flex-col justify-between gap-4 p-4'}>
          <div className={''}>
            <h2 className={'font-bold text-lg line-clamp-2'}>{title}</h2>
            <p className={'line-clamp-1 w-full text-weak'}>
              {subTitle ? subTitle.slice(0, 40) + '' : ''}
            </p>
          </div>
          <div
            className={
              'inline-flex items-center justify-between w-full text-sm'
            }
          >
            <Profile profileThumbnail={profileImage} username={author} />
            <Timestamp date={date} />
          </div>
        </div>
      </div>
    </Link>
  );
};
export default PostPreview;
