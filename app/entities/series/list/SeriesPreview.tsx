import Link from 'next/link';
import SeriesThumbnail from '@/app/entities/series/SeriesThumbnail';
import { formatDotDate } from '@/app/lib/utils/format';
import type { SeriesListItem } from '@/app/types/Series.d';

interface SeriesPreviewProps {
  item: SeriesListItem;
}

// 썸네일 뒤로 겹친 장을 깔아 '여러 편이 묶인 시리즈'임을 표현, 호버 시 살짝 펼쳐진다
const SeriesPreview = ({ item }: SeriesPreviewProps) => {
  return (
    <Link
      href={`/series/${item.slug}`}
      className="group flex h-full flex-col card-interactive rounded-card p-4"
    >
      <div className="relative pt-2.5">
        <span
          aria-hidden
          className="absolute inset-x-6 top-0 h-6 rounded-t-xl bg-fg/[0.06] transition-transform duration-300 ease-out-expo group-hover:-translate-y-1"
        />
        <span
          aria-hidden
          className="absolute inset-x-3 top-1.5 h-6 rounded-t-xl bg-fg/[0.1] transition-transform duration-300 ease-out-expo group-hover:-translate-y-0.5"
        />
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
