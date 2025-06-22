'use client';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import useToast from '@/app/hooks/useToast';
import { useBlockNavigate } from '@/app/hooks/common/useBlockNavigate';
import { useRouter, useSearchParams } from 'next/navigation';
import PostWriteButtons from '@/app/entities/post/write/PostWriteButtons';
import Overlay from '@/app/entities/common/Overlay/Overlay';
import CreateSeriesOverlayContainer from '@/app/entities/series/CreateSeriesOverlayContainer';
import UploadImageContainer from '@/app/entities/post/write/UploadImageContainer';
import PostMetadataForm from '@/app/entities/post/write/PostMetadataForm';
import usePost from '@/app/hooks/post/usePost';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

const BlogForm = () => {
  const params = useSearchParams();
  const slug = params.get('slug');

  const {
    title,
    subTitle,
    submitLoading,
    seriesLoading,
    seriesId,
    seriesList,
    content,
    setTitle,
    setSubTitle,
    setContent,
    setSeriesId,
    setIsPrivate,
    isPrivate,
    tags,
    setTags,
    uploadedImages,
    setUploadedImages,
    overwriteDraft,
    saveToDraft,
    clearDraftInStore,
    submitHandler,
    postBody,
    errors,
    handleLinkCopy,
  } = usePost(slug || '');

  const [createSeriesOpen, setCreateSeriesOpen] = useState(false);
  useBlockNavigate({ title, content: content || '' });

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
        isPrivate={isPrivate}
        onPrivateChange={(isPrivate) => setIsPrivate(isPrivate)}
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
