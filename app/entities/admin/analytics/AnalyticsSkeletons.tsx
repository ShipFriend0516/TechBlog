interface RowSkeletonProps {
  rows: number;
  // 각 행에 그릴 고정 폭 셀(px 단위 tailwind 클래스) 목록
  cells: string[];
}

const RowSkeleton = ({ rows, cells }: RowSkeletonProps) => (
  <ul className="animate-pulse">
    {[...Array(rows)].map((_, i) => (
      <li
        key={i}
        className="px-4 py-3 border-b border-hairline last:border-b-0 flex items-center gap-3"
      >
        <div className="h-3.5 w-4 bg-raised rounded shrink-0" />
        <div className="h-3.5 flex-1 bg-raised rounded" />
        {cells.map((cell, j) => (
          <div key={j} className={`${cell} bg-raised rounded shrink-0`} />
        ))}
      </li>
    ))}
  </ul>
);

export const PostSkeletonList = () => (
  <div className="bg-surface rounded-xl overflow-hidden">
    <div className="h-8 border-b border-hairline" />
    <RowSkeleton rows={20} cells={['h-3 w-24', 'h-3 w-20', 'h-3 w-10', 'h-3.5 w-14']} />
  </div>
);

export const ReferrerSkeletonList = ({ rows = 10 }: { rows?: number }) => (
  <div className="bg-surface rounded-xl overflow-hidden">
    <div className="h-8 border-b border-hairline" />
    <RowSkeleton rows={rows} cells={['h-3.5 w-12', 'h-2 w-24 rounded-full']} />
  </div>
);

export const DetailRowsSkeleton = ({ cells }: { cells: string[] }) => (
  <RowSkeleton rows={5} cells={cells} />
);

export const WeeklySkeletonChart = () => (
  <div className="bg-surface rounded-xl p-6 animate-pulse">
    <div className="h-4 w-32 bg-raised rounded mb-4" />
    <div className="h-56 bg-raised rounded" />
  </div>
);
