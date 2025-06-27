'use client';
import { Series } from '@/app/types/Series';
import useDataFetch, {
  useDataFetchConfig,
} from '@/app/hooks/common/useDataFetch';
import { useState } from 'react';
import AdminSeriesList from '@/app/entities/series/list/AdminSeriesList';
import Overlay from '@/app/entities/common/Overlay/Overlay';
import CreateSeriesOverlayContainer from '@/app/entities/series/CreateSeriesOverlayContainer';
import { deleteSeries } from '@/app/entities/series/api/series';
import DeleteModal from '@/app/entities/common/Modal/DeleteModal';
const AdminSeriesPage = () => {
  const [seriesList, setSeriesList] = useState<Series[] | null>(null);
  const getSeriesListConfig: useDataFetchConfig = {
    url: '/api/series',
    method: 'GET',
    config: {
      params: {
        compact: 'true',
      },
    },
    onSuccess: (data: Series[]) => {
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
    <section className={'max-w-6xl mx-auto'}>
      <h1 className={'text-4xl font-bold mt-4'}>시리즈 관리</h1>
      <p className={'text-lg text-weak mb-4'}>
        시리즈를 관리하는 페이지입니다. 시리즈를 추가, 수정, 삭제할 수 있습니다.
      </p>
      <div>
        <button
          onClick={() => setCreateSeriesOpen(true)}
          className={' bg-emerald-500 text-white px-4 py-2 rounded-lg'}
        >
          시리즈 추가
        </button>
      </div>
      <div>
        <h2 className={'text-xl font-bold my-2'}>
          등록된 시리즈 목록 ({seriesList?.length || 0})
        </h2>
        <hr className={'my-4'} />
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
