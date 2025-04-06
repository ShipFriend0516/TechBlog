import useDraftStore from '@/app/stores/post/useDraftStore';
import { Post } from '@/app/types/Post';

const useDraft = () => {
  const { draft, setDraft } = useDraftStore();

  const updateDraft = (newDraft: Partial<Post>) => {
    if (validateDraft(newDraft)) {
      setDraft(newDraft);

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
  return { draft, updateDraft, clearDraft, validateDraft };
};

export default useDraft;
