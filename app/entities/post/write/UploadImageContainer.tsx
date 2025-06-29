'use client';
import UploadedImage from '@/app/entities/post/write/UploadedImage';
import { FaImage } from 'react-icons/fa';
import { upload } from '@vercel/blob/client';
import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';

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
  const uploadToBlob = async (event: ChangeEvent) => {
    try {
      event.preventDefault();
      const target = event.target as HTMLInputElement;
      if (!target.files) {
        throw new Error('이미지가 선택되지 않았습니다.');
      }

      const files = target.files;

      if (files.length === 0) {
        throw new Error('업로드할 파일이 없습니다.');
      }

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) {
          throw new Error('이미지 파일만 업로드할 수 있습니다.');
        }

        const timestamp = new Date().getTime();
        const pathname = `/images/${timestamp}-${file.name}`;
        const newBlob = await upload(pathname, file, {
          access: 'public',
          handleUploadUrl: '/api/upload',
        });

        setUploadedImages((prev) => [...prev, newBlob.url]);
      }

      return;
    } catch (error) {
      console.error('업로드 실패:', error);
      throw error;
    }
  };

  return (
    <div className={'w-full mt-4 '}>
      <div className={'flex justify-between my-1'}>
        <div>
          <span className={'text-xl font-bold'}>업로드된 이미지</span>
          <p>클릭하여 링크 복사</p>
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
          ></input>
        </div>
      </div>

      <ul
        className={
          'w-full border px-4 py-4 bg-gray-100 whitespace-nowrap space-x-4 overflow-x-scroll gap-2 min-h-40'
        }
      >
        {uploadedImages.map((image, index) => (
          <UploadedImage key={index} onClick={onClick} image={image} />
        ))}
      </ul>
    </div>
  );
};

export default UploadImageContainer;
