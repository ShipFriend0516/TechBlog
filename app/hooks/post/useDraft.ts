import useDraftStore from '@/app/stores/post/useDraftStore';
import { Post } from '@/app/types/Post';

const useDraft = () => {
  const { draft, uploadedImages, setDraft } = useDraftStore();

  const updateDraft = (newDraft: Partial<Post>, uploadedImages?: string[]) => {
    if (validateDraft(newDraft)) {
      setDraft(newDraft, uploadedImages);

      return {
        success: true,
      };
    } else {
      return {
        success: false,
      };
    }
  };

  const clearDraft = () => {
    setDraft(null);
  };

  const validateDraft = (newDraft: Partial<Post>) => {
    if (!newDraft) return false;
    const { title, content } = newDraft;
    return title || content;
  };

  return {
    draft,
    draftImages: uploadedImages,
    updateDraft,
    clearDraft,
    validateDraft,
  };
};

export default useDraft;
