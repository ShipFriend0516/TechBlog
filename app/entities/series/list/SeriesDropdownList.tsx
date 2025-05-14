import { Series } from '@/app/types/Series';
import SeriesDropdownItem from '@/app/entities/series/SeriesDropdownItem';

interface SearchDropdownListProps {
  series: Series[] | null;
  setSeriesOpen: (open: boolean) => void;
}

const SeriesDropdownList = ({
  series,
  setSeriesOpen,
}: SearchDropdownListProps) => {
  return (
    <div className="bg-overlay absolute left-0 mt-2 w-64 z-50 text-overlay">
      <div className="py-2">
        {series?.map((s) => (
          <SeriesDropdownItem
            key={s.slug}
            setSeriesOpen={setSeriesOpen}
            seriesSlug={s.slug}
            seriesTitle={s.title}
            seriesCount={s.posts.length || 0}
          />
        ))}
        {series?.length === 0 && (
          <div className={'p-2'}>시리즈가 없습니다.</div>
        )}
      </div>
    </div>
  );
};
export default SeriesDropdownList;
