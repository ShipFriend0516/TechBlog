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
}

const CreateSeriesOverlayContainer = ({
  setCreateSeriesOpen,
  series,
  handleCloseOverlay,
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
  const toast = useToast();

  const close = () => {
    if (handleCloseOverlay) {
      handleCloseOverlay();
    } else {
      setCreateSeriesOpen(false);
    }
  };

  const postSeries = async () => {
    try {
      const data = await createSeries({
        title: seriesTitle,
        description: seriesDescription,
        thumbnailImage: seriesThumbnail,
      });
      if (data._id) {
        toast.success('시리즈가 성공적으로 생성되었습니다.');
      } else {
        toast.error('시리즈 생성 중 오류가 발생했습니다.');
      }
    } catch (e) {
      toast.error('시리즈 생성 중 오류가 발생했습니다.');
      console.error('시리즈 생성 중 오류 발생', e);
    } finally {
      setCreateSeriesOpen(false);
    }
  };

  const editSeries = async () => {
    try {
      if (isEditMode) {
        const result = await updateSeries(series.slug, {
          title: seriesTitle,
          description: seriesDescription,
          thumbnailImage: seriesThumbnail,
        });
        if (result._id) {
          toast.success('시리즈가 성공적으로 수정되었습니다.');
        }
      }
    } catch (e) {
      toast.error('시리즈 수정 중 오류가 발생했습니다.');
      console.error('시리즈 수정 중 오류 발생', e);
    } finally {
      close();
    }
  };

  const isSubmitDisabled = seriesTitle.trim().length === 0;
  const showThumbnailPreview = seriesThumbnail.trim().length > 0 && !thumbnailError;

  const inputClass =
    'w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/30 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500';

  return (
    <div className="mx-auto w-full max-w-lg overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-start justify-between gap-4 border-b border-neutral-200 px-6 py-5 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-brand-secondary dark:bg-emerald-900/30 dark:text-emerald-300">
            <FaBookOpen className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
              {isEditMode ? '시리즈 수정' : '새 시리즈 만들기'}
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {isEditMode
                ? '시리즈의 정보를 수정합니다.'
                : '제목은 필수 항목입니다.'}
            </p>
          </div>
        </div>
        <button
          onClick={close}
          aria-label="닫기"
          className="rounded-full p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
        >
          <IoCloseOutline className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-5 px-6 py-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
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
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
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
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
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
            <div className="mt-2 overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700">
              <div className="relative h-32 w-full bg-neutral-100 dark:bg-neutral-800">
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

      <div className="flex justify-end gap-2 border-t border-neutral-200 bg-neutral-50 px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900/60">
        <button
          onClick={close}
          className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-200 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          취소
        </button>
        <button
          onClick={isEditMode ? editSeries : postSeries}
          disabled={isSubmitDisabled}
          className="rounded-lg bg-brand-secondary px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500 dark:disabled:bg-neutral-700 dark:disabled:text-neutral-500"
        >
          {isEditMode ? '저장' : '생성'}
        </button>
      </div>
    </div>
  );
};
export default CreateSeriesOverlayContainer;
