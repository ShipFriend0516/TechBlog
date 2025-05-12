'use client';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { PostBody } from '@/app/types/Post';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import axios from 'axios';
import useToast from '@/app/hooks/useToast';
import { useBlockNavigate } from '@/app/hooks/common/useBlockNavigate';
import { useRouter, useSearchParams } from 'next/navigation';
import PostWriteButtons from '@/app/entities/post/write/PostWriteButtons';
import { validatePost } from '@/app/lib/utils/validate/validate';
import { Series } from '@/app/types/Series';
import Overlay from '@/app/entities/common/Overlay/Overlay';
import CreateSeriesOverlayContainer from '@/app/entities/series/CreateSeriesOverlayContainer';
import { getAllSeriesData } from '@/app/entities/series/api/series';
import UploadImageContainer from '@/app/entities/post/write/UploadImageContainer';
import useDraft from '@/app/hooks/post/useDraft';
import PostMetadataForm from '@/app/entities/post/write/PostMetadataForm';

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
  const [seriesId, setSeriesId] = useState<string>();
  const [seriesLoading, setSeriesLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  const toast = useToast();
  const router = useRouter();
  const NICKNAME = '개발자 서정우';
  const [createSeriesOpen, setCreateSeriesOpen] = useState(false);
  // 임시저장 상태
  const { draft, draftImages, updateDraft, clearDraft } = useDraft();
  // 이미지 상태
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const postBody: PostBody = {
    title,
    subTitle,
    author: NICKNAME,
    content: content || '',
    profileImage,
    thumbnailImage,
    seriesId: seriesId || '',
  };

  useBlockNavigate({ title, content: content || '' });

  useEffect(() => {
    getSeries();
  }, []);

  useEffect(() => {
    if (slug) {
      getPostDetail();
    }
  }, [slug]);

  // 시리즈
  const getSeries = async () => {
    try {
      const data = await getAllSeriesData();
      setSeriesList(data);
      setSeriesId(data[0]._id);
      setSeriesLoading(false);
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

  // 임시저장 관련 함수
  const saveToDraft = () => {
    const { success } = updateDraft(postBody, uploadedImages);
    if (success) {
      toast.success('임시 저장되었습니다.');
    } else {
      toast.error('임시 저장 실패');
    }
  };

  const overwriteDraft = () => {
    if (draft !== null) {
      if (confirm('임시 저장된 글이 있습니다. 덮어쓰시겠습니까?')) {
        const { title, content, subTitle, seriesId } = draft;
        setTitle(title || '');
        setContent(content);
        setSubTitle(subTitle || '');
        setSeriesId(seriesId);
        setUploadedImages(draftImages || []);
      }
    } else {
      toast.error('임시 저장된 글이 없습니다.');
    }
  };

  const clearDraftInStore = () => {
    clearDraft();
    toast.success('임시 저장이 삭제되었습니다.');
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
      clearDraft();
    } catch (e) {
      console.error('글 발행 중 오류 발생', e);
      setSubmitLoading(false);
    }
  };

  const getPostDetail = async () => {
    try {
      const response = await axios.get(`/api/posts/${slug}`);
      const data = await response.data;
      setTitle(data.post.title || '');
      setSubTitle(data.post.subTitle);
      setContent(data.post.content);
      setSeriesId(data.post.seriesId || '');
    } catch (e) {
      console.error('글 조회 중 오류 발생', e);
    }
  };

  const handleLinkCopy = (image: string) => {
    navigator.clipboard.writeText(image);
    toast.success('이미지 링크가 복사되었습니다.');
  };

  return (
    <div className={'px-16'}>
      <PostMetadataForm
        onTitleChange={(e) => setTitle(e.target.value)}
        title={title}
        onSubTitleChange={(e) => setSubTitle(e.target.value)}
        subTitle={subTitle}
        seriesLoading={seriesLoading}
        series={seriesList}
        callbackfn={(s) => ({
          value: s._id,
          label: s.title,
        })}
        defaultSeries={setSeriesId}
        seriesId={seriesId}
        onClickNewSeries={() => setCreateSeriesOpen(true)}
        onClickOverwrite={overwriteDraft}
        clearDraft={clearDraftInStore}
        tags={tags}
        setTags={setTags}
      />
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
      <UploadImageContainer
        uploadedImages={uploadedImages}
        setUploadedImages={setUploadedImages}
        onClick={handleLinkCopy}
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
        saveToDraft={saveToDraft}
      />
    </div>
  );
};
export default BlogForm;
