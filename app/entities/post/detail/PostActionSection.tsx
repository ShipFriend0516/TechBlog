'use client';
import useToast from '@/app/hooks/useToast';
import { MdIosShare } from 'react-icons/md';
import { IoEye } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import useFingerprint from '@/app/hooks/useFingerprint';
import axios from 'axios';

interface PostActionSectionProps {
  postId?: string;
}

const PostActionSection = ({ postId }: PostActionSectionProps) => {
  // State
  const [viewCount, setViewCount] = useState<number>(0);
  const [likeCount, setLikeCount] = useState<number | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  const toast = useToast();
  const { fingerprint } = useFingerprint();

  const sharePost = async () => {
    const url = window.location.href;
    await navigator.clipboard.writeText(url);
    toast.success('링크가 복사되었습니다.');
  };

  // View

  const handleViewCount = async () => {
    try {
      if (!postId || !fingerprint) {
        return;
      }

      const response = await axios.post(
        '/api/posts/view',
        {
          postId,
        },
        {
          headers: {
            'X-Fingerprint': fingerprint,
          },
        }
      );

      setViewCount(response.data.viewCount);
      console.log(response);
    } catch (error) {
      console.error('조회수 증가 오류:', error);
    }
  };

  // Like

  const getLikeCount = async () => {
    try {
      if (!postId || !fingerprint) {
        return;
      }

      const response = await axios.get('/api/posts/like', {
        params: {
          postId,
        },
        headers: {
          'X-Fingerprint': fingerprint,
        },
      });

      console.log(response);
    } catch (error) {
      console.error('좋아요 수 가져오기 오류:', error);
    }
  };

  const handleLike = async () => {
    try {
      if (!postId || !fingerprint) {
        return;
      }

      const response = await axios.post(
        '/api/posts/like',
        {
          postId,
        },
        {
          headers: {
            'X-Fingerprint': fingerprint,
          },
        }
      );

      console.log(response);
    } catch (error) {
      console.error('좋아요 증가 오류:', error);
    }
  };

  const handleUnlike = async () => {
    try {
      if (!postId || !fingerprint) {
        return;
      }

      const response = await axios.delete('/api/posts/like', {
        data: {
          postId,
        },
        headers: {
          'X-Fingerprint': fingerprint,
        },
      });

      console.log(response);
    } catch (error) {
      console.error('좋아요 취소 오류:', error);
    }
  };

  useEffect(() => {
    handleViewCount();
  }, [postId, fingerprint]);

  return (
    <section
      className={
        'flex justify-between items-center w-full max-w-3xl mx-auto border-t border-neutral-200 px-4 py-4'
      }
    >
      <div className={'left-tools'}>
        <button
          title={'좋아요'}
          aria-label={'좋아요'}
          onClick={() => handleLike()}
          className={
            ' inline-flex items-center gap-2 rounded-md  p-1 hover:bg-neutral-100 border-neutral-200'
          }
        />
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
      </div>

      <div className={'right-tools'}>
        <div
          title={'조회수'}
          aria-label={'조회수'}
          className={'inline-flex items-center ml-4'}
        >
          <IoEye size={20} />
          <span className={'text-sm ml-2'}>{viewCount || 0}</span>
        </div>
      </div>
    </section>
  );
};

export default PostActionSection;
