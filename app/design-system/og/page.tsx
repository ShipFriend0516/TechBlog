import type { Metadata } from 'next';
import { OG_VARIANTS, SELECTED_OG_VARIANT } from '@/app/lib/og/variants';

export const metadata: Metadata = {
  title: 'OG Image Variants | ShipFriend TechBlog',
  robots: { index: false, follow: false },
};

const SAMPLE_POST = new URLSearchParams({
  title: 'Next.js 16 마이그레이션 회고: Turbopack 기본 전환과 proxy.ts 변경점',
  description:
    'Turbopack 기본 전환과 proxy.ts 변경점에서 마주친 문제들을 정리했습니다.',
}).toString();

export default function OgVariantsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 pt-24 pb-24">
      <header className="pb-10">
        <p className="text-xs tracking-[0.2em] uppercase text-fg-muted">
          ShipFriend · Open Graph
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">OG 이미지 시안</h1>
        <p className="mt-3 text-fg-soft">
          왼쪽은 사이트 기본, 오른쪽은 긴 글 제목 예시입니다. 확정은{' '}
          <code className="text-accent">SELECTED_OG_VARIANT</code> 값으로 합니다.
        </p>
      </header>

      <div className="flex flex-col gap-16">
        {OG_VARIANTS.map((variant) => (
          <section key={variant.id}>
            <div className="mb-4 flex flex-wrap items-baseline gap-3">
              <h2 className="text-xl font-semibold">{variant.name}</h2>
              <code className="text-xs text-fg-faint">{variant.id}</code>
              {variant.id === SELECTED_OG_VARIANT && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-subtle text-accent">
                  현재 적용
                </span>
              )}
              <p className="w-full text-sm text-fg-muted">{variant.summary}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {['', `?${SAMPLE_POST}`].map((query) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={query}
                  src={`/design-system/og/${variant.id}${query}`}
                  alt={`${variant.name} 미리보기`}
                  width={1200}
                  height={630}
                  className="w-full h-auto rounded-xl bg-surface"
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
