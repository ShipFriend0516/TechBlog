import Image, { ImageProps } from 'next/image';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';

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
  return (
    <div className={'post-header relative overflow-hidden w-full text-center'}>
      <h1 className={'post-title pt-20'}>{title}</h1>
      <h2 className={'post-subtitle'}>{subTitle}</h2>
      <div className={'pb-10 inline-flex items-center '}>
        <div className={'items-center post-author flex'}>
          <div
            className={'w-8 h-8 aspect-square rounded-full bg-gray-300 '}
          ></div>
          <span className={'font-bold mx-2'}>{author}</span>
        </div>
        <span className={'post-date'}>
          {new Date(date).toLocaleDateString()}
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
