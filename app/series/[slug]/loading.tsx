import Skeleton from '@/app/entities/common/Skeleton/Skeleton';

const ITEM_COUNT = 4;

// SeriesDetail 레이아웃(뒤로가기, 헤더+썸네일, 목차)을 그대로 따라가는 뼈대
const SeriesDetailLoading = () => (
  <section
    className="w-full max-w-5xl mx-auto px-4 pb-16"
    aria-busy="true"
    aria-label="시리즈를 불러오는 중"
  >
    <Skeleton className="mt-10 h-5 w-24" />
    <div className="mt-6 grid gap-8 md:grid-cols-[1fr_320px] md:items-end">
      <div>
        <Skeleton className="h-3 w-14" />
        <Skeleton className="mt-3 h-9 w-2/3" />
        <Skeleton className="mt-5 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-4/5" />
        <Skeleton className="mt-6 h-4 w-48" />
      </div>
      <Skeleton className="aspect-[16/10] !rounded-card" />
    </div>
    <div className="mt-14 mb-4 flex items-center justify-between">
      <Skeleton className="h-6 w-20" />
      <Skeleton className="h-9 w-40 !rounded-full" />
    </div>
    <ol className="flex flex-col gap-3">
      {Array.from({ length: ITEM_COUNT }, (_, index) => (
        <li
          key={index}
          className="flex items-center gap-4 md:gap-6 rounded-card bg-surface p-4 md:p-5"
        >
          <Skeleton className="h-7 w-8 shrink-0" />
          <div className="flex-1">
            <Skeleton className="h-5 w-3/5" />
            <Skeleton className="mt-2 h-4 w-full" />
            <Skeleton className="mt-3 h-3 w-32" />
          </div>
          <Skeleton className="hidden sm:block w-32 md:w-40 shrink-0 aspect-[16/10] !rounded-xl" />
        </li>
      ))}
    </ol>
  </section>
);

export default SeriesDetailLoading;
