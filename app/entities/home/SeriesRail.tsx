import Image from 'next/image';
import Link from 'next/link';
import SectionHeader from '@/app/entities/home/SectionHeader';
import { HomeSeries } from '@/app/types/Home';

const SeriesRail = ({ series }: { series: HomeSeries[] }) => {
  if (series.length === 0) return null;

  return (
    <section>
      <SectionHeader
        eyebrow="Series"
        title="이어서 읽는 글"
        action={{ href: '/series', label: '모든 시리즈' }}
      />
      <ul className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 scrollbar-custom">
        {series.map((item) => (
          <li key={item.slug} className="snap-start shrink-0 w-64 md:w-72">
            <Link
              href={`/series/${item.slug}`}
              className="group block h-full rounded-[20px] bg-surface p-4 transition-all duration-300 ease-out-expo hover:bg-raised hover:shadow-glow-md hover:-translate-y-0.5"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-gradient-to-br from-nebula-subtle via-raised to-accent-subtle">
                {item.thumbnailImage && (
                  <Image
                    src={item.thumbnailImage}
                    alt={`${item.title} 시리즈 썸네일`}
                    fill
                    sizes="288px"
                    className="object-cover"
                  />
                )}
                <span className="absolute bottom-2 right-2 rounded-full bg-base/80 backdrop-blur px-2.5 py-0.5 text-xs font-medium text-fg-soft">
                  {item.postCount}편
                </span>
              </div>
              <h3 className="mt-4 font-semibold leading-snug break-keep transition-colors group-hover:text-accent-strong">
                {item.title}
              </h3>
              {item.description && (
                <p className="mt-1.5 text-sm text-fg-muted leading-6 line-clamp-2">
                  {item.description}
                </p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default SeriesRail;
