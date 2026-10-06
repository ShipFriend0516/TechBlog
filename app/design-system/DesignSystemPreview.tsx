'use client';

import Link from 'next/link';
import { ReactNode, useState } from 'react';
import TypingText from '@/app/entities/common/Typography/TypingText';
import useTheme from '@/app/hooks/useTheme';
import styles from './design-system.module.css';

type Theme = 'dark' | 'light';

const SURFACE_TOKENS = [
  { name: 'bg', desc: '페이지 배경' },
  { name: 'surface', desc: '카드, 섹션' },
  { name: 'raised', desc: '호버, 입력창, 코드' },
  { name: 'overlay', desc: '모달, 드롭다운' },
];

const TEXT_TOKENS = [
  { name: 'fg', desc: '본문, 제목' },
  { name: 'fg-soft', desc: '부제목, 보조' },
  { name: 'fg-muted', desc: '날짜, 메타' },
  { name: 'fg-faint', desc: '비활성, placeholder' },
];

const ACCENT_TOKENS = [
  { name: 'accent', desc: '링크, 버튼, 강조' },
  { name: 'accent-strong', desc: '호버, 포커스' },
  { name: 'accent-subtle', desc: '태그, 선택 상태' },
  { name: 'hairline', desc: '표, 구분선 (최소 사용)' },
];

// 디자인 시스템 하위 실험 페이지
const LAB_PAGES = [
  {
    href: '/design-system/logo',
    name: 'Logo Lab',
    desc: '로고 시안 비교',
  },
  {
    href: '/design-system/not-found',
    name: '404 Lab',
    desc: '불시착 404 애니메이션 시안',
  },
];

const NEBULA_TOKENS = [
  { name: 'nebula', desc: '일러스트, 장식 포인트' },
  { name: 'nebula-soft', desc: '그라디언트 하이라이트' },
  { name: 'nebula-subtle', desc: '히어로, 썸네일 배경' },
  { name: 'nebula-haze', desc: '페이지 배경 안개' },
];

const HEX: Record<Theme, Record<string, string>> = {
  dark: {
    bg: '#060a09',
    surface: '#0c1311',
    raised: '#121b18',
    overlay: '#18231f',
    fg: '#e4ece9',
    'fg-soft': '#b3c0bb',
    'fg-muted': '#86958f',
    'fg-faint': '#4f5c57',
    accent: '#10b981',
    'accent-strong': '#34d399',
    'accent-subtle': 'rgba(16,185,129,.12)',
    hairline: 'rgba(228,236,233,.06)',
    nebula: '#6d7cff',
    'nebula-soft': '#a3adff',
    'nebula-subtle': 'rgba(109,124,255,.14)',
    'nebula-haze': 'rgba(109,124,255,.07)',
  },
  light: {
    bg: '#f2f5f4',
    surface: '#ffffff',
    raised: '#e9eeec',
    overlay: '#ffffff',
    fg: '#0d1412',
    'fg-soft': '#3a4743',
    'fg-muted': '#66736e',
    'fg-faint': '#a3aeaa',
    accent: '#059669',
    'accent-strong': '#047857',
    'accent-subtle': 'rgba(5,150,105,.10)',
    hairline: 'rgba(13,20,18,.07)',
    nebula: '#4f5bd5',
    'nebula-soft': '#7d87e6',
    'nebula-subtle': 'rgba(79,91,213,.10)',
    'nebula-haze': 'rgba(79,91,213,.05)',
  },
};

const SAMPLE_POSTS = [
  {
    title: 'Next.js 16 마이그레이션 회고',
    desc: 'Turbopack 기본 전환과 proxy.ts 변경점에서 마주친 문제들을 정리했습니다.',
    tags: ['Next.js', '회고'],
    date: '2026. 10. 02',
    read: 8,
  },
  {
    title: 'Three.js로 태그 클라우드 만들기',
    desc: '구면 좌표계 배치부터 드래그 관성 회전까지, 인터랙션 구현 과정.',
    tags: ['Three.js', 'Interaction'],
    date: '2026. 09. 21',
    read: 12,
  },
  {
    title: '서버 컴포넌트로 태그 페이지 옮기기',
    desc: '클라이언트 fetch를 걷어내고 서버 렌더링으로 전환하며 얻은 것들.',
    tags: ['React', 'RSC'],
    date: '2026. 09. 10',
    read: 6,
  },
];

const ALPHA_TOKENS: Record<string, string> = {
  'accent-subtle': 'rgb(var(--accent) / var(--accent-subtle-alpha))',
  'nebula-subtle': 'rgb(var(--nebula) / var(--nebula-subtle-alpha))',
  'nebula-haze': 'rgb(var(--nebula) / var(--nebula-haze-alpha))',
  hairline: 'rgb(var(--fg) / var(--hairline-alpha))',
};

const tokenColor = (name: string) =>
  ALPHA_TOKENS[name] ?? `rgb(var(--${name === 'bg' ? 'base' : name}))`;

