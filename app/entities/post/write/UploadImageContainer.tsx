import Image from 'next/image';
import UploadedImage from '@/app/entities/post/write/UploadedImage';

interface UploadImageContainerProps {
  uploadedImages: string[];
  onClick: (link: string) => void;
}
const UploadImageContainer = ({
  uploadedImages,
  onClick,
}: UploadImageContainerProps) => {
  return (
    <div className={'w-full mt-4'}>
      <div className={'flex justify-between my-1'}>
        <div>
          <span className={'text-xl font-bold'}>업로드된 이미지</span>
          <p>클릭하여 링크 복사</p>
        </div>
        <button
          className={'bg-emerald-500 rounded-md px-2 hover:bg-emerald-600'}
        >
          이미지 업로드
        </button>
      </div>

      <ul
        className={
          'w-full border-t border-b px-4 py-4 bg-gray-100 whitespace-nowrap space-x-4 overflow-x-scroll gap-2'
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
