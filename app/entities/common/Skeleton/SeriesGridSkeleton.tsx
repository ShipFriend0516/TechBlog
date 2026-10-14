import Skeleton from '@/app/entities/common/Skeleton/Skeleton';

interface SeriesGridSkeletonProps {
  gridCount: number;
}

// SeriesPreview 카드와 같은 뼈대 — 겹친 장, 썸네일, 제목, 설명, 날짜
const SeriesGridSkeleton = ({ gridCount }: SeriesGridSkeletonProps) =>
  Array.from({ length: gridCount }, (_, index) => (
    <li key={index} className="rounded-card bg-surface p-4">
      <div className="relative pt-2.5">
        <div className="absolute inset-x-3 top-1.5 h-6 rounded-t-xl bg-fg/[0.06]" />
        <Skeleton className="relative aspect-[16/10] !rounded-xl" />
      </div>
      <Skeleton className="mt-4 h-6 w-3/4" />
      <Skeleton className="mt-2.5 h-4 w-full" />
      <Skeleton className="mt-1.5 h-4 w-2/3" />
      <Skeleton className="mt-5 h-3 w-20" />
    </li>
  ));

export default SeriesGridSkeleton;
