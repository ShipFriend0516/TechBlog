import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { FaBookOpen, FaCalendar } from 'react-icons/fa';
import { Series } from '@/app/types/Series';

interface SeriesPreviewProps {
  item: Series;
}

const SeriesPreview = ({ item }: SeriesPreviewProps) => {
  const darkmodeStyle = `dark:bg-primary-900 dark:text-neutral-200 dark:border-neutral-800 `;
  const lightmodeStyle = `bg-white border-slate-200`;

  return (
    <Link
      title={item.title}
      href={`/series/${item.slug}`}
      key={item.slug}
      className={`cursor-pointer group  rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200 overflow-hidden border ${lightmodeStyle} ${darkmodeStyle} `}
    >
      <div className="relative aspect-video w-full overflow-hidden">
        {item.thumbnailImage ? (
          <Image
            width={400}
            height={300}
            src={item.thumbnailImage}
            alt={item.title}
            loading={'lazy'}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full bg-slate-200 flex items-center justify-center">
            <FaBookOpen className="w-12 h-12 text-slate-400" />
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-default text-xl font-semibold mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
          {item.title}
        </h3>

        <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
          <span className="flex items-center gap-1">
            <FaCalendar className="w-4 h-4" />
            {new Date(item.date).toLocaleDateString()}
          </span>
          <span className="ml-auto flex items-center gap-1">
            <FaBookOpen className="w-4 h-4" />
            {item.posts.length || 0} posts
          </span>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3">
          {item.description || 'No description available'}
        </p>
      </div>
    </Link>
  );
};
export default SeriesPreview;
