import Galaxy from '@/app/entities/home/Galaxy';
import SectionHeader from '@/app/entities/home/SectionHeader';
import { BlogStats, StarPost } from '@/app/types/Home';

interface TrajectorySectionProps {
  stars: StarPost[];
  stats: BlogStats;
  now: number;
}

const TrajectorySection = ({ stars, stats, now }: TrajectorySectionProps) => {
  if (stars.length === 0) return null;

  const days = stats.firstPostDate
    ? Math.floor((now - stats.firstPostDate) / 86_400_000)
    : 0;

  const items = [
    { value: stats.postCount.toLocaleString(), label: '개의 글' },
    { value: days.toLocaleString(), label: '일째 기록 중' },
  ];

  return (
    <section>
      <SectionHeader eyebrow="Trajectory" title="지금까지의 궤적" />
      <dl className="flex flex-wrap gap-x-10 gap-y-4 mb-6">
        {items.map((item) => (
          <div key={item.label} className="flex items-baseline gap-1.5">
            <dt className="sr-only">{item.label}</dt>
            <dd className="text-3xl font-bold tabular-nums">{item.value}</dd>
            <span className="text-sm text-fg-muted">{item.label}</span>
          </div>
        ))}
      </dl>
      <div className="rounded-[20px] bg-surface p-4 md:p-6">
        <Galaxy stars={stars} now={now} />
        <p className="mt-2 text-xs text-fg-muted">
          가운데의 첫 글에서 바깥으로 갈수록 최근 글입니다. 많이 읽힌 글일수록
          크고 밝게 빛나고, 별에 올리면 같은 시리즈가 이어집니다.
        </p>
      </div>
    </section>
  );
};

export default TrajectorySection;
