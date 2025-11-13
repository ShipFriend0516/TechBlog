import axios from 'axios';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAllSeriesData } from '@/app/entities/series/api/series';
import useDraft from '@/app/hooks/post/useDraft';
import useToast from '@/app/hooks/useToast';
import { validatePost } from '@/app/lib/utils/validate/validate';
import { PostBody } from '@/app/types/Post';
import { Series } from '@/app/types/Series';

interface FormData {
  title: string;
  subTitle: string;
  content: string | undefined;
  seriesId: string;
  tags: string[];
  isPrivate: boolean;
}

interface UIState {
  submitLoading: boolean;
  seriesLoading: boolean;
  errors: string[];
}

const usePost = (slug = '') => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    subTitle: '',
    content: '',
    seriesId: '',
    tags: [],
    isPrivate: false,
  });

  const [uiState, setUIState] = useState<UIState>({
    submitLoading: false,
    seriesLoading: true,
    errors: [],
  });

  const [profileImage, setProfileImage] = useState<string | StaticImport>();
  const [thumbnailImage, setThumbnailImage] = useState<string | StaticImport>();
  const [seriesList, setSeriesList] = useState<Series[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const NICKNAME = '개발자 서정우';
  const toast = useToast();
  const router = useRouter();
  const { draft, draftImages, updateDraft, clearDraft } = useDraft();

  const postBody: PostBody = {
    title: formData.title,
    subTitle: formData.subTitle,
    author: NICKNAME,
    content: formData.content || '',
    profileImage,
    thumbnailImage,
    seriesId: formData.seriesId || '',
    tags: formData.tags,
    isPrivate: formData.isPrivate,
  };

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
      setFormData((prev) => ({ ...prev, seriesId: data[0]._id }));
      setUIState((prev) => ({ ...prev, seriesLoading: false }));
    } catch (e) {
      console.error('시리즈 조회 중 오류 발생', e);
    }
  };

  // Method
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
        const { title, content, subTitle, seriesId, isPrivate, tags } = draft;
        setFormData({
          title: title || '',
          subTitle: subTitle || '',
          content: content,
          seriesId: seriesId || '',
          tags: tags || [],
          isPrivate: isPrivate || false,
        });
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
      setUIState((prev) => ({ ...prev, submitLoading: true }));
      const { isValid, errors } = validatePost(post);
      setUIState((prev) => ({ ...prev, errors }));
      if (!isValid) {
        toast.error('유효성 검사 실패');
        console.error('유효성 검사 실패', errors);
        setUIState((prev) => ({ ...prev, submitLoading: false }));
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
      setUIState((prev) => ({ ...prev, submitLoading: false }));
    }
  };

  const getPostDetail = async () => {
    try {
      const response = await axios.get(`/api/posts/${slug}`);
      const data = await response.data;
      setFormData({
        title: data.post.title || '',
        subTitle: data.post.subTitle,
        content: data.post.content,
        seriesId: data.post.seriesId || '',
        tags: data.post.tags || [],
        isPrivate: data.post.isPrivate || false,
      });
    } catch (e) {
      console.error('글 조회 중 오류 발생', e);
    }
  };

  const handleLinkCopy = (image: string) => {
    navigator.clipboard.writeText(image);
    toast.success('이미지 링크가 복사되었습니다.');
  };

  // Helper functions to update form data
  const updateFormData = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  return {
    // Form data (individual values for backward compatibility)
    title: formData.title,
    subTitle: formData.subTitle,
    content: formData.content,
    seriesId: formData.seriesId,
    isPrivate: formData.isPrivate,
    tags: formData.tags,

    // Form data object
    formData,
    setFormData: updateFormData,

    // UI state
    submitLoading: uiState.submitLoading,
    seriesLoading: uiState.seriesLoading,
    errors: uiState.errors,

    uiState,
    setUIState,
    // Other state
    postBody,
    seriesList,
    uploadedImages,
    setUploadedImages,

    // Individual setters for backward compatibility
    setTitle: (title: string) => updateFormData({ title }),
    setSubTitle: (subTitle: string) => updateFormData({ subTitle }),
    setContent: (content: string | undefined) => updateFormData({ content }),
    setSeriesId: (seriesId: string) => updateFormData({ seriesId }),
    setIsPrivate: (isPrivate: boolean) => updateFormData({ isPrivate }),
    setTags: (tags: string[]) => updateFormData({ tags }),

    // Methods
    overwriteDraft,
    saveToDraft,
    clearDraftInStore,
    submitHandler,
    handleLinkCopy,
  };
};

export default usePost;
