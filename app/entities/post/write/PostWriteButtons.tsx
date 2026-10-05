import Link from 'next/link';
import { FiChevronLeft, FiCloud, FiHardDrive, FiSend } from 'react-icons/fi';
import LoadingSpinner from '@/app/entities/common/Loading/LoadingSpinner';
import { PostBody } from '@/app/types/Post';

interface PostWriteButtonsProps {
  slug: string | null;
  postBody: PostBody;
  submitLoading: boolean;
  submitHandler: (postBody: PostBody) => void;
  saveToDraft: () => void;
  saveToCloud: () => void;
  errors: string[] | null;
}

const secondaryButton =
  'inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-fg-soft hover:bg-raised hover:text-fg transition-colors';

// 화면 하단에 붙어 있는 저장/발행 바. 검증 오류도 여기서 바로 보여준다.
const PostWriteButtons = ({
  slug,
  submitLoading,
  submitHandler,
  postBody,
  saveToDraft,
  saveToCloud,
  errors,
}: PostWriteButtonsProps) => {
  return (
    <div className="sticky bottom-0 z-30 -mx-4 mt-6 border-t bg-base/90 px-4 py-3 backdrop-blur">
      <div className="flex flex-wrap items-center gap-2">
        <Link href={'/admin'} className={secondaryButton}>
          <FiChevronLeft />
          나가기
        </Link>

        <div className="min-w-0 flex-1 text-sm text-danger" role="alert">
          {errors && errors.length > 0 && (
            <p className="truncate" title={errors.join('\n')}>
              {errors[0]}
              {errors.length > 1 && (
                <span className="text-fg-muted"> 외 {errors.length - 1}건</span>
              )}
            </p>
          )}
        </div>

        <button type="button" onClick={saveToDraft} className={secondaryButton}>
          <FiHardDrive />
          기기에 저장
        </button>
        <button type="button" onClick={saveToCloud} className={secondaryButton}>
          <FiCloud />
          클라우드 저장
        </button>
        <button
          type="button"
          disabled={submitLoading}
          className="inline-flex min-w-[6.5rem] items-center justify-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-on-accent hover:bg-accent-strong disabled:opacity-60 transition-colors"
          onClick={(e) => {
            e.preventDefault();
            submitHandler(postBody);
          }}
        >
          {submitLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <FiSend />
              {slug ? '수정하기' : '발행하기'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PostWriteButtons;
