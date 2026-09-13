import Image from 'next/image';
import Link from 'next/link';
import { FaBookOpen, FaCalendar } from 'react-icons/fa';
import type { SeriesListItem } from '@/app/types/Series.d';

interface SeriesPreviewProps {
  item: SeriesListItem;
}

const SeriesPreview = ({ item }: SeriesPreviewProps) => {
  const lightmodeStyle = `bg-surface text-fg `;
  const darkmodeStyle = `    `;

  return (
    <Link
      title={item.title}
      href={`/series/${item.slug}`}
      key={item.slug}
      className="block cursor-pointer group rounded-lg"
    >
      <div
        className={`min-h-[326px] shadow-sm hover:shadow-xl origin-bottom transition-all duration-300 hover:-translate-y-2 active:scale-95 overflow-hidden border rounded-lg ${lightmodeStyle} ${darkmodeStyle}`}
      >
        <div className="relative aspect-video w-full overflow-hidden">
          {item.thumbnailImage ? (
            <Image
              width={400}
              height={300}
              src={item.thumbnailImage}
              alt={item.title}
              loading={'lazy'}
              sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 320px"
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full bg-raised flex items-center justify-center">
              <FaBookOpen className="w-12 h-12 text-fg-muted" />
            </div>
          )}
        </div>

        <div className="p-5">
          <h3 className="text-xl font-semibold mb-2 line-clamp-2 group-hover:text-accent-strong transition-colors">
            {item.title}
          </h3>

          <div className="flex items-center gap-2 text-sm text-fg-soft mb-3">
            <span className="flex items-center gap-1">
              <FaCalendar className="w-4 h-4" />
              {new Date(item.date).toLocaleDateString('ko-KR', {
                timeZone: 'Asia/Seoul',
              })}
            </span>
            <span className="ml-auto flex items-center gap-1">
              <FaBookOpen className="w-4 h-4" />
              {item.postCount} posts
            </span>
          </div>

          <p className="text-sm text-fg-soft line-clamp-3">
            {item.description || 'No description available'}
          </p>
        </div>
      </div>
    </Link>
  );
};
export default SeriesPreview;
