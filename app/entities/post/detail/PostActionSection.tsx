'use client';
import useToast from '@/app/hooks/useToast';
import { MdIosShare } from 'react-icons/md';
import { IoEye } from 'react-icons/io5';

interface PostActionSectionProps {
  viewCount?: number;
}

const PostActionSection = ({ viewCount }: PostActionSectionProps) => {
  const toast = useToast();

  const sharePost = async () => {
    const url = window.location.href;
    await navigator.clipboard.writeText(url);
    toast.success('링크가 복사되었습니다.');
  };

  return (
    <section
      className={
        'flex justify-between items-center w-full max-w-3xl mx-auto border-t border-neutral-200 px-4 py-4'
      }
    >
      <button
        title={'클립보드에 글 링크 복사하기'}
        aria-label={'공유하기'}
        onClick={() => sharePost()}
        className={
          ' inline-flex items-center gap-2 rounded-md  p-1 hover:bg-neutral-100 border-neutral-200'
        }
      >
        <MdIosShare size={20} />
      </button>

      <div
        title={'조회수'}
        aria-label={'조회수'}
        className={'inline-flex items-center ml-4'}
      >
        <IoEye size={20} />
        <span className={'text-sm ml-2'}>{viewCount || 0}</span>
      </div>
    </section>
  );
};

export default PostActionSection;
