'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Skeleton from '@/app/entities/common/Skeleton/Skeleton';
import { SITE_URL } from '@/app/lib/site';

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
  const absoluteUrl = href.startsWith('/') ? `${SITE_URL}${href}` : href;
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

/* ── Skeleton ─────────────────────────────────────────────────── */
const OgLinkCardSkeleton = () => (
  <div className="mb-4 flex h-[120px] overflow-hidden rounded-xl bg-surface animate-pulse">
    {/* Left text area */}
    <div className="flex flex-1 flex-col justify-between p-4">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-[14px] w-4/5" />
        <Skeleton className="h-[11px] w-full" />
      </div>
      <Skeleton className="h-[18px] w-[80px] rounded-full" />
    </div>
    {/* Right image placeholder */}
    <div className="hidden h-full w-[229px] shrink-0 bg-raised/80 sm:block" />
  </div>
);

/* ── Props ────────────────────────────────────────────────────── */
interface OgLinkCardProps {
  href: string;
}

/* ── Component ────────────────────────────────────────────────── */
const OgLinkCard = ({ href }: OgLinkCardProps) => {
  const [data, setData] = useState<OGData | null | undefined>(undefined);
  const [imgError, setImgError] = useState(false);
  const [prevHref, setPrevHref] = useState(href);

  if (href !== prevHref) {
    setPrevHref(href);
    setImgError(false);
  }

  useEffect(() => {
    fetchOGData(href).then(setData);
  }, [href]);

  /* Loading */
  if (data === undefined) return <OgLinkCardSkeleton />;

  /* No usable OG data — plain link fallback */
  if (!data || (!data.title && !data.description)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="my-4 flex items-center gap-2 break-all text-sm text-accent underline underline-offset-2 transition-opacity hover:opacity-70"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0"
        >
          <path d="M10 13a5 5 0 7.54.54l3-3a5 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0-7.54-.54l-3 3a5 7.07 7.07l1.71-1.71" />
        </svg>
        {href}
      </a>
    );
  }

  const { title, description, image, favicon, siteName, hostname } = data;
  const siteLabel = siteName || hostname || '';
  const showImage = !!image && !imgError;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={[
        'og-link-card group mb-4 flex overflow-hidden rounded-xl border transition-all duration-250',
        'border-border bg-surface',
        'hover:-translate-y-0.5 hover:shadow-lg',
        ' ',
        '',
        showImage ? 'h-[120px]' : 'min-h-[80px]',
      ].join(' ')}
    >
      {/* Left — text */}
      <div className="flex flex-1 flex-col justify-between gap-2 p-4">
        {/* Title + description */}
        <div className="flex flex-col gap-1.5 min-w-0">
          {title && (
            <p className="!mb-0 line-clamp-2 text-sm font-semibold leading-snug text-fg">
              {title}
            </p>
          )}
          {description && (
            <p className="!mb-0 line-clamp-1 text-xs leading-relaxed text-fg-muted">
              {description}
            </p>
          )}
        </div>

        {/* Footer — domain pill + external arrow */}
        <div className="flex items-center justify-between">
          {siteLabel && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-0.5 text-[11px] font-medium text-accent">
              {favicon && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={favicon}
                  alt=""
                  width={10}
                  height={10}
                  className="shrink-0 rounded-sm"
                />
              )}
              {siteLabel}
            </span>
          )}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            viewBox="0 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ml-auto shrink-0 text-fg-muted"
          >
            <path d="M7 17L17 7" />
            <path d="M7 7h10v10" />
          </svg>
        </div>
      </div>

      {/* Right — OG image (square) */}
      {showImage && (
        <div className="relative hidden h-full w-[229px] shrink-0 overflow-hidden sm:block">
          <Image
            src={image!}
            alt={title ?? ''}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
            sizes="229px"
          />
        </div>
      )}
    </a>
  );
};

export default OgLinkCard;
