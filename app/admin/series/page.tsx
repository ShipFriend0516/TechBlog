'use client';
import { useState } from 'react';
import DeleteModal from '@/app/entities/common/Modal/DeleteModal';
import Overlay from '@/app/entities/common/Overlay/Overlay';
import { deleteSeries } from '@/app/entities/series/api/series';
import CreateSeriesOverlayContainer from '@/app/entities/series/CreateSeriesOverlayContainer';
import AdminSeriesList from '@/app/entities/series/list/AdminSeriesList';
import useDataFetch, {
  useDataFetchConfig,
} from '@/app/hooks/common/useDataFetch';
import { Series } from '@/app/types/Series';
const AdminSeriesPage = () => {
  const [seriesList, setSeriesList] = useState<Series[] | null>(null);
  const getSeriesListConfig: useDataFetchConfig<Series[]> = {
    url: '/api/series',
    method: 'GET',
    config: {
      params: {
        compact: 'true',
      },
    },
    onSuccess: (data) => {
      setSeriesList(data);
    },
  };
  const { loading } = useDataFetch<Series[]>(getSeriesListConfig);
  const [createSeriesOpen, setCreateSeriesOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState<Series | null>(null);
  const handleUpdateSeries = (series: Series) => {
    setCreateSeriesOpen(true);
    setSelectedSeries(series);
  };
  const handleCloseOverlay = () => {
    setCreateSeriesOpen(false);
    setSelectedSeries(null);
  };

  const handleDeleteSeries = async (slug: string) => {
    if (!seriesList) return;
    try {
      const data = await deleteSeries(slug);
      if (data.success) {
        console.log('시리즈 삭제 성공:', data);
      } else {
        console.error('시리즈 삭제 실패:', data);
      }
    } catch (error) {
      console.error('시리즈 삭제 중 오류 발생:', error);
    }

    const updatedSeriesList = seriesList.filter(
      (series) => series.slug !== slug
    );
    setSeriesList(updatedSeriesList);
    setShowDeleteDialog(false);
    setSelectedSeries(null);
  };

  const handleDeleteClick = (slug: string) => {
    setShowDeleteDialog(true);
    setSelectedSeries(
      seriesList?.find((series) => series.slug === slug) || null
    );
  };

  return (
    <section className={'mx-auto max-w-6xl px-4 py-6'}>
      <div className={'mb-6 flex items-start justify-between gap-4'}>
        <div>
          <h1 className={'text-3xl font-bold text-default'}>시리즈 관리</h1>
          <p className={'mt-1 text-sm text-weak'}>
            시리즈를 추가, 수정, 삭제할 수 있습니다.
          </p>
        </div>
        <button
          onClick={() => setCreateSeriesOpen(true)}
          className={
            'inline-flex shrink-0 items-center gap-2 rounded-lg bg-brand-secondary px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-600'
          }
        >
          <span className={'text-lg leading-none'}>+</span>
          시리즈 추가
        </button>
      </div>
      <div>
        <div className={'mb-4 flex items-baseline gap-2'}>
          <h2 className={'text-lg font-semibold text-default'}>
            등록된 시리즈 목록
          </h2>
          <span
            className={
              'rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300'
            }
          >
            {seriesList?.length || 0}
          </span>
        </div>
        <AdminSeriesList
          handleUpdateSeries={handleUpdateSeries}
          handleDeleteClick={handleDeleteClick}
          seriesList={seriesList}
          loading={loading}
        />
      </div>
      <Overlay
        overlayOpen={createSeriesOpen}
        setOverlayOpen={setCreateSeriesOpen}
      >
        <CreateSeriesOverlayContainer
          setCreateSeriesOpen={setCreateSeriesOpen}
          handleCloseOverlay={handleCloseOverlay}
          series={selectedSeries || undefined}
        />
      </Overlay>
      {showDeleteDialog && (
        <DeleteModal
          message={
            '이 시리즈를 삭제하시겠습니까? 이 작업은 영구적으로 영향을 미치는 작업입니다.'
          }
          onCancel={() => setShowDeleteDialog(false)}
          onConfirm={() => handleDeleteSeries(selectedSeries?.slug || '')}
        />
      )}
    </section>
  );
};

export default AdminSeriesPage;
