'use client';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Overlay from '@/app/entities/common/Overlay/Overlay';
import PostMetadataForm from '@/app/entities/post/write/PostMetadataForm';
import PostWriteButtons from '@/app/entities/post/write/PostWriteButtons';
import UploadImageContainer from '@/app/entities/post/write/UploadImageContainer';
import CreateSeriesOverlayContainer from '@/app/entities/series/CreateSeriesOverlayContainer';
import { useBlockNavigate } from '@/app/hooks/common/useBlockNavigate';
import usePost from '@/app/hooks/post/usePost';
import LoadingSpinner from '../../common/Loading/LoadingSpinner';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

const BlogForm = () => {
  const params = useSearchParams();
  const slug = params.get('slug');
  const isEditMode = Boolean(slug);

  const {
    formData,
    setFormData,
    uiState,
    seriesList,
    uploadedImages,
    setUploadedImages,
    overwriteDraft,
    saveToDraft,
    clearDraftInStore,
    submitHandler,
    postBody,
    handleLinkCopy,
  } = usePost(slug || '');

  const [createSeriesOpen, setCreateSeriesOpen] = useState(false);
  useBlockNavigate({ title: formData.title, content: formData.content || '' });

  return (
    <div className={'px-16'}>
      <h1 className={'text-2xl text-center mb-4'}>
        글 {slug ? '수정' : '작성'}
      </h1>
      <PostMetadataForm
        formData={formData}
        onTitleChange={(e) => setFormData({ title: e.target.value })}
        onSubTitleChange={(e) => setFormData({ subTitle: e.target.value })}
        seriesLoading={uiState.seriesLoading}
        series={seriesList}
        defaultSeries={(value) => {
          if (typeof value === 'function') {
            setFormData({ seriesId: value(formData.seriesId) });
          } else if (value !== undefined) {
            setFormData({ seriesId: value });
          }
        }}
        onClickNewSeries={() => setCreateSeriesOpen(true)}
        onClickOverwrite={overwriteDraft}
        clearDraft={clearDraftInStore}
        setTags={(tags: string[]) => setFormData({ tags })}
        onPrivateChange={(isPrivate: boolean) => setFormData({ isPrivate })}
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
        value={formData.content}
        onChange={(value) => setFormData({ content: value })}
        height={500}
        visibleDragbar={false}
      />
      <UploadImageContainer
        uploadedImages={uploadedImages}
        setUploadedImages={setUploadedImages}
        onClick={handleLinkCopy}
      />
      <ErrorBox errors={uiState.errors} />
      <PostWriteButtons
        slug={slug}
        postBody={postBody}
        submitHandler={submitHandler}
        submitLoading={uiState.submitLoading}
        saveToDraft={saveToDraft}
      />
      {isEditMode && uiState.seriesLoading && (
        <LoadingBackdrop>
          <div className="animate-slideUp w-[240px] h-[120px]  bg-white rounded-2xl flex flex-col gap-4 justify-center items-center">
            <LoadingSpinner size={24} />
            <p>수정할 글을 불러오고 있습니다.</p>
          </div>
        </LoadingBackdrop>
      )}
    </div>
  );
};

const LoadingBackdrop = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="absolute top-0 left-0 w-screen h-screen bg-black/30 flex justify-center items-center backdrop-blur-[4px]">
      {children}
    </div>
  );
};

const ErrorBox = ({ errors }: { errors: string[] | null }) => {
  if (!errors) return null;

  return (
    <div className={'mt-2'}>
      {errors.slice(0, 3).map((error, index) => (
        <p key={index} className={'text-sm text-red-500'}>
          {error}
        </p>
      ))}
    </div>
  );
};
export default BlogForm;
