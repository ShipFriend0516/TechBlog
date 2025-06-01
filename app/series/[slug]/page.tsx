'use client';
import useDataFetch, {
  useDataFetchConfig,
} from '@/app/hooks/common/useDataFetch';
import SVGLoadingSpinner from '@/app/entities/common/Loading/SVGLoadingSpinner';
import Image from 'next/image';
import { BiBook } from 'react-icons/bi';
import { Post } from '@/app/types/Post';
import ErrorBox from '@/app/entities/common/Error/ErrorBox';
import { FaArrowLeft, FaChevronDown } from 'react-icons/fa';
import Link from 'next/link';
import Select from '@/app/entities/common/Select';
import { useState } from 'react';
import SeriesPostListItem from '@/app/entities/post/list/SeriesInnerPostListItem';

interface SeriesDetailPageProps {
  params: {
    slug: string;
  };
}

const SeriesDetailPage = ({ params }: SeriesDetailPageProps) => {
  const [orderOption, setOrderOption] = useState<'latest' | 'oldest' | string>(
    'latest'
  );
  const orderOptions = [
    { value: 'latest', label: '최신순' },
    { value: 'oldest', label: '오래된 순' },
  ];

  const getSeriesDetailConfig: useDataFetchConfig = {
    url: `/api/series/${params.slug}`,
    method: 'GET',
  };

  const { data: series, loading, error } = useDataFetch(getSeriesDetailConfig);

  const SeriesDetailHeader = () => {
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
            'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-neutral-800 to-transparent bg-opacity-90 pt-24 px-6 pb-6'
          }
        >
          <h1 className={'text-2xl text-white font-bold'}>{series.title}</h1>
          <p className={'text-white mt-2'}>{series.description}</p>
        </div>
      </div>
    );
  };
  const SeriesDetailPostList = () => {
    return (
      <div className={'mt-3'}>
        <div className={'flex items-center justify-between'}>
          <h2 className={'inline-flex items-center gap-1 text-lg '}>
            <BiBook />
            시리즈 내 포스트 ({series.posts ? series.posts.length : 0})
          </h2>
          <div className={'inline-flex items-center gap-1'}>
            <FaChevronDown />
            <Select
              options={orderOptions}
              defaultValue={orderOption}
              setValue={setOrderOption}
            />
          </div>
        </div>
        <hr className={'my-2'} />
        <ul className={'drop-shadow-sm rounded-lg '}>
          {series.posts && series.posts.length > 0 ? (
            (orderOption === 'oldest'
              ? series.posts
              : series.posts.reverse()
            ).map((post: Post) => (
              <SeriesPostListItem
                key={post._id}
                slug={post.slug}
                title={post.title}
                subTitle={post.subTitle || ''}
                content={post.content || ''}
                thumbnailImage={post.thumbnailImage || ''}
                date={post.date}
                timeToRead={post.timeToRead}
                tags={post.tags || []}
              />
            ))
          ) : (
            <p className={'py-4 text-gray-500'}>👻 포스트가 없습니다.</p>
          )}
        </ul>
      </div>
    );
  };

  return (
    <section>
      {loading && <SVGLoadingSpinner />}
      <ErrorBox error={error} />

      {series && (
        <div
          className={
            'relative flex flex-col justify-center gap-2 max-w-5xl mx-auto p-10 animate-popUp  rounded-lg'
          }
        >
          <Link
            href={'/series'}
            className={
              'inline-flex items-center justify-start gap-2 mb-4 hover:underline hover:font-bold cursor-pointer'
            }
          >
            <FaArrowLeft /> 시리즈 목록으로 돌아가기
          </Link>
          <SeriesDetailHeader />
          <SeriesDetailPostList />
        </div>
      )}
    </section>
  );
};

export default SeriesDetailPage;
