import { FaBookOpen } from 'react-icons/fa';
import SeriesListEntry from '@/app/entities/series/list/SeriesListEntry';
import SeriesLoadMore from '@/app/entities/series/list/SeriesLoadMore';
import { getPublicSeriesPage } from '@/app/lib/getPublicSeriesPage';

export const dynamic = 'force-dynamic';

const SeriesListPage = async () => {
  const { items, nextCursor } = await getPublicSeriesPage();

  return (
    <section className={'w-full p-4 max-w-5xl mx-auto'}>
      <h1 className={'text-4xl font-bold mt-4'}>시리즈</h1>
      <p className={'text-lg text-weak mb-4'}>
        시리즈별로 글을 확인해보세요. 클릭시 세부 페이지로 이동합니다.
      </p>
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <FaBookOpen className="mb-4 h-12 w-12 text-slate-400" />
          <h2 className="text-xl font-semibold text-slate-700">
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
