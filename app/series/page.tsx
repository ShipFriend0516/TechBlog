import NotFound from '@/app/entities/common/Animation/NotFound';
import PageHeader from '@/app/entities/common/PageHeader';
import { SERIES_GRID_CLASS } from '@/app/entities/series/list/seriesGrid';
import SeriesListEntry from '@/app/entities/series/list/SeriesListEntry';
import SeriesLoadMore from '@/app/entities/series/list/SeriesLoadMore';
import { getPublicSeriesPage } from '@/app/lib/getPublicSeriesPage';

export const dynamic = 'force-dynamic';

const SeriesListPage = async () => {
  const { items, nextCursor } = await getPublicSeriesPage();

  return (
    <section className="w-full max-w-6xl mx-auto px-4 pb-4">
      <PageHeader eyebrow="Series" title="모든 시리즈" className="mt-10 mb-8" />
      {items.length === 0 ? (
        <NotFound message="아직 공개된 시리즈가 없습니다." className="py-8" />
      ) : (
        <ul className={SERIES_GRID_CLASS}>
          {items.map((item, index) => (
            <SeriesListEntry key={item._id} item={item} index={index} />
          ))}
          {nextCursor && (
            <SeriesLoadMore
              initialCursor={nextCursor}
              initialCount={items.length}
              initialIds={items.map((item) => item._id)}
            />
          )}
        </ul>
      )}
    </section>
  );
};

export default SeriesListPage;
