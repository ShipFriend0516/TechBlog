import Skeleton from '@/app/entities/common/Skeleton/Skeleton';

interface SeriesGridSkeletonProps {
  gridCount: number;
}

// SeriesPreview 카드와 같은 뼈대 — 오른쪽에 비치는 장, 썸네일, 제목, 설명, 날짜
const SeriesGridSkeleton = ({ gridCount }: SeriesGridSkeletonProps) =>
  Array.from({ length: gridCount }, (_, index) => (
    <li key={index} className="rounded-card bg-surface p-4">
      <div className="relative">
        <div className="absolute inset-0 translate-x-1.5 scale-y-[0.93] rounded-xl bg-fg/[0.06]" />
        <Skeleton className="relative aspect-[16/10] !rounded-xl" />
      </div>
      <Skeleton className="mt-4 h-6 w-3/4" />
      <Skeleton className="mt-2.5 h-4 w-full" />
      <Skeleton className="mt-1.5 h-4 w-2/3" />
      <Skeleton className="mt-5 h-3 w-20" />
    </li>
  ));

export default SeriesGridSkeleton;
