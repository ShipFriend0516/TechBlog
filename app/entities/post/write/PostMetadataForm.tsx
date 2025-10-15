import { Series } from '@/app/types/Series';
import Select from '@/app/entities/common/Select';
import { FaPlus } from 'react-icons/fa6';
import { CgMoveRight } from 'react-icons/cg';
import { ChangeEvent, useState } from 'react';
import { FaTrash } from 'react-icons/fa';

interface PostMetadataFormProps {
  onTitleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  title: string;
  onSubTitleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  subTitle: string;
  seriesLoading: boolean;
  series: Series[];
  tags: string[];
  setTags: (tags: string[]) => void;
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
  // 새로 추가된 props
  isPrivate: boolean;
  onPrivateChange: (isPrivate: boolean) => void;
}

const PostMetadataForm = (props: PostMetadataFormProps) => {
  const [tagInput, setTagInput] = useState<string>('');

  const handleTagInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim() !== '') {
      if (props.tags.includes(tagInput)) {
        setTagInput('');
        return;
      }
      if (e.nativeEvent.isComposing) return;
      props.setTags([...(props.tags || []), tagInput]);
      setTagInput('');
    } else if (e.key === 'Backspace' && tagInput === '') {
      props.setTags(props.tags.slice(0, -1));
    }
  };

  const handlePublicChange = (e: ChangeEvent<HTMLInputElement>) => {
    props.onPrivateChange(e.target.checked);
  };

  return (
    <>
      <div className="flex mb-4 gap-1 items-center">
        <span className=" font-bold text-default flex-shrink-0">
          제&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;목&nbsp;
        </span>
        <input
          type="text"
          placeholder="제목"
          className="inline min-w-12 px-2 py-1 outline-none text-default  bg-transparent border-b border-gray-300 text-sm flex-grow"
          onChange={props.onTitleChange}
          value={props.title}
        />
      </div>
      <div className="flex mb-4 gap-1 items-center">
        <span className=" font-bold text-default flex-shrink-0">
          소&nbsp;&nbsp;제&nbsp;&nbsp;목&nbsp;
        </span>
        <input
          type="text"
          placeholder="소제목"
          className="inline min-w-12 px-2 py-1 outline-none text-default  bg-transparent border-b border-gray-300 text-sm flex-grow"
          onChange={props.onSubTitleChange}
          value={props.subTitle}
        />
      </div>

      <div className={'flex justify-start items-center'}>
        <div className="flex flex-wrap mb-4 gap-1 items-center">
          <span className="w-12 font-bold mr-3 flex-shrink text-nowrap flex-nowrap">
            태그 입력
          </span>
          {(props.tags || []).map((tag, index) => (
            <span
              key={index}
              className="inline-block bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm font-semibold cursor-pointer hover:animate-blink duration-75"
              onClick={() => {
                props.setTags(
                  props.tags.filter((_, i) => {
                    return i !== index;
                  })
                );
              }}
            >
              {tag}
            </span>
          ))}
          <input
            type="text"
            placeholder="태그를 입력하세요"
            className="inline min-w-12 px-2 py-1 outline-none text-default  bg-transparent border-b border-gray-300 text-sm  "
            onChange={handleTagInputChange}
            onKeyDown={handleTagInputKeyDown}
            value={tagInput}
          />
        </div>
      </div>

      <div className={'flex items-center w-full gap-2  mb-4'}>
        <div className={'w-1/2 flex justify-start items-center gap-6'}>
          <label className={'inline-flex items-center text-nowrap  gap-2 '}>
            <span className={'font-bold'}>시&nbsp;&nbsp;리&nbsp;&nbsp;즈</span>
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
          {/* 공개/비공개 체크박스 추가 */}
          <div className={'flex items-center gap-2'}>
            <label
              className={
                'inline-flex items-center text-nowrap gap-2 cursor-pointer'
              }
            >
              <span className={'font-bold text-default'}>
                비&nbsp;&nbsp;&nbsp;&nbsp;공&nbsp;&nbsp;&nbsp;&nbsp;개
              </span>
              <input
                type="checkbox"
                checked={props.isPrivate}
                onChange={handlePublicChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
            </label>
          </div>
        </div>

        <button
          onClick={props.onClickNewSeries}
          className="flex items-center gap-2 py-1 px-2 bg-slate-100 text-green-400 font-semibold rounded-full hover:shadow-xl transition-all duration-300 border-4 border-gray-200 dark:bg-gray-800 dark:text-green-200 dark:border-gray-700"
        >
          새로운 시리즈 <FaPlus />
        </button>
        <button
          onClick={props.onClickOverwrite}
          className="flex items-center gap-2 py-1 px-2 bg-slate-100 text-blue-400 font-semibold rounded-full hover:shadow-xl transition-all duration-300 border-4 border-gray-200 dark:bg-gray-800 dark:text-blue-200 dark:border-gray-700"
        >
          임시저장본
          <CgMoveRight />
        </button>

        <button
          onClick={props.clearDraft}
          className="flex items-center gap-2 py-1 px-2 bg-slate-100 text-red-400 font-semibold rounded-full hover:shadow-xl transition-all duration-300 border-4 border-gray-200 dark:bg-gray-800 dark:text-red-200 dark:border-gray-700"
        >
          임시저장 삭제
          <FaTrash />
        </button>
      </div>
    </>
  );
};

export default PostMetadataForm;
