import Image from 'next/image';
import { FaX } from 'react-icons/fa6';

interface ImageZoomOverlayContainerProps {
  selectedImage: string | null;
  setSelectedImage: (image: string | null) => void;
  setOpenImageBox: (open: boolean) => void;
}
const ImageZoomOverlayContainer = ({
  selectedImage,
  setSelectedImage,
  setOpenImageBox,
}: ImageZoomOverlayContainerProps) => {
  if (!selectedImage) return null;

  return (
    <div className={'zoomBox p-4 bg-white'}>
      <button
        onClick={() => {
          setSelectedImage(null);
          setOpenImageBox(false);
        }}
        className={'text-black w-full flex justify-end'}
      >
        <FaX />
      </button>
      <Image
        src={selectedImage}
        alt={'확대된 이미지'}
        width={800}
        height={600}
        className={'rounded-none !important max-w-full max-h-[80vh]'}
      />
    </div>
  );
};
export default ImageZoomOverlayContainer;
