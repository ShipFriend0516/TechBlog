import { useState } from 'react';
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
  const toast = useToast();

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
      if (handleCloseOverlay) {
        handleCloseOverlay();
      } else {
        setCreateSeriesOpen(false);
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        {isEditMode ? '시리즈 수정하기' : '새로운 시리즈 만들기'}
      </h2>
      <p className="text-gray-600 text-sm mb-6 text-center">
        새로운 시리즈를 생성합니다. 제목은 필수로 작성해야합니다.
      </p>

      <div className="space-y-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            시리즈 이름
          </label>
          <input
            type="text"
            placeholder="시리즈의 이름"
            className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-black"
            onChange={(e) => setSeriesTitle(e.target.value)}
            value={seriesTitle || ''}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            시리즈 설명
          </label>
          <textarea
            placeholder="시리즈의 설명"
            className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-black min-h-[100px] resize-y"
            onChange={(e) => setSeriesDescription(e.target.value)}
            value={seriesDescription || ''}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            시리즈 썸네일
          </label>
          <input
            type="text"
            placeholder="시리즈의 썸네일 링크"
            className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-black"
            onChange={(e) => setSeriesThumbnail(e.target.value)}
            value={seriesThumbnail || ''}
          />
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <button
          onClick={() => setCreateSeriesOpen(false)}
          className="flex-1 py-2.5 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition font-medium"
        >
          취소
        </button>
        <button
          onClick={isEditMode ? editSeries : postSeries}
          className="flex-1 py-2.5 px-4 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition font-medium"
        >
          {isEditMode ? '수정' : '생성'}
        </button>
      </div>
    </div>
  );
};
export default CreateSeriesOverlayContainer;
