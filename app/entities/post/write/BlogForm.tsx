'use client';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import { useEffect, useState } from 'react';

import * as commands from '@uiw/react-md-editor/commands';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import LoadingIndicator from '@/app/entities/common/Loading/LoadingIndicator';
import { PostBody } from '@/app/types/Post';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

interface BlogFormProps {
  postBlog: (post: PostBody) => void;
}

const BlogForm = ({ postBlog }: BlogFormProps) => {
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const buttonStyle = `font-bold py-2 px-4 rounded mr-2 `;
  const [title, setTitle] = useState('');
  const [subTitle, setSubTitle] = useState('');
  const [content, setContent] = useState<string | undefined>('');
  const [profileImage, setProfileImage] = useState<string | StaticImport>();
  const [thumbnailImage, setThumbnailImage] = useState<string | StaticImport>();
  const [errors, setErrors] = useState<string[]>([]);

  // 필요할 때 객체로 조합
  const postBody: PostBody = {
    title,
    subTitle,
    author: '개발자 서정우',
    content: content || '',
    profileImage,
    thumbnailImage,
  };

  const validatePost = (
    post: PostBody
  ): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // 필수 필드 검사
    if (!post.title?.trim()) {
      errors.push('제목은 필수입니다');
    }
    if (!post.content?.trim()) {
      errors.push('내용은 필수입니다');
    }

    // 길이 제한 검사
    if (post.title && post.title.length > 100) {
      errors.push('제목은 100자를 초과할 수 없습니다');
    }
    if (post.subTitle && post.subTitle.length > 200) {
      errors.push('부제목은 200자를 초과할 수 없습니다');
    }
    if (post.content && post.content.length > 50000) {
      errors.push('내용은 20000자를 초과할 수 없습니다');
    }

    // 최소 길이 검사
    if (post.title && post.title.length < 2) {
      errors.push('제목은 최소 2자 이상이어야 합니다');
    }

    if (post.content && post.content.length < 10) {
      errors.push('내용은 최소 10자 이상이어야 합니다');
    }

    setErrors(errors);
    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  const submitHandler = (post: PostBody) => {
    try {
      setSubmitLoading(true);
      const { isValid, errors } = validatePost(post);
      if (!isValid) {
        console.error('유효성 검사 실패', errors);
        return;
      }

      postBlog(post);
    } catch (e) {
      console.error('글 발행 중 오류 발생', e);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className={'px-16'}>
      <input
        type="text"
        placeholder="제목"
        className="w-full p-2 border border-gray-300 rounded mb-4 text-black font-bold"
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="소제목"
        className="w-full p-2 border border-gray-300 rounded mb-4 text-black"
        onChange={(e) => setSubTitle(e.target.value)}
      />
      <MDEditor
        value={content}
        onChange={setContent}
        height={500}
        visibleDragbar={false}
      />
      {errors && (
        <div className={'mt-2'}>
          {errors.slice(0, 3).map((error, index) => (
            <p key={index} className={'text-sm text-red-500'}>
              {error}
            </p>
          ))}
        </div>
      )}
      <div className={'w-full flex justify-center my-6'}>
        <Link
          href={'/admin'}
          className={buttonStyle + ' text-black bg-gray-200 hover:bg-red-500 '}
        >
          <button>나가기</button>
        </Link>
        <button className={buttonStyle + 'bg-blue-500 hover:bg-blue-700 '}>
          임시 저장
        </button>
        <button
          disabled={submitLoading}
          className={buttonStyle + 'bg-emerald-500  hover:bg-emerald-700 '}
          onClick={(e) => {
            e.preventDefault();
            submitHandler(postBody);
          }}
        >
          글 발행
        </button>
      </div>
    </div>
  );
};
export default BlogForm;