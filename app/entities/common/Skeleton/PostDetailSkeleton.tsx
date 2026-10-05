import Skeleton from '@/app/entities/common/Skeleton/Skeleton';

const TAG_WIDTHS = ['w-16', 'w-20', 'w-14'];
// 문단마다 줄 길이를 달리해 실제 본문처럼 보이게 함
const PARAGRAPHS = [
  ['w-full', 'w-full', 'w-11/12', 'w-3/5'],
  ['w-full', 'w-10/12', 'w-full', 'w-2/3'],
  ['w-full', 'w-full', 'w-4/5'],
];

// 글 상세 페이지 진입 시 헤더(썸네일 배너)와 본문 영역을 따라가는 뼈대
const PostDetailSkeleton = () => {
  return (
    <section
      className="bg-transparent w-full flex-grow"
      aria-busy="true"
      aria-label="글을 불러오는 중"
    >
      <article className="post">
        <div className="post-header h-[220px] md:h-[292px] w-full relative overflow-hidden">
          <Skeleton className="absolute inset-0 !rounded-none" />
          <div className="relative flex flex-col justify-center items-center gap-4 h-full px-6">
            <Skeleton
              useCustomBackground
              className="h-9 md:h-12 w-3/4 md:w-1/2 bg-fg-faint/20"
            />
            <Skeleton
              useCustomBackground
              className="h-5 md:h-7 w-1/2 md:w-1/3 bg-fg-faint/20"
            />
            <div className="flex items-center gap-3">
              <Skeleton
                useCustomBackground
                className="w-8 h-8 rounded-full bg-fg-faint/20"
              />
              <Skeleton
                useCustomBackground
                className="h-4 w-48 md:w-64 bg-fg-faint/20"
              />
            </div>
          </div>
        </div>
        <div className="max-w-full post-body px-3 sm:px-4 py-6 sm:py-8 lg:py-16 min-h-[500px]">
          <div className="flex gap-1 -mt-4 mb-8">
            {TAG_WIDTHS.map((width, index) => (
              <Skeleton key={index} className={`h-7 ${width} rounded-full`} />
            ))}
          </div>
          <div className="flex flex-col gap-10">
            {PARAGRAPHS.map((lines, paragraphIndex) => (
              <div key={paragraphIndex} className="flex flex-col gap-3">
                {paragraphIndex > 0 && <Skeleton className="h-7 w-2/5 mb-2" />}
                {lines.map((width, lineIndex) => (
                  <Skeleton key={lineIndex} className={`h-4 ${width}`} />
                ))}
              </div>
            ))}
            <Skeleton className="h-56 w-full rounded-2xl" />
          </div>
        </div>
      </article>
    </section>
  );
};

export default PostDetailSkeleton;
