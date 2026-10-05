import Image from 'next/image';
import { FiCopy } from 'react-icons/fi';

interface UploadedImageProps {
  onClick: (link: string) => void;
  imageUrl: string;
}

const UploadedImage = ({ onClick, imageUrl }: UploadedImageProps) => {
  const markdownSyntax = `![이미지](${imageUrl})`;

  return (
    <li>
      <button
        type="button"
        onClick={() => onClick(markdownSyntax)}
        aria-label="이미지 마크다운 링크 복사"
        className="group relative block aspect-video w-full overflow-hidden rounded-md bg-raised focus-visible:ring-2 focus-visible:ring-accent/60 outline-none"
      >
        <Image
          className="object-cover transition-transform duration-200 group-hover:scale-105"
          src={imageUrl}
          alt=""
          fill={true}
          sizes="(max-width: 640px) 50vw, 240px"
        />
        <span className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/50 text-sm font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          <FiCopy />
          링크 복사
        </span>
      </button>
    </li>
  );
};

export default UploadedImage;
