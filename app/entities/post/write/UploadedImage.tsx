import Image from 'next/image';

interface UploadedImageProps {
  onClick: (link: string) => void;
  imageUrl: string;
}

const UploadedImage = ({ onClick, imageUrl }: UploadedImageProps) => {
  const markdownSyntax = `![이미지](${imageUrl})`;

  const handleClick = () => {
    onClick(markdownSyntax);
  };

  return (
    <li
      className={
        'relative rounded-md overflow-hidden max-w-[240px] w-full h-full aspect-video inline-block hover:opacity-80 cursor-pointer hover:shadow-lg group'
      }
      onClick={handleClick}
    >
      <p
        className={
          ' z-10 absolute opacity-0 group-hover:opacity-100 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-xl font-bold text-black'
        }
      >
        링크 복사
      </p>
      <Image
        className={'group object-cover'}
        src={imageUrl}
        alt={'이미지'}
        fill={true}
        sizes={'240px'}
      />
    </li>
  );
};

export default UploadedImage;
