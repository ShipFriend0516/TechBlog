'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Profile from '@/app/entities/common/Profile';
import profile from '@/app/public/profile.jpg';

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
    <div className={'post-header relative overflow-hidden w-full text-center'}>
      <h1 className={'post-title pt-20'}>
        {displayTitle}
        {!isTypingComplete && (
          <span className="inline-block w-1 h-6 ml-1 bg-black animate-blink" />
        )}
      </h1>
      <h2
        className={`post-subtitle transition-opacity duration-500 ${
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
        <span className={'post-time-to-read mx-2'}>{timeToRead} min read</span>
      </div>
      {backgroundThumbnail && (
        <div className={'image-container absolute -z-10 w-full top-0 blur'}>
          <Image
            className={'w-full'}
            src={backgroundThumbnail}
            alt={'Post Thumbnail'}
          />
        </div>
      )}
    </div>
  );
};

export default PostHeader;
