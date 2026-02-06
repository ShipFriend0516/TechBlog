import { useEffect, useRef, useState } from 'react';
import { uploadImageFile } from '@/app/lib/utils/imageUpload';

interface UsePasteImageUploadProps {
  content: string;
  setFormData: (updates: { content?: string }) => void;
  setUploadedImages: React.Dispatch<React.SetStateAction<string[]>>;
  toast: {
    success: (message: string) => void;
    error: (message: string) => void;
  };
}

interface UploadProgress {
  current: number;
  total: number;
}

export function usePasteImageUpload({
  content,
  setFormData,
  setUploadedImages,
  toast,
}: UsePasteImageUploadProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    current: 0,
    total: 0,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      // 이미지가 복사되었는지 확인
      const imageItems = Array.from(items).filter((item) =>
        item.type.startsWith('image/')
      );

      if (imageItems.length === 0) return;

      e.preventDefault();

      const textarea = container.querySelector('textarea');
      const cursorPosition = textarea?.selectionStart ?? content.length;

      setIsUploading(true);
      setUploadProgress({ current: 0, total: imageItems.length });

      const uploadedUrls: string[] = [];

      // 이미지 업로드
      for (let i = 0; i < imageItems.length; i++) {
        try {
          const file = imageItems[i].getAsFile();
          if (!file) continue;

          toast.success(
            `이미지를 업로드하는 중입니다... (${i + 1}/${imageItems.length})`
          );

          const url = await uploadImageFile(file);
          uploadedUrls.push(url);

          setUploadProgress({ current: i + 1, total: imageItems.length });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : '알 수 없는 오류';
          toast.error(`이미지 업로드 실패: ${errorMessage}`);
        }
      }

      // 업로드된 이미지 마크다운에 추가
      if (uploadedUrls.length > 0) {
        const markdownImages = uploadedUrls
          .map((url) => `![이미지](${url})`)
          .join('\n');

        const beforeCursor = content.slice(0, cursorPosition);
        const afterCursor = content.slice(cursorPosition);
        const newContent = beforeCursor + markdownImages + afterCursor;

        setFormData({ content: newContent });
        setUploadedImages((prev) => [...prev, ...uploadedUrls]);

        toast.success('이미지가 성공적으로 삽입되었습니다.');
      }

      setIsUploading(false);
      setUploadProgress({ current: 0, total: 0 });
    };

    container.addEventListener('paste', handlePaste);

    return () => {
      container.removeEventListener('paste', handlePaste);
    };
  }, [content, setFormData, setUploadedImages, toast]);

  return {
    containerRef,
    isUploading,
    uploadProgress,
  };
}
