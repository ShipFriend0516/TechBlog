import Image from 'next/image';
import { FiLayers } from 'react-icons/fi';

interface SeriesThumbnailProps {
  src?: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}

// 썸네일이 없으면 디자인 시스템 규칙대로 nebula 그라디언트를 깐다
const SeriesThumbnail = ({
  src,
  alt,
  sizes,
  priority = false,
  className = '',
}: SeriesThumbnailProps) => (
  <div
    className={`relative overflow-hidden bg-gradient-to-br from-nebula-subtle via-raised to-accent-subtle ${className}`}
  >
    {src ? (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover transition-transform duration-500 ease-out-expo group-hover:scale-[1.03]"
      />
    ) : (
      <FiLayers
        aria-hidden
        className="absolute inset-0 m-auto h-8 w-8 text-nebula-soft opacity-60"
      />
    )}
  </div>
);

export default SeriesThumbnail;
