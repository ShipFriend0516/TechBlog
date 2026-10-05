import { FaBookOpen } from 'react-icons/fa';
import PageHeader from '@/app/entities/common/PageHeader';
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
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <FaBookOpen className="mb-4 h-12 w-12 text-fg-muted" />
          <h2 className="text-xl font-semibold text-fg">
            No Series Found
          </h2>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
