'use client';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { PostBody } from '@/app/types/Post';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import axios from 'axios';
import useToast from '@/app/hooks/useToast';
import { useBlockNavigate } from '@/app/hooks/useBlockNavigate';
import { useRouter, useSearchParams } from 'next/navigation';
import PostWriteButtons from '@/app/entities/post/write/PostWriteButtons';
import { validatePost } from '@/app/lib/utils/validate/validate';
import Select from '@/app/entities/common/Select';
import { Series } from '@/app/types/Series';
import Overlay from '@/app/entities/common/Overlay/Overlay';
import { FaPlus } from 'react-icons/fa6';
import CreateSeriesOverlayContainer from '@/app/entities/series/CreateSeriesOverlayContainer';
import { getAllSeriesData } from '@/app/entities/series/api/series';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

const BlogForm = () => {
  const params = useSearchParams();
  const slug = params.get('slug');
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [title, setTitle] = useState('');
  const [subTitle, setSubTitle] = useState('');
  const [content, setContent] = useState<string | undefined>('');
  const [profileImage, setProfileImage] = useState<string | StaticImport>();
  const [thumbnailImage, setThumbnailImage] = useState<string | StaticImport>();
  const [seriesList, setSeriesList] = useState<Series[]>([]);
  const [series, setSeries] = useState<string | null>(null);

  const [errors, setErrors] = useState<string[]>([]);
  const toast = useToast();
  const router = useRouter();
  const NICKNAME = '개발자 서정우';
  const [createSeriesOpen, setCreateSeriesOpen] = useState(false);

  useBlockNavigate({ title, content: content || '' });

  useEffect(() => {
    getSeries();
  }, []);

  useEffect(() => {
    if (slug) {
      getPostDetail();
    }
  }, [slug]);

  const postBody: PostBody = {
    title,
    subTitle,
    author: NICKNAME,
    content: content || '',
    profileImage,
    thumbnailImage,
  };
  // 시리즈
  const getSeries = async () => {
    try {
      const data = await getAllSeriesData();
      setSeriesList(data);
    } catch (e) {
      console.error('시리즈 조회 중 오류 발생', e);
    }
  };

  // 블로그
  const postBlog = async (post: PostBody) => {
    try {
      const response = await axios.post('/api/posts', post);
      if (response.status === 201) {
        toast.success('글이 성공적으로 발행되었습니다.');
        router.push('/posts');
      }
    } catch (e) {
      toast.error('글 발행 중 오류 발생했습니다.');
      console.error('글 발행 중 오류 발생', e);
    }
  };

  const updatePost = async (post: PostBody) => {
    try {
      const response = await axios.put(`/api/posts/${slug}`, post);
      if (response.status === 200) {
        toast.success('글이 성공적으로 수정되었습니다.');
        router.push('/posts');
      }
    } catch (e) {
      toast.error('글 수정 중 오류 발생했습니다.');
      console.error('글 수정 중 오류 발생', e);
    }
  };

  const submitHandler = (post: PostBody) => {
    try {
      setSubmitLoading(true);
      const { isValid, errors } = validatePost(post);
      setErrors(errors);
      if (!isValid) {
        toast.error('유효성 검사 실패');
        console.error('유효성 검사 실패', errors);
        setSubmitLoading(false);
        return;
      }

      if (slug) {
        updatePost(post);
      } else {
        postBlog(post);
      }
    } catch (e) {
      console.error('글 발행 중 오류 발생', e);
      setSubmitLoading(false);
    }
  };

  const getPostDetail = async () => {
    try {
      const response = await axios.get(`/api/posts/${slug}`);
      const data = await response.data;
      setTitle(data.post.title || 'dd');
      setSubTitle(data.post.subTitle);
      setContent(data.post.content);
    } catch (e) {
      console.error('글 조회 중 오류 발생', e);
    }
  };

  return (
    <div className={'px-16'}>
      <input
        type="text"
        placeholder="제목"
        className="w-full p-2 border border-gray-300 rounded mb-4 text-black font-bold"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
      />
      <input
        type="text"
        placeholder="소제목"
        className="w-full p-2 border border-gray-300 rounded mb-4 text-black"
        onChange={(e) => setSubTitle(e.target.value)}
        value={subTitle}
      />
      <div className={'flex items-center gap-2  w-1/2 mb-4'}>
        <label
          className={'inline-flex items-center text-nowrap flex-grow gap-2'}
        >
          <span className={'font-bold'}>시리즈</span>
          <Select
            options={seriesList.map((s) => ({
              value: s.slug,
              label: s.title,
            }))}
            setValue={setSeries}
            defaultValue={seriesList[0].slug}
          />
        </label>
        <button
          onClick={() => setCreateSeriesOpen(true)}
          className={
            'inline-flex items-center gap-2 bg-green-200 text-black p-2 px-4 rounded-md hover:bg-green-300'
          }
        >
          새로운 시리즈 <FaPlus />
        </button>
      </div>
      <Overlay
        overlayOpen={createSeriesOpen}
        setOverlayOpen={setCreateSeriesOpen}
      >
        <CreateSeriesOverlayContainer
          setCreateSeriesOpen={setCreateSeriesOpen}
        />
      </Overlay>

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
      <PostWriteButtons
        slug={slug}
        postBody={postBody}
        submitHandler={submitHandler}
        submitLoading={submitLoading}
      />
    </div>
  );
};
export default BlogForm;
