import Link from 'next/link';
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
  const buttonStyle = `font-bold py-2 px-4 rounded mr-2 disabled:bg-opacity-75 `;
  return (
    <div className={'w-full flex justify-center my-6'}>
      <Link
        href={'/admin'}
        className={buttonStyle + ' text-black bg-gray-200 hover:bg-red-500 '}
      >
        <button>나가기</button>
      </Link>
      <button
        onClick={saveToDraft}
        className={buttonStyle + 'bg-blue-500 hover:bg-blue-700 '}
      >
        임시 저장
      </button>
      <button
        onClick={saveToCloud}
        className={buttonStyle + 'bg-green-500 hover:bg-green-700 '}
      >
        클라우드에 저장
      </button>
      <button
        disabled={submitLoading}
        className={buttonStyle + 'bg-emerald-500  hover:bg-emerald-700 '}
        onClick={(e) => {
          e.preventDefault();
          submitHandler(postBody);
        }}
      >
        {submitLoading ? <LoadingSpinner /> : slug ? '글 수정' : '글 발행'}
      </button>
    </div>
  );
};

export default PostWriteButtons;
