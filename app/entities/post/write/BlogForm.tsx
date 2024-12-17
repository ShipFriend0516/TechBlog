'use client';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import { useEffect, useState } from 'react';

import * as commands from '@uiw/react-md-editor/commands';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import LoadingIndicator from '@/app/entities/common/Loading/LoadingIndicator';
import { PostBody } from '@/app/types/Post';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

interface BlogFormProps {
  onSubmit: (post: PostBody) => void;
}

const BlogForm = ({ onSubmit }: BlogFormProps) => {
  const [value, setValue] = useState<string | undefined>('');
  const [editorLoading, setEditorLoading] = useState<boolean>(true);
  const buttonStyle = `font-bold py-2 px-4 rounded mr-2 `;
  const [post, setPost] = useState<PostBody>();

  return (
    <div className={'px-16'}>
      <input
        type="text"
        placeholder="제목"
        className="w-full p-2 border border-gray-300 rounded mb-4 text-black"
      />
      <input
        type="text"
        placeholder="소제목"
        className="w-full p-2 border border-gray-300 rounded mb-4 text-black"
      />
      <MDEditor
        value={value}
        onChange={setValue}
        height={500}
        onHeightChange={() => setEditorLoading(false)}
        visibleDragbar={false}
      />
      <div className={'w-full flex justify-center mt-4'}>
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
          className={buttonStyle + 'bg-emerald-500  hover:bg-emerald-700 '}
          onClick={() => onSubmit()}
        >
          글 발행
        </button>
      </div>
    </div>
  );
};
export default BlogForm;
