'use client';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ImageZoomOverlayContainer from '@/app/entities/common/Overlay/Image/ImageZoomOverlayContainer';
import Overlay from '@/app/entities/common/Overlay/Overlay';
import DraftListOverlay from '@/app/entities/post/write/DraftListOverlay';
import PostMetadataForm from '@/app/entities/post/write/PostMetadataForm';
import PostWriteButtons from '@/app/entities/post/write/PostWriteButtons';
import UploadImageContainer from '@/app/entities/post/write/UploadImageContainer';
import CreateSeriesOverlayContainer from '@/app/entities/series/CreateSeriesOverlayContainer';
import { useBlockNavigate } from '@/app/hooks/common/useBlockNavigate';
import useOverlay from '@/app/hooks/common/useOverlay';
import useAutoSync from '@/app/hooks/post/useAutoSync';
import useCloudDraft from '@/app/hooks/post/useCloudDraft';
import useDraft from '@/app/hooks/post/useDraft';
import usePost from '@/app/hooks/post/usePost';
import useTheme from '@/app/hooks/useTheme';
import useToast from '@/app/hooks/useToast';
import {
  asideStyleRewrite,
  addDescriptionUnderImage,
  renderYoutubeEmbed,
  createImageClickHandler,
} from '@/app/lib/utils/rehypeUtils';
import { CloudDraft, DraftListItem, LocalDraft } from '@/app/types/Draft';
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
  const toast = useToast();

  const {
    formData,
    setFormData,
    uiState,
    seriesList,
    uploadedImages,
    setUploadedImages,
    saveToDraft,
    submitHandler,
    postBody,
    handleLinkCopy,
  } = usePost(slug || '');

  // 로컬 임시저장 훅
  const { draft, draftImages, clearDraft } = useDraft();

  // 클라우드 임시저장 훅
  const {
    cloudDrafts,
    loading: cloudLoading,
    autoSyncEnabled,
    fetchCloudDrafts,
    saveToCloud,
    deleteCloudDraft,
    toggleAutoSync,
    getCurrentDraftId,
  } = useCloudDraft();

  const [createSeriesOpen, setCreateSeriesOpen] = useState(false);
  const [draftListOpen, setDraftListOpen] = useState(false);
  const [draftListMode, setDraftListMode] = useState<'load' | 'delete'>('load');
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(
    null
  );
  const { isOpen: openImageBox, setIsOpen: setOpenImageBox } = useOverlay();

  // 클라우드 임시저장본 조회
  useEffect(() => {
    fetchCloudDrafts().catch((error) => {
      console.error('Failed to fetch cloud drafts:', error);
    });
  }, []);

  // 자동 동기화 설정
  useAutoSync({
    enabled: autoSyncEnabled,
    intervalMs: 180000, // 3분
    onSync: handleSaveToCloud,
    deps: [formData.title, formData.content, formData.subTitle, formData.tags],
  });

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

  // 로컬 + 클라우드 임시저장본 병합
  const getAllDrafts = (): DraftListItem[] => {
    const drafts: DraftListItem[] = [];

    // 로컬 임시저장본 추가
    if (draft) {
      drafts.push({
        id: 'local',
        title: draft.title || '',
        date: new Date(), // 로컬은 타임스탬프가 없음
        source: 'local',
        data: draft as LocalDraft,
      });
    }

    // 클라우드 임시저장본 추가
    cloudDrafts.forEach((cd) => {
      drafts.push({
        id: cd.draftId,
        title: cd.title,
        date: new Date(cd.updatedAt),
        source: 'cloud',
        data: cd as CloudDraft,
      });
    });

    // 최신순 정렬
    return drafts.sort((a, b) => b.date.getTime() - a.date.getTime());
  };

  // 클라우드에 저장
  async function handleSaveToCloud() {
    try {
      await saveToCloud({
        title: formData.title,
        subTitle: formData.subTitle,
        content: formData.content || '',
        tags: formData.tags,
        imageUrls: uploadedImages,
        seriesId: formData.seriesId,
        isPrivate: formData.isPrivate,
      });
      await fetchCloudDrafts();
      toast.success('클라우드에 저장되었습니다.');
    } catch (error) {
      toast.error('클라우드 저장 실패');
    }
  }

  // 임시저장본 불러오기
  const handleLoadDraft = (draft: DraftListItem) => {
    const data = draft.data;

    if (draft.source === 'local') {
      const localData = data as LocalDraft;
      setFormData({
        title: localData.title || '',
        subTitle: localData.subTitle || '',
        content: localData.content,
        seriesId: localData.seriesId || '',
        tags: localData.tags || [],
        isPrivate: localData.isPrivate || false,
      });
      setUploadedImages(draftImages || []);
    } else {
      const cloudData = data as CloudDraft;
      setFormData({
        title: cloudData.title || '',
        subTitle: cloudData.subTitle || '',
        content: cloudData.content,
        seriesId: cloudData.seriesId || '',
        tags: cloudData.tags || [],
        isPrivate: cloudData.isPrivate || false,
      });
      setUploadedImages(cloudData.imageUrls || []);
    }

    setDraftListOpen(false);
    toast.success('임시저장본을 불러왔습니다.');
  };

  // 임시저장본 삭제
  const handleDeleteDraft = async (
    draftId: string,
    source: 'local' | 'cloud'
  ) => {
    try {
      if (source === 'local') {
        clearDraft();
      } else {
        await deleteCloudDraft(draftId);
      }
      toast.success('임시저장이 삭제되었습니다.');
    } catch (error) {
      toast.error('삭제 실패');
    }
  };

  // 임시저장본 불러오기 오버레이 열기
  const openLoadDraftOverlay = () => {
    setDraftListMode('load');
    setDraftListOpen(true);
  };

  // 임시저장 삭제 오버레이 열기
  const openDeleteDraftOverlay = () => {
    setDraftListMode('delete');
    setDraftListOpen(true);
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
        onClickOverwrite={openLoadDraftOverlay}
        clearDraft={openDeleteDraftOverlay}
        autoSyncEnabled={autoSyncEnabled}
        onToggleAutoSync={toggleAutoSync}
      />
      <Overlay
        overlayOpen={createSeriesOpen}
        setOverlayOpen={setCreateSeriesOpen}
      >
        <CreateSeriesOverlayContainer
          setCreateSeriesOpen={setCreateSeriesOpen}
        />
      </Overlay>

      {/* Draft List Overlay */}
      <Overlay overlayOpen={draftListOpen} setOverlayOpen={setDraftListOpen}>
        <DraftListOverlay
          drafts={getAllDrafts()}
          onLoadDraft={handleLoadDraft}
          onDeleteDraft={
            draftListMode === 'delete' ? handleDeleteDraft : undefined
          }
          mode={draftListMode}
          currentDraftId={getCurrentDraftId()}
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
        saveToCloud={handleSaveToCloud}
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
