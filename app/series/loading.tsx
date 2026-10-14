import PageHeader from '@/app/entities/common/PageHeader';
import SeriesGridSkeleton from '@/app/entities/common/Skeleton/SeriesGridSkeleton';
import { SERIES_GRID_CLASS } from '@/app/entities/series/list/seriesGrid';

// 첫 화면을 채우는 만큼만 — DB 모듈을 끌어오지 않도록 페이지 크기 상수는 쓰지 않음
const SKELETON_COUNT = 6;

const SeriesListLoading = () => (
  <section
    className="w-full max-w-6xl mx-auto px-4 pb-4"
    aria-busy="true"
    aria-label="시리즈 목록을 불러오는 중"
  >
    <PageHeader eyebrow="Series" title="모든 시리즈" className="mt-10 mb-8" />
    <ul className={SERIES_GRID_CLASS}>
      <SeriesGridSkeleton gridCount={SKELETON_COUNT} />
    </ul>
  </section>
);

export default SeriesListLoading;
