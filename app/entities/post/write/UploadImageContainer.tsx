import Image from 'next/image';

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
          <li
            key={index}
            className={
              'relative rounded-md overflow-hidden w-1/3  aspect-video inline-block hover:opacity-80 cursor-pointer hover:shadow-lg group'
            }
            onClick={() => onClick(image)}
          >
            <p
              className={
                ' z-10 absolute opacity-0 group-hover:opacity-100 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-xl font-bold text-black'
              }
            >
              링크 복사
            </p>
            <Image className={'group'} src={image} alt={'dd'} fill={true} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UploadImageContainer;
