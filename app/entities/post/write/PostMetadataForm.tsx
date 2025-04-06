import { Series } from '@/app/types/Series';
import Select from '@/app/entities/common/Select';
import { FaPlus } from 'react-icons/fa6';
import { CgMoveRight } from 'react-icons/cg';
import { ChangeEvent } from 'react';
import { FaTrash } from 'react-icons/fa';

interface PostMetadataFormProps {
  onTitleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  title: string;
  onSubTitleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  subTitle: string;
  seriesLoading: boolean;
  series: Series[];
  callbackfn: (s: Series) => { label: string; value: string };
  defaultSeries: (
    value:
      | ((prevState: string | undefined) => string | undefined)
      | string
      | undefined
  ) => void;
  seriesId: string | undefined;
  onClickNewSeries: () => void;
  onClickOverwrite: () => void;
  clearDraft: () => void;
}

const PostMetadataForm = (props: PostMetadataFormProps) => (
  <>
    <input
      type="text"
      placeholder="제목"
      className="w-full p-2 border border-gray-300 rounded mb-4 text-black font-bold"
      onChange={props.onTitleChange}
      value={props.title}
    />
    <input
      type="text"
      placeholder="소제목"
      className="w-full p-2 border border-gray-300 rounded mb-4 text-black"
      onChange={props.onSubTitleChange}
      value={props.subTitle}
    />
    <div className={'flex items-center gap-2  w-full mb-4'}>
      <label className={'inline-flex items-center text-nowrap flex-grow gap-2'}>
        <span className={'font-bold'}>시리즈</span>
        {props.seriesLoading ? (
          <div>loading...</div>
        ) : (
          <Select
            options={props.series.map(props.callbackfn)}
            setValue={props.defaultSeries}
            defaultValue={
              props.seriesId
                ? props.seriesId
                : props.series.length > 0
                  ? props.series[0]._id
                  : ''
            }
          />
        )}
      </label>
      <button
        onClick={props.onClickNewSeries}
        className={
          'inline-flex items-center   gap-2 bg-green-200 text-black p-2  rounded-md hover:bg-green-300 text-sm'
        }
      >
        새로운 시리즈 <FaPlus />
      </button>
      <button
        onClick={props.onClickOverwrite}
        className={
          'inline-flex items-center gap-2  bg-neutral-200 text-black p-2 rounded-md text-sm'
        }
      >
        임시저장본
        <CgMoveRight />
      </button>

      <button
        onClick={props.clearDraft}
        className={
          'inline-flex items-center gap-2  bg-pink-200 text-black p-2 rounded-md text-sm'
        }
      >
        임시저장 삭제
        <FaTrash />
      </button>
    </div>
  </>
);
export default PostMetadataForm;
