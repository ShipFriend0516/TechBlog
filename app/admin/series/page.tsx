'use client';
import { useState } from 'react';
import DeleteModal from '@/app/entities/common/Modal/DeleteModal';
import Overlay from '@/app/entities/common/Overlay/Overlay';
import { deleteSeries, reorderSeries } from '@/app/entities/series/api/series';
import CreateSeriesOverlayContainer from '@/app/entities/series/CreateSeriesOverlayContainer';
import AdminSeriesList from '@/app/entities/series/list/AdminSeriesList';
import useDataFetch, {
  useDataFetchConfig,
} from '@/app/hooks/common/useDataFetch';
import { Series } from '@/app/types/Series';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

const AdminSeriesPage = () => {
  const [seriesList, setSeriesList] = useState<Series[] | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

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

  const handleReorder = async (newList: Series[]) => {
    setSeriesList(newList);
    setSaveStatus('saving');
    try {
      await reorderSeries(newList.map((s) => s.slug));
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('순서 저장 실패:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
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
        <div className={'mb-4 flex items-center gap-3'}>
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
          {saveStatus === 'saving' && (
            <span className="text-xs text-neutral-400 dark:text-neutral-500">
              저장 중...
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="text-xs text-emerald-500">순서 저장됨</span>
          )}
          {saveStatus === 'error' && (
            <span className="text-xs text-red-500">저장 실패</span>
          )}
          {!loading && seriesList && seriesList.length > 1 && saveStatus === 'idle' && (
            <span className="text-xs text-neutral-400 dark:text-neutral-500">
              드래그하여 순서를 변경할 수 있습니다
            </span>
          )}
        </div>
        <AdminSeriesList
          handleUpdateSeries={handleUpdateSeries}
          handleDeleteClick={handleDeleteClick}
          seriesList={seriesList}
          loading={loading}
          onReorder={handleReorder}
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
