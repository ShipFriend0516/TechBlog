import Image from 'next/image';
import example from '@/app/public/thumbnail_example2.jpg';
import Profile from '@/app/entities/common/Profile';
import Timestamp from '@/app/entities/common/Timestamp';
import { Post } from '@/app/types/Post';

const PostPreview = ({
  title,
  subTitle,
  author,
  date,
  timeToRead,
}: Omit<Post, 'content'>) => {
  return (
    <div
      className={
        'post-preview mb-12 p-5 bg-gray-100 text-black max-w-3xl mx-auto rounded-lg'
      }
    >
      <div
        className={
          'image-container overflow-hidden h-2/3 flex justify-center relative '
        }
      >
        <Image
          src={example}
          alt={'dd'}
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          className="bg-cover w-full h-full"
        />
      </div>
      <div className={'h-1/3 flex flex-col gap-4 py-5 p-5'}>
        <h2 className={'font-bold text-2xl'}>{title}</h2>
        <p>{subTitle ? subTitle.slice(0, 100) + '...' : ''}</p>
        <div className={'inline-flex justify-between w-full'}>
          <Profile profileThumbnail={''} username={author} />
          <Timestamp date={date} />
        </div>
      </div>
    </div>
  );
};
export default PostPreview;
