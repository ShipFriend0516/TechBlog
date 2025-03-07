'use client';

import Image from 'next/image';
import example from '@/app/public/thumbnail_example2.jpg';
import Profile from '@/app/entities/common/Profile';
import Timestamp from '@/app/entities/common/Timestamp';
import { Post } from '@/app/types/Post';
import { useState } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import Link from 'next/link';

const PostPreview = ({
  slug,
  title,
  subTitle,
  author,
  date,
  profileImage,
  thumbnailImage,
}: Omit<Post, 'content'>) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Link href={`/posts/${slug}`} className={'mx-auto h-[400px] group '}>
      <div
        className={
          'w-full post-preview p-px  bg-gray-100 text-black rounded-md transition-all duration-500 shadow-lg  hover:-translate-y-2 hover:shadow-xl dark:shadow-gray-200/40 hover:shadow-gray-200/80 overflow-hidden'
        }
      >
        <div
          className={
            'image-container rounded-t-md overflow-hidden h-2/3 flex justify-center relative '
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
            } group-hover:scale-105 transition duration-200`}
            onLoad={() => setIsLoading(false)}
          />
        </div>
        <div className={'h-1/3 flex flex-col justify-between gap-4 p-4'}>
          <div>
            <h2 className={'font-bold text-xl'}>{title}</h2>
            <p>{subTitle ? subTitle.slice(0, 80) + '...' : ''}</p>
          </div>
          <div className={'inline-flex items-center justify-between w-full'}>
            <Profile profileThumbnail={profileImage} username={author} />
            <Timestamp date={date} />
          </div>
        </div>
      </div>
    </Link>
  );
};
export default PostPreview;
