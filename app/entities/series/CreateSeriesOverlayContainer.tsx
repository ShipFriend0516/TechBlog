import Image from 'next/image';
import { useState } from 'react';
import { FaBookOpen } from 'react-icons/fa';
import { IoCloseOutline } from 'react-icons/io5';
import { createSeries, updateSeries } from '@/app/entities/series/api/series';
import useToast from '@/app/hooks/useToast';
import { Series } from '@/app/types/Series';

interface CreateSeriesOverlayContainerProps {
  setCreateSeriesOpen: (open: boolean) => void;
  series?: Series;
  handleCloseOverlay?: () => void;
  // 생성/수정 성공 시 호출 (목록 갱신 등)
  onSaved?: () => void;
}

const CreateSeriesOverlayContainer = ({
  setCreateSeriesOpen,
  series,
  handleCloseOverlay,
  onSaved,
}: CreateSeriesOverlayContainerProps) => {
  const isEditMode = !!series;
  const [seriesTitle, setSeriesTitle] = useState<string>(
    isEditMode ? series?.title || '' : ''
  );
  const [seriesDescription, setSeriesDescription] = useState<string>(
    isEditMode ? series?.description : ''
  );
  const [seriesThumbnail, setSeriesThumbnail] = useState<string>(
    isEditMode ? series?.thumbnailImage || '' : ''
  );
  const [thumbnailError, setThumbnailError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const close = () => {
    if (handleCloseOverlay) {
      handleCloseOverlay();
    } else {
      setCreateSeriesOpen(false);
    }
  };

  const postSeries = async () => {
    setSubmitting(true);
    try {
      const data = await createSeries({
        title: seriesTitle,
        description: seriesDescription,
        thumbnailImage: seriesThumbnail,
      });
      if (data._id) {
        toast.success('시리즈가 성공적으로 생성되었습니다.');
        onSaved?.();
      } else {
        toast.error('시리즈 생성 중 오류가 발생했습니다.');
      }
    } catch (e) {
      toast.error('시리즈 생성 중 오류가 발생했습니다.');
      console.error('시리즈 생성 중 오류 발생', e);
    } finally {
      setSubmitting(false);
      close();
    }
  };

  const editSeries = async () => {
    setSubmitting(true);
    try {
      if (isEditMode) {
        const result = await updateSeries(series.slug, {
          title: seriesTitle,
          description: seriesDescription,
          thumbnailImage: seriesThumbnail,
        });
        if (result._id) {
          toast.success('시리즈가 성공적으로 수정되었습니다.');
          onSaved?.();
        }
      }
    } catch (e) {
      toast.error('시리즈 수정 중 오류가 발생했습니다.');
      console.error('시리즈 수정 중 오류 발생', e);
    } finally {
      setSubmitting(false);
      close();
    }
  };

  const isSubmitDisabled = submitting || seriesTitle.trim().length === 0;
  const showThumbnailPreview = seriesThumbnail.trim().length > 0 && !thumbnailError;

  const inputClass =
    'w-full rounded-lg bg-surface px-3.5 py-2.5 text-sm text-fg placeholder:text-fg-muted outline-none transition-colors focus:border-accent/40 focus:ring-2 focus:ring-accent/30 ';

  return (
    <div className="mx-auto w-full max-w-lg overflow-hidden rounded-2xl bg-surface shadow-2xl">
      <div className="flex items-start justify-between gap-4 border-b border-hairline px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-subtle text-accent">
            <FaBookOpen className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-fg">
              {isEditMode ? '시리즈 수정' : '새 시리즈 만들기'}
            </h2>
            <p className="text-xs text-fg-muted">
              {isEditMode
                ? '시리즈의 정보를 수정합니다.'
                : '제목은 필수 항목입니다.'}
            </p>
          </div>
        </div>
        <button
          onClick={close}
          aria-label="닫기"
          className="rounded-full p-1.5 text-fg-muted transition-colors hover:bg-raised hover:text-fg"
        >
          <IoCloseOutline className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-5 px-6 py-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-fg">
            시리즈 이름
            <span className="ml-1 text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="예: 자바스크립트 마스터하기"
            className={inputClass}
            onChange={(e) => setSeriesTitle(e.target.value)}
            value={seriesTitle || ''}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-fg">
            시리즈 설명
          </label>
          <textarea
            placeholder="시리즈를 소개하는 짧은 설명"
            className={`${inputClass} min-h-[100px] resize-y`}
            onChange={(e) => setSeriesDescription(e.target.value)}
            value={seriesDescription || ''}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-fg">
            썸네일 이미지
          </label>
          <input
            type="text"
            placeholder="https://..."
            className={inputClass}
            onChange={(e) => {
              setSeriesThumbnail(e.target.value);
              setThumbnailError(false);
            }}
            value={seriesThumbnail || ''}
          />
          {showThumbnailPreview && (
            <div className="mt-2 overflow-hidden rounded-lg border border-hairline">
              <div className="relative h-32 w-full bg-raised">
                <Image
                  src={seriesThumbnail}
                  alt="썸네일 미리보기"
                  fill
                  className="object-cover"
                  onError={() => setThumbnailError(true)}
                  unoptimized
                />
              </div>
            </div>
          )}
          {thumbnailError && (
            <p className="text-xs text-red-500">
              이미지를 불러올 수 없습니다. URL을 확인해주세요.
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t border-hairline bg-surface px-6 py-4">
        <button
          onClick={close}
          className="rounded-lg px-4 py-2 text-sm font-medium text-fg transition-colors hover:bg-fg/10"
        >
          취소
        </button>
        <button
          onClick={isEditMode ? editSeries : postSeries}
          disabled={isSubmitDisabled}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent shadow-sm transition-colors hover:bg-accent-strong disabled:cursor-not-allowed disabled:bg-fg/10 disabled:text-fg-muted"
        >
          {submitting ? '처리 중...' : isEditMode ? '저장' : '생성'}
        </button>
      </div>
    </div>
  );
};
export default CreateSeriesOverlayContainer;
