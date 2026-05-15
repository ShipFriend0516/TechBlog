import { BiBook } from 'react-icons/bi';
import { FaChevronDown } from 'react-icons/fa';
import Select from '@/app/entities/common/Select';
import SeriesPostListItem from '@/app/entities/post/list/SeriesInnerPostListItem';
import { Post } from '@/app/types/Post';
import { SeriesDetail } from '@/app/types/Series';

interface SeriesDetailPostListProps {
  series: SeriesDetail;
  orderOption: 'latest' | 'oldest' | string;
  setOrderOption: (value: 'latest' | 'oldest' | string) => void;
  posts: Post[];
}

const SeriesDetailPostList = ({
  series,
  orderOption,
  setOrderOption,
  posts,
}: SeriesDetailPostListProps) => {
  const orderOptions = [
    { value: 'latest', label: '최신순' },
    { value: 'oldest', label: '오래된 순' },
  ];

  return (
    <div className={'mt-3'}>
      <div className={'flex items-center justify-between'}>
        <h2 className={'inline-flex items-center gap-1 md:text-lg '}>
          <BiBook />
          시리즈 내 포스트
          <span className={'text-weak'}>
            ({series.posts ? series.posts.length : 0})
          </span>
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
          posts.map((post: Post) => (
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
              isPrivate={post.isPrivate}
            />
          ))
        ) : (
          <p className={'py-4 text-gray-500'}>👻 포스트가 없습니다.</p>
        )}
      </ul>
    </div>
  );
};

export default SeriesDetailPostList;
