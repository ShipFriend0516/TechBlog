'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Profile from '@/app/entities/common/Profile';
import profile from '@/app/public/profile.jpg';
import { FaBook } from 'react-icons/fa';

interface Props {
  title: string;
  subTitle: string;
  author: string;
  date: number;
  timeToRead: number;
  backgroundThumbnail?: StaticImport | string;
}

const PostHeader = ({
  title,
  subTitle,
  author,
  date,
  timeToRead,
  backgroundThumbnail,
}: Props) => {
  const [displayTitle, setDisplayTitle] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    if (!title) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= title.length) {
        setDisplayTitle(title.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsTypingComplete(true);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [title]);

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
            placeholder={'empty'}
          />
        </div>
      )}
      <div className="relative h-full z-20 bg-gray-400/40">
        <h1
          className={'font-bold mb-4 pt-10 md:pt-20 text-3xl md:text-5xl z-10'}
        >
          {displayTitle}
          {!isTypingComplete && (
            <span className="inline-block w-1 h-6 ml-1 bg-black animate-blink" />
          )}
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
            <Profile profileThumbnail={profile} username={author} />
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
        </div>
      </div>
    </div>
  );
};

export default PostHeader;
