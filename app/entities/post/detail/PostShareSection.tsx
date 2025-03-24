'use client';
import useToast from '@/app/hooks/useToast';
import { MdIosShare } from 'react-icons/md';

const PostShareSection = () => {
  const toast = useToast();

  const sharePost = async () => {
    const url = window.location.href;
    await navigator.clipboard.writeText(url);

    toast.success('링크가 복사되었습니다.');
  };

  return (
    <section
      className={
        'flex justify-start items-center w-full max-w-3xl mx-auto border-t border-neutral-200 py-4'
      }
    >
      {/* 공유 버튼 */}
      <div>
        <button
          onClick={() => sharePost()}
          className={
            'inline-flex items-center gap-2 rounded-md border p-1 hover:bg-neutral-100 border-neutral-400'
          }
        >
          <MdIosShare />
          <span className={'text-sm'}>공유</span>
        </button>
      </div>
    </section>
  );
};

export default PostShareSection;
