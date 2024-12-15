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
  _id,
  title,
  subTitle,
  author,
  date,
  profileImage,
  thumbnailImage,
}: Omit<Post, 'content'>) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Link href={`/posts/${_id}`} className={' mx-auto '}>
      <div
        className={
          'w-full post-preview mb-12 p-5 pb-10 bg-gray-100 text-black rounded-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-green-200'
        }
      >
        <div
          className={
            'image-container overflow-hidden h-2/3 flex justify-center relative '
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
            alt={'dd'}
            width={500}
            height={300}
            className={`object-cover bg-cover w-full h-full transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setIsLoading(false)}
          />
        </div>
        <div className={'h-1/3 flex flex-col gap-4 py-5 p-2'}>
          <h2 className={'font-bold text-2xl'}>{title}</h2>
          <p>{subTitle ? subTitle.slice(0, 100) + '...' : ''}</p>
          <div className={'inline-flex justify-between w-full'}>
            <Profile profileThumbnail={profileImage} username={author} />
            <Timestamp date={date} />
          </div>
        </div>
      </div>
    </Link>
  );
};
export default PostPreview;
