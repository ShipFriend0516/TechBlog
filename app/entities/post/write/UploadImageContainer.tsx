'use client';
import {
  ChangeEvent,
  Dispatch,
  DragEvent,
  SetStateAction,
  useState,
} from 'react';
import { FaImage } from 'react-icons/fa';
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
    <div className={'w-full mt-4'}>
      <div className={'flex justify-between my-1'}>
        <div>
          <span className={'text-xl font-bold text-black dark:text-white'}>
            업로드된 이미지
          </span>
          {isUploading ? (
            <p
              className={'text-sm text-emerald-600 font-semibold animate-pulse'}
            >
              업로드 중... ({uploadProgress.current}/{uploadProgress.total})
            </p>
          ) : (
            <p className={'text-gray-600 dark:text-gray-400'}>
              클릭하여 링크 복사
            </p>
          )}
        </div>
        <div
          className={
            'cursor-pointer relative w-12 h-12 bg-emerald-500  rounded-md overflow-hidden'
          }
        >
          <FaImage
            className={
              'absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none'
            }
          />
          <input
            type={'file'}
            multiple={true}
            placeholder={'이미지 업로드'}
            onChange={uploadToBlob}
            className={
              'w-full h-full file:hidden text-transparent  px-2 hover:bg-emerald-600'
            }
            accept={'image/*'}
            disabled={isUploading}
          ></input>
        </div>
      </div>

      <ul
        className={`w-full border border-gray-400 px-4 py-4 whitespace-nowrap space-x-4 overflow-x-scroll gap-2 min-h-40 transition-colors ${
          isDragging
            ? 'border-primary-bangladesh border-dashed border-2'
            : 'bg-gray-100 dark:bg-gray-800'
        } ${isUploading ? 'opacity-70 pointer-events-none' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {uploadedImages.length === 0 && !isUploading && (
          <div className="pointer-events-none text-sm text-gray-500 dark:text-gray-400">
            {isDragging
              ? '떨어뜨려!!'
              : '업로드된 이미지가 없습니다. 드래그&드랍으로 이미지를 추가하세요.'}
          </div>
        )}
        {isUploading && uploadedImages.length === 0 && (
          <div className="pointer-events-none text-sm text-emerald-600 font-semibold">
            이미지를 업로드하는 중입니다...
          </div>
        )}
        {uploadedImages.map((imageUrl, index) => (
          <UploadedImage key={index} onClick={onClick} imageUrl={imageUrl} />
        ))}
      </ul>
    </div>
  );
};

export default UploadImageContainer;
