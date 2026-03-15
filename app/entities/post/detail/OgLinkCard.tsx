'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Skeleton from '@/app/entities/common/Skeleton/Skeleton';

interface OGData {
  url: string;
  title: string | null;
  description: string | null;
  image: string | null;
  siteName: string | null;
  favicon: string | null;
  hostname: string;
}

const fetchOGData = async (href: string): Promise<OGData | null> => {
  const baseUrl =
    process.env.NEXT_PUBLIC_DEPLOYMENT_URL || process.env.NEXT_PUBLIC_URL || '';
  const absoluteUrl = href.startsWith('/') ? `${baseUrl}${href}` : href;
  try {
    const res = await fetch(
      `/api/opengraph?url=${encodeURIComponent(absoluteUrl)}`
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
};

const OgLinkCardSkeleton = () => (
  <div className="border-border bg-card mb-4 flex h-[112px] overflow-hidden rounded-xl border animate-pulse">
    <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 px-4">
      <div className="flex items-center gap-1.5">
        <Skeleton className="h-3.5 w-3.5" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </div>
    <div
      className="relative hidden shrink-0 rounded-r-xl bg-gray-200/80 dark:bg-neutral-700/80 sm:block"
      style={{ width: '160px' }}
    />
  </div>
);

interface OgLinkCardProps {
  href: string;
}

const OgLinkCard = ({ href }: OgLinkCardProps) => {
  const [data, setData] = useState<OGData | null | undefined>(undefined);

  useEffect(() => {
    fetchOGData(href).then(setData);
  }, [href]);

  if (data === undefined) return <OgLinkCardSkeleton />;

  if (!data || (!data.title && !data.description)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent decoration-accent/30 hover:text-accent/80 my-4 block break-all underline underline-offset-2 transition-colors"
      >
        {href}
      </a>
    );
  }

  const { title, description, image, favicon, siteName, hostname } = data;
  const siteLabel = siteName || hostname || '';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="border-border dark:border-neutral-800/50 bg-white dark:bg-neutral-800 hover:border-white/90 hover:bg-neutral-800/10 mb-4 flex h-[112px] overflow-hidden rounded-xl border transition-colors"
    >
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 px-4 py-3">
        <div className="flex h-4 items-center gap-1.5">
          {favicon && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={favicon}
              alt=""
              width={14}
              height={14}
              className="shrink-0 rounded-sm"
            />
          )}
          <span className="!text-muted-foreground truncate text-xs">
            {siteLabel}
          </span>
        </div>
        {title && (
          <p className="!text-foreground !mb-0 line-clamp-1 text-sm font-semibold leading-snug">
            {title}
          </p>
        )}
        {description && (
          <p className="!text-muted-foreground !mb-0 line-clamp-2 text-xs leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {image && (
        <div
          className="relative hidden h-full shrink-0 sm:block !m-0"
          style={{ width: '160px' }}
        >
          <Image
            width={160}
            height={112}
            src={image}
            alt={title ?? ''}
            className="!h-full !w-full !max-w-none !m-0 !rounded-none object-cover"
          />
        </div>
      )}
    </a>
  );
};

export default OgLinkCard;
