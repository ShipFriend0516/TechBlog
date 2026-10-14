import Link from 'next/link';
import type { CSSProperties } from 'react';
import SeriesThumbnail from '@/app/entities/series/SeriesThumbnail';
import { formatDotDate } from '@/app/lib/utils/format';
import type { SeriesListItem } from '@/app/types/Series.d';
import styles from './SeriesPreview.module.css';

// 썸네일이 첫 장이므로 뒤에 깔리는 종이는 (글 수 - 1)장, 너무 많으면 지저분해서 상한을 둔다
const MAX_SHEETS = 6;
// 종이는 오른쪽으로만 밀려나고, 뒤 장일수록 세로를 줄여 위·아래는 썸네일 뒤에 숨긴다
const FAN_STEP_X = 4;
const FAN_STEP_SCALE = 0.035;
const FAN_STAGGER_MS = 40;
// 평소 오른쪽에 살짝 비치는 장 수와 그 간격
const REST_PEEK_COUNT = 2;
const REST_STEP_X = 3;

interface SeriesPreviewProps {
  item: SeriesListItem;
}

const getSheets = (postCount: number) => {
  const count = Math.min(Math.max(postCount - 1, 0), MAX_SHEETS);

  return Array.from({ length: count }, (_, index) => {
    const rank = index + 1;
    const isPeeking = rank <= REST_PEEK_COUNT;

    return {
      rank,
      style: {
        '--rest-x': `${isPeeking ? rank * REST_STEP_X : 0}px`,
        '--rest-opacity': isPeeking ? 1 : 0,
        '--sheet-scale': 1 - rank * FAN_STEP_SCALE,
        '--fan-x': `${rank * FAN_STEP_X}px`,
        '--fan-delay': `${index * FAN_STAGGER_MS}ms`,
      } as CSSProperties,
    };
  })
    // 바깥 장이 뒤에 깔리도록 먼저 그린다
    .sort((a, b) => b.rank - a.rank);
};

const SeriesPreview = ({ item }: SeriesPreviewProps) => {
  const sheets = getSheets(item.postCount);

  return (
    <Link
      href={`/series/${item.slug}`}
      className="group flex h-full flex-col card-interactive rounded-card p-4"
    >
      <div className="relative">
        {sheets.map((sheet, index) => (
          <span key={index} aria-hidden className={styles.sheet} style={sheet.style} />
        ))}
        <SeriesThumbnail
          src={item.thumbnailImage}
          alt={`${item.title} 시리즈 썸네일`}
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 360px"
          className="aspect-[16/10] rounded-xl"
        />
        <span className="absolute bottom-2 right-2 rounded-full bg-base/80 px-2.5 py-0.5 text-xs font-medium text-fg-soft backdrop-blur">
          {item.postCount}편
        </span>
      </div>

      <h2 className="mt-4 text-lg font-semibold leading-snug break-keep line-clamp-2 transition-colors group-hover:text-accent-strong">
        {item.title}
      </h2>
      {item.description && (
        <p className="mt-1.5 text-sm leading-6 text-fg-muted line-clamp-2">
          {item.description}
        </p>
      )}
      <p className="mt-auto pt-4 text-[13px] text-fg-faint tabular-nums">
        {formatDotDate(item.date)}
      </p>
    </Link>
  );
};

export default SeriesPreview;
