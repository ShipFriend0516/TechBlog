'use client';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import ImageZoomOverlayContainer from '@/app/entities/common/Overlay/Image/ImageZoomOverlayContainer';
import Overlay from '@/app/entities/common/Overlay/Overlay';
import PostMetadataForm from '@/app/entities/post/write/PostMetadataForm';
import PostWriteButtons from '@/app/entities/post/write/PostWriteButtons';
import UploadImageContainer from '@/app/entities/post/write/UploadImageContainer';
import CreateSeriesOverlayContainer from '@/app/entities/series/CreateSeriesOverlayContainer';
import { useBlockNavigate } from '@/app/hooks/common/useBlockNavigate';
import useOverlay from '@/app/hooks/common/useOverlay';
import usePost from '@/app/hooks/post/usePost';
import useTheme from '@/app/hooks/useTheme';
import {
  asideStyleRewrite,
  addDescriptionUnderImage,
  renderYoutubeEmbed,
  createImageClickHandler,
} from '@/app/lib/utils/rehypeUtils';
import LoadingSpinner from '../../common/Loading/LoadingSpinner';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

export interface SelectedImage {
  src: string;
  alt?: string;
}

const BlogForm = () => {
  const params = useSearchParams();
  const slug = params.get('slug');
  const isEditMode = Boolean(slug);
  const { theme } = useTheme();

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
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(
    null
  );
  const { isOpen: openImageBox, setIsOpen: setOpenImageBox } = useOverlay();

  useBlockNavigate({ title: formData.title, content: formData.content || '' });

  // 이미지 클릭 핸들러 생성
  const addImageClickHandler = createImageClickHandler(
    setSelectedImage,
    setOpenImageBox
  );

  const handleFieldChange = (
    field: string,
    value: string | boolean | string[]
  ) => {
    setFormData({ [field]: value });
  };

  return (
    <div className={'px-4'}>
      <h1 className={'text-2xl text-center mb-4'}>
        글 {slug ? '수정' : '작성'}
      </h1>
      <PostMetadataForm
        formData={formData}
        onFieldChange={handleFieldChange}
        seriesLoading={uiState.seriesLoading}
        series={seriesList}
        onClickNewSeries={() => setCreateSeriesOpen(true)}
        onClickOverwrite={overwriteDraft}
        clearDraft={clearDraftInStore}
      />
      <Overlay
        overlayOpen={createSeriesOpen}
        setOverlayOpen={setCreateSeriesOpen}
      >
        <CreateSeriesOverlayContainer
          setCreateSeriesOpen={setCreateSeriesOpen}
        />
      </Overlay>

      <Overlay
        overlayOpen={openImageBox}
        setOverlayOpen={setOpenImageBox}
        maxWidth={'5xl'}
        animate={false}
      >
        <ImageZoomOverlayContainer
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          setOpenImageBox={setOpenImageBox}
        />
      </Overlay>

      <MDEditor
        value={formData.content}
        onChange={(value) => setFormData({ content: value })}
        height={500}
        minHeight={500}
        visibleDragbar={false}
        data-color-mode={theme}
        previewOptions={{
          wrapperElement: {
            'data-color-mode': theme,
          },
          rehypeRewrite: (node, index?, parent?) => {
            asideStyleRewrite(node);
            renderYoutubeEmbed(node, index || 0, parent as Element | undefined);
            addImageClickHandler(node);
            addDescriptionUnderImage(
              node,
              index,
              parent as Element | undefined
            );
          },
        }}
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
