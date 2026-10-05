'use client';
import {
  ChangeEvent,
  Dispatch,
  DragEvent,
  SetStateAction,
  useState,
} from 'react';
import { FiUpload } from 'react-icons/fi';
import UploadedImage from '@/app/entities/post/write/UploadedImage';
import { uploadImageFile } from '@/app/lib/utils/imageUpload';

interface UploadImageContainerProps {
  onClick: (link: string) => void;
  uploadedImages: string[];
  setUploadedImages: Dispatch<SetStateAction<string[]>>;
}
const UploadImageContainer = ({
  onClick,
  uploadedImages,
  setUploadedImages,
}: UploadImageContainerProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({
    current: 0,
    total: 0,
  });

  const uploadFiles = async (files: FileList) => {
    try {
      if (files.length === 0) {
        throw new Error('업로드할 파일이 없습니다.');
      }

      setIsUploading(true);
      setUploadProgress({ current: 0, total: files.length });

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) {
          throw new Error('이미지 파일만 업로드할 수 있습니다.');
        }

        setUploadProgress({ current: i + 1, total: files.length });

        const url = await uploadImageFile(file);
        setUploadedImages((prev) => [...prev, url]);
      }

      return;
    } catch (error) {
      console.error('업로드 실패:', error);
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress({ current: 0, total: 0 });
    }
  };

  const uploadToBlob = async (event: ChangeEvent) => {
    try {
      event.preventDefault();
      const target = event.target as HTMLInputElement;
      if (!target.files) {
        throw new Error('이미지가 선택되지 않았습니다.');
      }

      await uploadFiles(target.files);
    } catch (error) {
      console.error('업로드 실패:', error);
      throw error;
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await uploadFiles(files);
    }
  };

  return (
    <div className="rounded-xl border bg-surface p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-fg">
            이미지{' '}
            {uploadedImages.length > 0 && (
              <span className="text-fg-muted">{uploadedImages.length}</span>
            )}
          </h2>
          <p
            className={`text-xs ${isUploading ? 'text-accent animate-pulse' : 'text-fg-muted'}`}
          >
            {isUploading
              ? `업로드 중... (${uploadProgress.current}/${uploadProgress.total})`
              : '클릭하면 마크다운 링크가 복사됩니다. 본문에 붙여넣기해도 업로드됩니다.'}
          </p>
        </div>
        <label
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-raised px-3 py-2 text-sm font-medium text-fg hover:bg-fg/10 transition-colors ${
            isUploading ? 'pointer-events-none opacity-60' : 'cursor-pointer'
          }`}
        >
          <FiUpload />
          업로드
          <input
            type={'file'}
            multiple={true}
            onChange={uploadToBlob}
            className="sr-only"
            accept={'image/*'}
            disabled={isUploading}
          />
        </label>
      </div>

      <ul
        className={`grid min-h-28 grid-cols-2 gap-3 rounded-lg border-2 border-dashed p-3 transition-colors sm:grid-cols-3 lg:grid-cols-4 ${
          isDragging ? 'border-accent/60 bg-accent-subtle' : 'border-hairline'
        } ${isUploading ? 'opacity-70 pointer-events-none' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {uploadedImages.length === 0 && (
          <li className="pointer-events-none col-span-full flex items-center justify-center text-sm text-fg-muted">
            {isUploading
              ? '이미지를 업로드하는 중입니다...'
              : isDragging
                ? '여기에 놓으면 업로드됩니다'
                : '이미지를 끌어다 놓으세요'}
          </li>
        )}
        {uploadedImages.map((imageUrl, index) => (
          <UploadedImage key={`${index}-${imageUrl}`} onClick={onClick} imageUrl={imageUrl} />
        ))}
      </ul>
    </div>
  );
};

export default UploadImageContainer;
