import SeriesThumbnail from '@/app/entities/series/SeriesThumbnail';
import { formatDotDate } from '@/app/lib/utils/format';
import { SeriesDetail } from '@/app/types/Series';

interface SeriesDetailHeaderProps {
  series: SeriesDetail;
}

const SeriesDetailHeader = ({ series }: SeriesDetailHeaderProps) => {
  const { posts } = series;
  const totalMinutes = posts.reduce((sum, post) => sum + post.timeToRead, 0);
  const period =
    posts.length > 0
      ? [posts[0].date, posts[posts.length - 1].date]
          .map(formatDotDate)
          .filter((date, index, dates) => dates.indexOf(date) === index)
          .join(' – ')
      : null;

  const meta = [
    `${posts.length}편`,
    totalMinutes > 0 && `총 ${totalMinutes}분`,
    period,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <header className="mt-6 grid gap-8 md:grid-cols-[1fr_320px] md:items-end">
      <div className="min-w-0">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent">
          Series
        </p>
        <h1 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight break-keep">
          {series.title}
        </h1>
        {series.description && (
          <p className="mt-4 leading-7 text-fg-soft break-keep">
            {series.description}
          </p>
        )}
        <p className="mt-5 text-sm text-fg-muted tabular-nums">{meta}</p>
      </div>
      <SeriesThumbnail
        src={series.thumbnailImage}
        alt={`${series.title} 시리즈 썸네일`}
        sizes="(max-width: 767px) 100vw, 320px"
        priority
        className="aspect-[16/10] rounded-card"
      />
    </header>
  );
};

export default SeriesDetailHeader;
