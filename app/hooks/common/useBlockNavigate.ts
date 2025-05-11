import { useEffect, useState } from 'react';

interface PostForm {
  title: string;
  content: string;
}

export const useBlockNavigate = (formData: PostForm, alertMessage?: string) => {
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (formData.title || formData.content) {
      setIsDirty(true);
    }
  }, [formData]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        const message = alertMessage || '변경사항이 적용되지 않을 수 있습니다.';
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty]);
};
