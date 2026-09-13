import SeriesPreview from '@/app/entities/series/list/SeriesPreview';
import type { SeriesListItem } from '@/app/types/Series.d';

interface SeriesListEntryProps {
  item: SeriesListItem;
  index: number;
}

export default function SeriesListEntry({ item, index }: SeriesListEntryProps) {
  return (
    <li
      className="opacity-0 translate-y-5 animate-popUp"
      style={{
        animationDelay: `${Math.min(index, 8) * 0.06}s`,
        animationFillMode: 'forwards',
      }}
    >
      <SeriesPreview item={item} />
    </li>
  );
}
