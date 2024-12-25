import { ChangeEvent, useState } from 'react';
import { createSeries } from '@/app/entities/series/api/series';
import useToast from '@/app/hooks/useToast';

interface CreateSeriesOverlayContainerProps {
  setCreateSeriesOpen: (open: boolean) => void;
}

const CreateSeriesOverlayContainer = ({
  setCreateSeriesOpen,
}: CreateSeriesOverlayContainerProps) => {
  const [seriesTitle, setSeriesTitle] = useState<string>('');
  const [seriesDescription, setSeriesDescription] = useState<string>('');
  const [seriesThumbnail, setSeriesThumbnail] = useState<string>('');
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

  return (
    <div className={'p-5 flex flex-col gap-2 items-stretch justify-center'}>
      <h2 className={'text-3xl font-bold text-center'}>새로운 시리즈 만들기</h2>
      <p className={'text-center'}>
        새로운 시리즈를 생성합니다. 제목은 필수로 작성해야합니다.
      </p>
      <label className={'inline-flex items-center text-nowrap flex-grow gap-2'}>
        <span className={'font-bold w-24'}>시리즈 이름</span>
        <input
          type="text"
          placeholder="시리즈의 이름"
          className="flex-grow p-2 border border-gray-300 rounded text-black"
          onChange={(e) => setSeriesTitle(e.target.value)}
          value={seriesTitle || ''}
        />
      </label>
      <label className={'inline-flex items-center text-nowrap flex-grow gap-2'}>
        <span className={'font-bold w-24'}>시리즈 설명</span>
        <textarea
          placeholder="시리즈의 설명"
          className="flex-grow p-2 border border-gray-300 rounded text-black"
          onChange={(e) => setSeriesDescription(e.target.value)}
          value={seriesDescription || ''}
        />
      </label>
      <label className={'inline-flex items-center text-nowrap flex-grow gap-2'}>
        <span className={'font-bold w-24'}>시리즈 썸네일</span>
        <input
          type="text"
          placeholder="시리즈의 썸네일 링크"
          className="flex-grow p-2 border border-gray-300 rounded text-black"
          onChange={(e) => setSeriesThumbnail(e.target.value)}
          value={seriesThumbnail || ''}
        />
      </label>

      <div className={'inline-flex items-stretch justify-center h-8 gap-2'}>
        <button
          onClick={() => setCreateSeriesOpen(false)}
          className={'w-1/3 bg-gray-200 shadow'}
        >
          취소
        </button>
        <button onClick={postSeries} className={'w-1/3 bg-emerald-500 shadow'}>
          생성
        </button>
      </div>
    </div>
  );
};
export default CreateSeriesOverlayContainer;
