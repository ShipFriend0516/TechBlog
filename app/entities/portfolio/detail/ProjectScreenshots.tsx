import { IoMdArrowDropleft, IoMdArrowDropright } from 'react-icons/io';
import Image from 'next/image';

interface ProjectScreenshotsProps {
  handlePreviousImage: () => void;
  handleNextImage: () => void;
  images: string[];
  currentImageIndex: number;
  selectThumbnail: (index: number) => void;
}

const ProjectScreenshots = ({
  handlePreviousImage,
  handleNextImage,
  images,
  currentImageIndex,
  selectThumbnail,
}: ProjectScreenshotsProps) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">프로젝트 스크린샷</h2>
        <div className="flex gap-2">
          <button
            onClick={handlePreviousImage}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors "
            aria-label="이전 썸네일"
          >
            <IoMdArrowDropleft size={18} />
          </button>
          <button
            onClick={handleNextImage}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
            aria-label="다음 썸네일"
          >
            <IoMdArrowDropright size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className={`relative h-24 bg-gray-100 rounded cursor-pointer overflow-hidden transition-all ${currentImageIndex === index ? 'ring-2 ring-emerald-500 ring-offset-2' : 'hover:opacity-80'}`}
            onClick={() => selectThumbnail(index)}
          >
            <Image
              src={image}
              alt={`Thumbnail ${index + 1}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
export default ProjectScreenshots;
