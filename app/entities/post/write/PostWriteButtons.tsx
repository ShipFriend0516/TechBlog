import Link from 'next/link';
import { FaHome } from 'react-icons/fa';
import { FaChevronLeft, FaCloud, FaRocket } from 'react-icons/fa6';
import LoadingSpinner from '@/app/entities/common/Loading/LoadingSpinner';
import { PostBody } from '@/app/types/Post';

interface PostWriteButtonsProps {
  slug: string | null;
  postBody: PostBody;
  submitLoading: boolean;
  submitHandler: (postBody: PostBody) => void;
  saveToDraft: () => void;
  saveToCloud: () => void;
}
const PostWriteButtons = ({
  slug,
  submitLoading,
  submitHandler,
  postBody,
  saveToDraft,
  saveToCloud,
}: PostWriteButtonsProps) => {
  const buttonStyle = `inline-flex justify-center items-center font-bold py-2 px-4 rounded disabled:bg-opacity-75 gap-2 `;
  return (
    <div className={'w-full flex justify-center my-6 gap-2'}>
      <Link href={'/admin'}>
        <button
          className={buttonStyle + 'text-fg bg-raised hover:bg-danger '}
        >
          <FaChevronLeft />
          나가기
        </button>
      </Link>
      <button
        onClick={saveToDraft}
        className={buttonStyle + 'bg-raised hover:bg-overlay text-fg '}
      >
        <FaHome />
        저장
      </button>
      <button
        onClick={saveToCloud}
        className={
          buttonStyle +
          'text-on-accent bg-accent/80 hover:bg-accent '
        }
      >
        <FaCloud />
        저장
      </button>
      <button
        disabled={submitLoading}
        className={
          buttonStyle +
          'bg-accent/80 hover:bg-accent text-on-accent'
        }
        onClick={(e) => {
          e.preventDefault();
          submitHandler(postBody);
        }}
      >
        <FaRocket />
        {submitLoading ? <LoadingSpinner /> : slug ? '글 수정' : '글 발행'}
      </button>
    </div>
  );
};

export default PostWriteButtons;
