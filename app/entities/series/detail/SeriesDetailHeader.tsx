import Image from 'next/image';
import { Series } from '@/app/types/Series';

interface SeriesDetailHeaderProps {
  series: Series;
}
const SeriesDetailHeader = ({ series }: SeriesDetailHeaderProps) => {
  return (
    <div
      className={
        'relative aspect-[5/2] flex items-center justify-between overflow-hidden rounded-lg  mb-4'
      }
    >
      {series.thumbnailImage && (
        <Image
          src={series.thumbnailImage}
          alt={series.title}
          className={'mt-4 w-full h-auto object-cover'}
          width={1200}
          height={400}
        />
      )}
      <div
        className={
          'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-neutral-700 to-transparent bg-opacity-90 pt-12 px-6 pb-6'
        }
      >
        <h1 className={'text-3xl text-white font-bold'}>{series.title}</h1>
        <p className={'text-white mt-2'}>{series.description}</p>
      </div>
    </div>
  );
};

export default SeriesDetailHeader;
