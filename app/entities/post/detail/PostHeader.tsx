'use client';

import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';
import { useState } from 'react';
import { FaBook } from 'react-icons/fa';
import Profile from '@/app/entities/common/Profile';
import TypingText from '../../common/Typography/TypingText';

interface Props {
  title: string;
  subTitle: string;
  slug: string;
  author: string;
  date: number;
  timeToRead: number;
  backgroundThumbnail?: StaticImport | string;
  isAdmin?: boolean;
}

const PostHeader = ({
  title,
  subTitle,
  slug,
  author,
  date,
  timeToRead,
  backgroundThumbnail,
  isAdmin = false,
}: Props) => {
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  const handleEditClick = () => {
    const editUrl = `/admin/write?slug=${slug}`;
    window.open(editUrl, '_blank')?.focus();
  };

  return (
    <div
      className={
        'post-header h-[220px] md:h-[292px] relative overflow-hidden w-full text-center  text-white'
      }
    >
      {backgroundThumbnail && (
        <div
          className={
            'image-container h-full absolute z-10 w-full top-0 blur bg-gray-400/40'
          }
        >
          <Image
            className={'object-cover w-full h-full'}
            width={480}
            height={300}
            src={backgroundThumbnail}
            alt={`${title} Thumbnail`}
            loading={'eager'}
            priority={true}
            placeholder={'blur'}
            blurDataURL={'/images/placeholder/thumbnail_example2.webp'}
            quality={30}
            fetchPriority={'high'}
          />
        </div>
      )}
      <div className="relative h-full z-20 bg-gray-400/40  px-6">
        <h1
          className={
            'font-bold mb-4 pt-10 md:pt-20 text-3xl md:text-5xl z-10 px-2 break-keep'
          }
        >
          <TypingText
            title={title}
            delay={50}
            onComplete={() => setIsTypingComplete(true)}
          />
        </h1>
        <h2
          className={`md:text-2xl font-bold mb-4 transition-opacity duration-500 ${
            isTypingComplete ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {subTitle}
        </h2>
        <div
          className={`pb-10 inline-flex items-center transition-opacity duration-500 ${
            isTypingComplete ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className={'items-center post-author flex'}>
            <Profile
              profileThumbnail={'/images/profile/profile.jpg'}
              username={author}
            />
          </div>
          <span className={'post-date'}>
            {new Date(date).toLocaleDateString('ko-KR')}
          </span>
          <span
            className={'post-time-to-read mx-2 inline-flex items-center gap-2'}
          >
            <FaBook />
            {timeToRead} min read
          </span>
          {isAdmin && (
            <button onClick={handleEditClick}>
              <span className="underline">Edit</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostHeader;
