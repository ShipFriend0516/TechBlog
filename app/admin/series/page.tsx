'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import AdminPageHeader from '@/app/entities/admin/common/AdminPageHeader';
import DeleteModal from '@/app/entities/common/Modal/DeleteModal';
import Overlay from '@/app/entities/common/Overlay/Overlay';
import { deleteSeries, reorderSeries } from '@/app/entities/series/api/series';
import CreateSeriesOverlayContainer from '@/app/entities/series/CreateSeriesOverlayContainer';
import AdminSeriesList from '@/app/entities/series/list/AdminSeriesList';
import useDataFetch from '@/app/hooks/common/useDataFetch';
import useToast from '@/app/hooks/useToast';
import { Series } from '@/app/types/Series';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

const SERIES_REQUEST_CONFIG = { params: { compact: 'true' } };

const SaveStatusText = ({
  status,
  canReorder,
}: {
  status: SaveStatus;
  canReorder: boolean;
}) => {
  switch (status) {
    case 'saving':
      return <span className="text-xs text-fg-muted">저장 중...</span>;
    case 'saved':
      return <span className="text-xs text-accent">순서 저장됨</span>;
    case 'error':
      return <span className="text-xs text-danger">저장 실패 — 이전 순서로 되돌렸습니다</span>;
    default:
      return canReorder ? (
        <span className="text-xs text-fg-muted">
          드래그(또는 키보드)로 순서를 변경할 수 있습니다
        </span>
      ) : null;
  }
};

const AdminSeriesPage = () => {
  const toast = useToast();
  const [reloadKey, setReloadKey] = useState(0);
  // 서버에서 받은 목록 위에 로컬 변경(삭제/정렬)을 덮어쓴다
  const [localList, setLocalList] = useState<Series[] | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [editingSeries, setEditingSeries] = useState<Series | null>(null);
  const [deleteTargetSlug, setDeleteTargetSlug] = useState<string | null>(null);
  const statusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data, loading } = useDataFetch<Series[]>({
    url: '/api/series',
    method: 'GET',
    config: SERIES_REQUEST_CONFIG,
    dependencies: [reloadKey],
    onSuccess: () => setLocalList(null),
  });
  const seriesList = localList ?? data;
  const deleteTarget = deleteTargetSlug
    ? seriesList?.find((series) => series.slug === deleteTargetSlug) ?? null
    : null;

  useEffect(() => {
    return () => {
      if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
    };
  }, []);

  const flashSaveStatus = (status: SaveStatus, resetAfter: number) => {
    setSaveStatus(status);
    if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
    statusTimerRef.current = setTimeout(() => setSaveStatus('idle'), resetAfter);
  };

  const openCreateOverlay = () => {
    setEditingSeries(null);
    setOverlayOpen(true);
  };

  // 리스트 아이템(memo)에 전달되므로 참조를 고정
  const handleUpdateSeries = useCallback((series: Series) => {
    setEditingSeries(series);
    setOverlayOpen(true);
  }, []);

  // 바깥 클릭/닫기/저장 등 어떤 경로로 닫혀도 편집 대상을 초기화
  const handleOverlayOpenChange = useCallback((open: boolean) => {
    setOverlayOpen(open);
    if (!open) setEditingSeries(null);
  }, []);

  const handleCloseOverlay = useCallback(
    () => handleOverlayOpenChange(false),
    [handleOverlayOpenChange]
  );

  const handleSeriesSaved = useCallback(() => {
    setReloadKey((key) => key + 1);
  }, []);

  const handleDeleteClick = useCallback((slug: string) => {
    setDeleteTargetSlug(slug);
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget || !seriesList) return;
    const { slug } = deleteTarget;
    setDeleteTargetSlug(null);

    try {
      const result = await deleteSeries(slug);
      if (!result.success) throw new Error(result.error);
      setLocalList(seriesList.filter((series) => series.slug !== slug));
      toast.success('시리즈가 삭제되었습니다.');
    } catch (error) {
      console.error('시리즈 삭제 중 오류 발생:', error);
      toast.error('시리즈 삭제에 실패했습니다.');
    }
  };

  const handleReorder = async (newList: Series[]) => {
    const previousList = seriesList;
    setLocalList(newList);
    setSaveStatus('saving');
    try {
      await reorderSeries(newList.map((s) => s.slug));
      flashSaveStatus('saved', 2000);
    } catch (error) {
      console.error('순서 저장 실패:', error);
      setLocalList(previousList ?? null);
      flashSaveStatus('error', 3000);
    }
  };

  return (
    <section className={'mx-auto max-w-6xl px-4 py-6'}>
      <AdminPageHeader
        title="시리즈 관리"
        description="시리즈를 추가, 수정, 삭제할 수 있습니다."
        actions={
          <button
            onClick={openCreateOverlay}
            className={
              'inline-flex shrink-0 items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent shadow-sm transition-colors hover:bg-accent-strong'
            }
          >
            <span className={'text-lg leading-none'}>+</span>
            시리즈 추가
          </button>
        }
      />
      <div>
        <div className={'mb-4 flex flex-wrap items-center gap-3'}>
          <h2 className={'text-lg font-semibold text-fg'}>등록된 시리즈 목록</h2>
          <span
            className={
              'rounded-full bg-raised px-2 py-0.5 text-xs font-medium text-fg-soft'
            }
          >
            {seriesList?.length || 0}
          </span>
          <span aria-live="polite">
            <SaveStatusText
              status={saveStatus}
              canReorder={!loading && !!seriesList && seriesList.length > 1}
            />
          </span>
        </div>
        <AdminSeriesList
          handleUpdateSeries={handleUpdateSeries}
          handleDeleteClick={handleDeleteClick}
          seriesList={seriesList}
          loading={loading && !seriesList}
          onReorder={handleReorder}
        />
      </div>
      <Overlay overlayOpen={overlayOpen} setOverlayOpen={handleOverlayOpenChange}>
        <CreateSeriesOverlayContainer
          setCreateSeriesOpen={handleOverlayOpenChange}
          handleCloseOverlay={handleCloseOverlay}
          onSaved={handleSeriesSaved}
          series={editingSeries ?? undefined}
        />
      </Overlay>
      {deleteTarget && (
        <DeleteModal
          message={`'${deleteTarget.title}' 시리즈를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
          onCancel={() => setDeleteTargetSlug(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </section>
  );
};

export default AdminSeriesPage;
