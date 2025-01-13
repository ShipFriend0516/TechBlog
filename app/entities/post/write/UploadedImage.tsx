import Image from 'next/image';

interface UploadedImageProps {
  onClick: (link: string) => void;
  image: string;
}

const UploadedImage = ({ onClick, image }: UploadedImageProps) => {
  return (
    <li
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
  );
};

export default UploadedImage;
