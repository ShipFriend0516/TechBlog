import { memo, useMemo } from 'react';
import { ReferrerItem } from '@/app/types/Admin';
import { toPercent } from './fetchAnalytics';

const DIRECT_VISIT = '직접 방문';

interface ReferrerTableProps {
  referrers: ReferrerItem[];
  // 카드 형태(단독 사용) 여부 — 상세 패널 안에서는 배경 없이 렌더링
  standalone?: boolean;
}

const ReferrerTable = ({ referrers, standalone = true }: ReferrerTableProps) => {
  const total = useMemo(
    () => referrers.reduce((sum, r) => sum + r.count, 0),
    [referrers]
  );

  return (
    <div className={standalone ? 'bg-surface rounded-xl overflow-hidden' : ''}>
      <div className="flex items-center gap-4 px-4 py-2 text-xs font-medium text-fg-muted border-b border-hairline">
        <span className="w-4 shrink-0" />
        <span className="flex-1">유입경로</span>
        <span className="w-16 shrink-0 text-right">건수</span>
        <span className="w-28 sm:w-40 shrink-0 text-right">비율</span>
      </div>
      <ul>
        {referrers.map((item, i) => {
          const percent = toPercent(item.count, total);
          return (
            <li
              key={item.source}
              className="px-4 py-2.5 border-b border-hairline last:border-b-0 hover:bg-raised/40 transition-colors duration-150 flex items-center gap-4"
            >
              <span className="text-xs text-fg-muted w-4 shrink-0 text-right">
                {i + 1}
              </span>
              <span className="flex-1 min-w-0 text-sm font-medium truncate">
                {item.source === DIRECT_VISIT ? (
                  item.source
                ) : (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-accent/10 text-accent">
                    {item.source}
                  </span>
                )}
              </span>
              <span className="text-sm font-semibold w-16 shrink-0 text-right tabular-nums">
                {item.count.toLocaleString()}
              </span>
              <div className="w-28 sm:w-40 shrink-0 flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-raised overflow-hidden">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${percent.toFixed(1)}%` }}
                  />
                </div>
                <span className="text-xs text-fg-muted w-10 text-right shrink-0 tabular-nums">
                  {percent.toFixed(1)}%
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default memo(ReferrerTable);