const Section = ({
  title,
  caption,
  children,
}: {
  title: string;
  caption?: string;
  children: ReactNode;
}) => (
  <section className="py-14">
    <div className="mb-8">
      <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-accent">
        {title}
      </h2>
      {caption && (
        <p className="mt-2 text-sm text-fg-muted">{caption}</p>
      )}
    </div>
    {children}
  </section>
);

const Swatch = ({
  name,
  desc,
  hex,
}: {
  name: string;
  desc: string;
  hex: string;
}) => (
  <div className="flex flex-col gap-3">
    <div
      className="h-20 rounded-[var(--ds-radius-md)] ring-1 ring-inset ring-hairline"
      style={{ background: tokenColor(name) }}
    />
    <div>
      <p className="text-sm font-semibold">{name}</p>
      <p className="text-xs text-fg-muted font-mono">{hex}</p>
      <p className="text-xs text-fg-faint mt-0.5">{desc}</p>
    </div>
  </div>
);

const DesignSystemPreview = () => {
  const { theme, toggleTheme } = useTheme();
  const [typingKey, setTypingKey] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  const replayTyping = () => {
    setIsTypingComplete(false);
    setTypingKey((k) => k + 1);
  };

  return (
    <div className={styles.root}>
      <div className="max-w-5xl mx-auto px-4 md:px-8 pt-24 pb-24">
        <header className="flex flex-wrap items-end justify-between gap-6 pb-6">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-fg-muted">
              ShipFriend · Design System Draft
            </p>
            <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
              <span className="text-nebula-soft">Deep Space</span>, <span className="text-accent">Quiet</span>{' '}
              Interface
            </h1>
            <p className="mt-3 text-fg-soft">
              그린 틴트 블랙 위에 에메랄드 하나. 테두리 대신 톤과 빛으로 구분합니다.
            </p>
          </div>
          <div className="flex p-1 bg-surface rounded-full">
            {(['dark', 'light'] as Theme[]).map((t) => (
              <button
                key={t}
                onClick={() => theme !== t && toggleTheme()}
                className={`px-4 py-1.5 text-sm rounded-full transition-colors ${
                  theme === t
                    ? 'bg-raised text-fg'
                    : 'text-fg-muted hover:text-fg'
                }`}
              >
                {t === 'dark' ? 'Dark' : 'Light'}
              </button>
            ))}
          </div>
        </header>

        <Section
          title="Surface"
          caption="bg → surface → raised → overlay 순으로 한 단계씩 떠오릅니다."
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {SURFACE_TOKENS.map((t) => (
              <Swatch key={t.name} {...t} hex={HEX[theme][t.name]} />
            ))}
          </div>
          <div className="mt-10 p-6 md:p-8 bg-base">
            <div className="p-6 md:p-8 bg-surface rounded-[var(--ds-radius-lg)]">
              <p className="text-xs text-fg-muted">surface</p>
              <div className="mt-4 p-6 bg-raised rounded-[var(--ds-radius-md)]">
                <p className="text-xs text-fg-muted">raised</p>
                <div className="mt-4 p-5 bg-overlay rounded-[var(--ds-radius-md)] shadow-glow-sm">
                  <p className="text-xs text-fg-muted">overlay</p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section title="Text">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TEXT_TOKENS.map((t) => (
              <div key={t.name}>
                <p
                  className="text-2xl font-semibold"
                  style={{ color: tokenColor(t.name) }}
                >
                  가나다 Aa
                </p>
                <p className="mt-2 text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-fg-muted font-mono">
                  {HEX[theme][t.name]}
                </p>
                <p className="text-xs text-fg-faint mt-0.5">
                  {t.desc}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section
          title="Accent"
          caption={
            theme === 'light'
              ? '라이트에서는 텍스트 대비(AA)를 위해 한 단계 진한 #059669를 씁니다.'
              : '악센트는 에메랄드 하나만 씁니다.'
          }
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {ACCENT_TOKENS.map((t) => (
              <Swatch key={t.name} {...t} hex={HEX[theme][t.name]} />
            ))}
          </div>
        </Section>

        <Section
          title="Nebula"
          caption="우주의 깊이를 위한 보조색. 배경, 히어로, 썸네일 같은 장식에만 쓰고 클릭 가능한 요소에는 쓰지 않습니다."
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {NEBULA_TOKENS.map((t) => (
              <Swatch key={t.name} {...t} hex={HEX[theme][t.name]} />
            ))}
          </div>
          <div className={`${styles.hero} mt-10 px-6 py-10 grid md:grid-cols-2 gap-6 text-sm`}>
            <div>
              <p className="font-semibold text-accent">Accent = 행동</p>
              <p className="mt-2 text-fg-soft leading-6">
                링크, 버튼, 태그, 포커스. 누를 수 있는 것은 에메랄드뿐입니다.
              </p>
            </div>
            <div>
              <p className="font-semibold text-nebula-soft">Nebula = 공간</p>
              <p className="mt-2 text-fg-soft leading-6">
                배경 안개, 히어로 그라디언트, 썸네일 placeholder. 깊이감만 더합니다.
              </p>
            </div>
          </div>
        </Section>

        <Section title="Typography" caption="Pretendard 단일 서체, 굵기와 크기로만 위계를 만듭니다.">
          <div className="space-y-5">
            {[
              { label: 'Display / 48 Bold', cls: 'text-5xl font-bold tracking-tight' },
              { label: 'H1 / 36 Bold', cls: 'text-4xl font-bold tracking-tight' },
              { label: 'H2 / 24 Semibold', cls: 'text-2xl font-semibold' },
              { label: 'H3 / 20 Semibold', cls: 'text-xl font-semibold' },
              { label: 'Body / 16 Regular', cls: 'text-base text-fg-soft leading-7' },
              { label: 'Meta / 13 Medium', cls: 'text-[13px] font-medium text-fg-muted' },
            ].map((t) => (
              <div key={t.label} className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-8">
                <span className="w-40 shrink-0 text-xs font-mono text-fg-faint">
                  {t.label}
                </span>
                <span className={t.cls}>우주를 항해하는 개발 기록</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Controls">
          <div className="flex flex-wrap items-center gap-4">
            <button className={`${styles.btnPrimary} px-5 py-2.5 text-sm font-semibold`}>
              구독하기
            </button>
            <button className={`${styles.btnGhost} px-5 py-2.5 text-sm font-medium`}>
              시리즈 보기
            </button>
            <button className={`${styles.btnText} text-sm font-medium`}>
              전체 글 보기 →
            </button>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {['Next.js', 'React', 'TypeScript', 'Three.js', '회고'].map((tag) => (
              <span key={tag} className={`${styles.tag} px-3 py-1 text-xs font-medium`}>
                #{tag}
              </span>
            ))}
          </div>
          <div className="mt-6 max-w-md">
            <input
              className={`${styles.input} w-full px-4 py-3 text-sm`}
              placeholder="검색어를 입력하세요"
            />
          </div>
        </Section>

        <Section
          title="Card"
          caption="테두리 없음. 호버 시 surface → raised 전환과 에메랄드 글로우."
        >
          <div className="grid md:grid-cols-3 gap-5">
            {SAMPLE_POSTS.map((post) => (
              <article key={post.title} className={`${styles.card} p-6 cursor-pointer`}>
                <div className={`${styles.thumb} aspect-[16/9] mb-5`} />
                <h3 className={`${styles.cardTitle} text-lg font-semibold leading-snug`}>
                  {post.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-fg-soft line-clamp-2">
                  {post.desc}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <span key={tag} className={`${styles.tag} px-2.5 py-0.5 text-[11px] font-medium`}>
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-[13px] text-fg-muted">
                  {post.date} · {post.read}분
                </p>
              </article>
            ))}
          </div>
        </Section>

        <Section title="Post Header" caption="기존 타이핑 효과 유지. 커서는 악센트 컬러.">
          <div className={`${styles.hero} px-6 py-16 md:py-24 text-center`}>
            <h1 className={`${styles.typing} text-3xl md:text-5xl font-bold tracking-tight break-keep`}>
              <TypingText
                key={typingKey}
                title="Next.js 16 마이그레이션 회고"
                delay={60}
                onComplete={() => setIsTypingComplete(true)}
              />
            </h1>
            <div
              className={`transition-opacity duration-500 ${
                isTypingComplete ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <p className="mt-4 md:text-xl text-fg-soft">
                Turbopack, proxy.ts, 그리고 깨진 것들
              </p>
              <p className="mt-6 text-[13px] text-fg-muted">
                ShipFriend · 2026. 10. 02 · 8분
              </p>
            </div>
          </div>
          <button
            onClick={replayTyping}
            className={`${styles.btnText} mt-4 text-sm font-medium`}
          >
            ↻ 타이핑 다시 보기
          </button>
        </Section>

        <Section title="Radius · Motion">
          <div className="flex flex-wrap gap-6">
            {[
              { name: 'sm', v: '6px' },
              { name: 'md', v: '12px' },
              { name: 'lg', v: '20px' },
              { name: 'full', v: '999px' },
            ].map((r) => (
              <div key={r.name} className="text-center">
                <div
                  className="w-20 h-20 bg-raised"
                  style={{ borderRadius: r.v }}
                />
                <p className="mt-2 text-xs font-mono text-fg-muted">
                  {r.name} · {r.v}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-fg-soft">
            ease-out-expo{' '}
            <span className="font-mono text-fg-muted">
              cubic-bezier(0.16, 1, 0.3, 1)
            </span>{' '}
            · fast 150ms · base 250ms · slow 500ms
          </p>
        </Section>

        <Section title="Labs">
          <div className="grid gap-4 sm:grid-cols-2">
            {LAB_PAGES.map((lab) => (
              <Link
                key={lab.href}
                href={lab.href}
                className={`${styles.card} flex items-center justify-between gap-4 p-6`}
              >
                <div>
                  <h3 className={`${styles.cardTitle} text-lg font-semibold`}>
                    {lab.name}
                  </h3>
                  <p className="mt-1 text-sm text-fg-muted">{lab.desc}</p>
                </div>
                <span aria-hidden className="text-fg-faint">
                  →
                </span>
              </Link>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
};

export default DesignSystemPreview;
