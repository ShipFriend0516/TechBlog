import { FaX } from 'react-icons/fa6';
import { SelectedImage } from '@/app/entities/post/detail/PostBody';

interface ImageZoomOverlayContainerProps {
  selectedImage: SelectedImage | null;
  setSelectedImage: (image: SelectedImage | null) => void;
  setOpenImageBox: (open: boolean) => void;
}
const ImageZoomOverlayContainer = ({
  selectedImage,
  setSelectedImage,
  setOpenImageBox,
}: ImageZoomOverlayContainerProps) => {
  if (!selectedImage) return null;

  return (
    <div className={'w-full zoomBox p-2 rounded-2xl bg-black shadow-lg shadow-gray-200/20'}>
      <button
        onClick={() => {
          setSelectedImage(null);
          setOpenImageBox(false);
        }}
        className={'text-white w-full flex justify-end p-2'}
      >
        <FaX />
      </button>
      <img
        src={selectedImage.src}
        alt={'확대된 이미지'} 
        className={'rounded-none !important w-full h-auto mx-auto'}
      />
      {selectedImage.alt && <p className={'text-neutral-200 text-sm font-light text-center my-1'}>{selectedImage.alt}</p>}
    </div>
  );
};
export default ImageZoomOverlayContainer;
