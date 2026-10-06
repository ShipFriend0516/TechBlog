import PostsGridSkeleton from '@/app/entities/common/Skeleton/PostsGridSkeleton';
import Skeleton from '@/app/entities/common/Skeleton/Skeleton';

const ITEMS_PER_PAGE = 12;
const TAG_CHIP_WIDTHS = ['w-16', 'w-20', 'w-14', 'w-24', 'w-16', 'w-20', 'w-12', 'w-20'];

// 글 목록 페이지 첫 진입 시 실제 레이아웃(검색·태그·카드 그리드)을 그대로 따라가는 뼈대
const PostListSkeleton = () => {
  return (
    <div aria-busy="true" aria-label="글 목록을 불러오는 중">
      <div className="w-full max-w-6xl mx-auto px-4 mt-8 flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <Skeleton className="h-12 flex-1 rounded-xl" />
          <Skeleton className="h-12 w-full sm:w-56 rounded-xl" />
        </div>
        <div className="flex gap-2 overflow-hidden py-1">
          {TAG_CHIP_WIDTHS.map((width, index) => (
            <Skeleton
              key={index}
              className={`h-8 ${width} flex-shrink-0 rounded-full`}
            />
          ))}
        </div>
        <div className="flex items-center min-h-8 pt-1">
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      <ul className="max-w-6xl mx-auto post-list my-4 px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <PostsGridSkeleton gridCount={ITEMS_PER_PAGE} />
      </ul>
    </div>
  );
};

export default PostListSkeleton;
