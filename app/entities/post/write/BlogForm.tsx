'use client';
import type { Element as HastElement, Root, RootContent } from 'hast';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FiInbox, FiTrash2 } from 'react-icons/fi';
import AdminPageHeader from '@/app/entities/admin/common/AdminPageHeader';
import ImageZoomViewer from '@/app/entities/common/Overlay/Image/ImageZoomViewer';
import Overlay from '@/app/entities/common/Overlay/Overlay';
import Callout from '@/app/entities/post/detail/Callout';
import AutoSyncToggle from '@/app/entities/post/write/AutoSyncToggle';
import DraftListOverlay from '@/app/entities/post/write/DraftListOverlay';
import PostMetadataForm from '@/app/entities/post/write/PostMetadataForm';
import PostTitleFields from '@/app/entities/post/write/PostTitleFields';
import PostWriteButtons from '@/app/entities/post/write/PostWriteButtons';
import UploadImageContainer from '@/app/entities/post/write/UploadImageContainer';
import CreateSeriesOverlayContainer from '@/app/entities/series/CreateSeriesOverlayContainer';
import { useBlockNavigate } from '@/app/hooks/common/useBlockNavigate';
import useAutoSync from '@/app/hooks/post/useAutoSync';
import useCloudDraft from '@/app/hooks/post/useCloudDraft';
import useDraft from '@/app/hooks/post/useDraft';
import { usePasteImageUpload } from '@/app/hooks/post/usePasteImageUpload';
import usePost from '@/app/hooks/post/usePost';
import useTheme from '@/app/hooks/useTheme';
import useToast from '@/app/hooks/useToast';
import {
  asideToCallout,
  addDescriptionUnderImage,
  renderYoutubeEmbed,
  createImageClickHandler,
} from '@/app/lib/utils/rehypeUtils';
import { CloudDraft, DraftListItem, LocalDraft } from '@/app/types/Draft';
import { commands, ICommand, MDEditorProps } from '@uiw/react-md-editor';
import LoadingSpinner from '../../common/Loading/LoadingSpinner';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

const calloutCommand: ICommand = {
  name: 'callout',
  keyCommand: 'callout',
  buttonProps: { 'aria-label': 'Callout 삽입', title: 'Callout 삽입' },
  icon: <span style={{ fontSize: '14px' }}>📢</span>,
  execute: (state, api) => {
    const selected = state.selectedText || '내용을 입력하세요';
    api.replaceSelection(`<callout emoji="💡">${selected}</callout>`);
  },
};

const editorExtraCommands = [
  calloutCommand,
  commands.divider,
  ...commands.getExtraCommands(),
];

const CalloutComponent = ({
  emoji,
  children,
}: {
  emoji?: string;
  children?: React.ReactNode;
}) => <Callout emoji={emoji}>{children}</Callout>;

interface SelectedImage {
  src: string;
  alt?: string;
  rect: DOMRect;
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
  const { containerRef } = usePasteImageUpload({
    content: formData.content || '',
    setFormData,
    setUploadedImages,
    toast,
  });

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

  const addImageClickHandler = useMemo(
    () => createImageClickHandler(setSelectedImage),
    []
  );

  const handleContentChange = useCallback((value: string | undefined) => {
    setFormData({ content: value });
  }, [setFormData]);

  const editorPreviewOptions = useMemo(() => ({
    wrapperElement: { 'data-color-mode': theme },
    components: {
      callout: CalloutComponent,
    } as unknown as NonNullable<MDEditorProps['previewOptions']>['components'],
    rehypeRewrite: (
      node: Root | RootContent,
      index?: number,
      parent?: Root | HastElement
    ) => {
      asideToCallout(node);
      renderYoutubeEmbed(node, index || 0, parent as HastElement | undefined);
      addImageClickHandler(node);
      addDescriptionUnderImage(node, index, parent as HastElement | undefined);
    },
  }), [theme, addImageClickHandler]);

  const handleFieldChange = useCallback((
    field: string,
    value: string | boolean | string[]
  ) => {
    setFormData({ [field]: value });
  }, [setFormData]);

  const metadataFormData = useMemo(() => ({
    slug: formData.slug,
    seriesId: formData.seriesId,
    tags: formData.tags,
    isPrivate: formData.isPrivate,
    sendToSubscribers: formData.sendToSubscribers,
  }), [formData.slug, formData.seriesId, formData.tags, formData.isPrivate, formData.sendToSubscribers]);

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
    } catch {
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
        slug: '',
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
        slug: '',
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
    } catch {
      toast.error('삭제 실패');
    }
  };

  const handleOpenCreateSeries = useCallback(() => setCreateSeriesOpen(true), []);

  const openLoadDraftOverlay = useCallback(() => {
    setDraftListMode('load');
    setDraftListOpen(true);
  }, []);

  const openDeleteDraftOverlay = useCallback(() => {
    setDraftListMode('delete');
    setDraftListOpen(true);
  }, []);

  return (
    <div>
      <AdminPageHeader
        hideTitle
        title={isEditMode ? '글 수정' : '새 글 작성'}
        actions={
          <>
            <AutoSyncToggle
              enabled={autoSyncEnabled}
              onToggle={toggleAutoSync}
            />
            <button
              type="button"
              onClick={openLoadDraftOverlay}
              className={headerButtonStyle}
            >
              <FiInbox />
              임시저장본
            </button>
            <button
              type="button"
              onClick={openDeleteDraftOverlay}
              aria-label="임시저장 삭제"
              title="임시저장 삭제"
              className={`${headerButtonStyle} hover:text-danger`}
            >
              <FiTrash2 />
            </button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-4">
          <PostTitleFields
            title={formData.title}
            subTitle={formData.subTitle}
            onFieldChange={handleFieldChange}
          />
          <div ref={containerRef} className="overflow-hidden rounded-xl border">
            <MDEditor
              value={formData.content}
              onChange={handleContentChange}
              extraCommands={editorExtraCommands}
              height={640}
              minHeight={500}
              visibleDragbar={false}
              data-color-mode={theme}
              previewOptions={editorPreviewOptions}
            />
          </div>
          <UploadImageContainer
            uploadedImages={uploadedImages}
            setUploadedImages={setUploadedImages}
            onClick={handleLinkCopy}
          />
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <PostMetadataForm
            formData={metadataFormData}
            onFieldChange={handleFieldChange}
            seriesLoading={uiState.seriesLoading}
            series={seriesList}
            onClickNewSeries={handleOpenCreateSeries}
            isEditMode={isEditMode}
          />
        </aside>
      </div>

      <PostWriteButtons
        slug={slug}
        postBody={postBody}
        submitHandler={submitHandler}
        submitLoading={uiState.submitLoading}
        saveToDraft={saveToDraft}
        saveToCloud={handleSaveToCloud}
        errors={uiState.errors}
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

      <ImageZoomViewer
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
      />

      {isEditMode && uiState.seriesLoading && (
        <LoadingBackdrop>
          <div className="animate-slideUp w-[240px] h-[120px] bg-surface rounded-2xl flex flex-col gap-4 justify-center items-center">
            <LoadingSpinner size={24} />
            <p>수정할 글을 불러오고 있습니다.</p>
          </div>
        </LoadingBackdrop>
      )}
    </div>
  );
};

const headerButtonStyle =
  'inline-flex items-center gap-1.5 rounded-lg bg-raised px-3 py-2 text-sm font-medium text-fg-soft hover:text-fg transition-colors';

const LoadingBackdrop = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex justify-center items-center backdrop-blur-[4px]">
      {children}
    </div>
  );
};

export default BlogForm;
