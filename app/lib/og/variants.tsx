import type { CSSProperties, ReactElement } from 'react';

// 디자인 시스템(app/design-system) 토큰의 HEX 값. Satori는 CSS 변수를 읽지 못한다.
const DARK = {
  bg: '#060a09',
  surface: '#0c1311',
  fg: '#e4ece9',
  fgSoft: '#b3c0bb',
  fgMuted: '#86958f',
  accent: '#10b981',
  accentStrong: '#34d399',
  nebula: '#6d7cff',
  nebulaSoft: '#a3adff',
};

const LIGHT = {
  bg: '#f2f5f4',
  surface: '#ffffff',
  fg: '#0d1412',
  fgSoft: '#3a4743',
  fgMuted: '#66736e',
  accent: '#059669',
  nebula: '#4f5bd5',
};

export const OG_SIZE = { width: 1200, height: 630 };

type OgContent = {
  title: string;
  description?: string;
  siteName: string;
  host: string;
  logoSrc: string;
};

type OgVariant = {
  id: string;
  name: string;
  summary: string;
  render: (content: OgContent) => ReactElement;
};

const fill: CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'flex',
  fontFamily: 'Pretendard',
};

const clamp = (lines: number): CSSProperties => ({
  display: 'block',
  lineClamp: lines,
  wordBreak: 'keep-all',
});

const Brand = ({
  logoSrc,
  siteName,
  color,
  size = 44,
}: {
  logoSrc: string;
  siteName: string;
  color: string;
  size?: number;
}) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={logoSrc} width={size} height={size} alt="" />
    <span style={{ fontSize: size * 0.55, fontWeight: 600, color }}>
      {siteName}
    </span>
  </div>
);

const OG_VARIANTS = [
  {
    id: 'nebula',
    name: 'A · Nebula Glow',
    summary: '다크 배경 모서리에 nebula·accent 빛이 번지는 기본형',
    render: ({ title, description, siteName, host, logoSrc }) => (
      <div
        style={{
          ...fill,
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 80,
          backgroundColor: DARK.bg,
          backgroundImage: [
            `radial-gradient(circle at 100% 0%, ${DARK.nebula}59 0%, transparent 55%)`,
            `radial-gradient(circle at 0% 100%, ${DARK.accent}40 0%, transparent 50%)`,
          ].join(', '),
        }}
      >
        <Brand logoSrc={logoSrc} siteName={siteName} color={DARK.fgSoft} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div
            style={{
              ...clamp(2),
              fontSize: 68,
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: -1.5,
              color: DARK.fg,
            }}
          >
            {title}
          </div>
          {description && (
            <div
              style={{
                ...clamp(2),
                fontSize: 28,
                lineHeight: 1.5,
                color: DARK.fgMuted,
              }}
            >
              {description}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', fontSize: 22, color: DARK.fgMuted }}>
          {host}
        </div>
      </div>
    ),
  },
  {
    id: 'horizon',
    name: 'B · Horizon',
    summary: '중앙 정렬, 하단 지평선에서 accent→nebula 빛이 떠오름',
    render: ({ title, description, host, logoSrc }) => (
      <div
        style={{
          ...fill,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 120px',
          textAlign: 'center',
          backgroundColor: DARK.bg,
          backgroundImage: [
            `radial-gradient(ellipse 70% 45% at 50% 105%, ${DARK.accent}66 0%, ${DARK.nebula}33 45%, transparent 75%)`,
          ].join(', '),
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={88} height={88} alt="" />
        <div
          style={{
            ...clamp(2),
            marginTop: 40,
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: -1.5,
            color: DARK.fg,
          }}
        >
          {title}
        </div>
        {description && (
          <div
            style={{
              ...clamp(1),
              marginTop: 20,
              fontSize: 26,
              color: DARK.fgMuted,
            }}
          >
            {description}
          </div>
        )}
        <div
          style={{
            position: 'absolute',
            bottom: 48,
            display: 'flex',
            fontSize: 20,
            letterSpacing: 4,
            color: DARK.fgSoft,
          }}
        >
          {host.toUpperCase()}
        </div>
      </div>
    ),
  },
  {
    id: 'gradient-type',
    name: 'C · Gradient Type',
    summary: '제목 자체에 accent→nebula 그라디언트, 상단 얇은 라인',
    render: ({ title, description, siteName, host, logoSrc }) => (
      <div
        style={{
          ...fill,
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 80,
          backgroundColor: DARK.bg,
          backgroundImage: `radial-gradient(circle at 80% 40%, ${DARK.nebula}1f 0%, transparent 60%)`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            display: 'flex',
            backgroundImage: `linear-gradient(90deg, ${DARK.accent}, ${DARK.nebula})`,
          }}
        />
        <div style={{ display: 'flex', fontSize: 22, color: DARK.fgMuted }}>
          {host}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div
            style={{
              ...clamp(2),
              alignSelf: 'flex-start',
              maxWidth: '100%',
              fontSize: 66,
              fontWeight: 700,
              lineHeight: 1.18,
              letterSpacing: -1.5,
              color: 'transparent',
              backgroundImage: `linear-gradient(100deg, ${DARK.accentStrong} 0%, ${DARK.nebulaSoft} 100%)`,
              backgroundClip: 'text',
            }}
          >
            {title}
          </div>
          {description && (
            <div
              style={{
                ...clamp(2),
                fontSize: 28,
                lineHeight: 1.5,
                color: DARK.fgSoft,
              }}
            >
              {description}
            </div>
          )}
        </div>
        <Brand logoSrc={logoSrc} siteName={siteName} color={DARK.fgSoft} size={40} />
      </div>
    ),
  },
  {
    id: 'split',
    name: 'D · Split Panel',
    summary: '왼쪽 그라디언트 패널에 로고, 오른쪽에 텍스트',
    render: ({ title, description, siteName, host, logoSrc }) => (
      <div style={{ ...fill, backgroundColor: DARK.bg }}>
        <div
          style={{
            width: 400,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: `linear-gradient(150deg, ${DARK.accent} 0%, ${DARK.nebula} 100%)`,
          }}
        >
          <div
            style={{
              width: 200,
              height: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 48,
              backgroundColor: `${DARK.bg}d9`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoSrc} width={120} height={120} alt="" />
          </div>
        </div>
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '72px 72px 64px',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 22,
              fontWeight: 600,
              color: DARK.accentStrong,
            }}
          >
            {siteName}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div
              style={{
                ...clamp(3),
                fontSize: 56,
                fontWeight: 700,
                lineHeight: 1.22,
                letterSpacing: -1.2,
                color: DARK.fg,
              }}
            >
              {title}
            </div>
            {description && (
              <div
                style={{
                  ...clamp(2),
                  fontSize: 24,
                  lineHeight: 1.5,
                  color: DARK.fgMuted,
                }}
              >
                {description}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', fontSize: 20, color: DARK.fgMuted }}>
            {host}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'daylight',
    name: 'E · Daylight',
    summary: '라이트 테마 토큰, 옅은 nebula·accent 안개',
    render: ({ title, description, siteName, host, logoSrc }) => (
      <div
        style={{
          ...fill,
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 80,
          backgroundColor: LIGHT.bg,
          backgroundImage: [
            `radial-gradient(circle at 95% 10%, ${LIGHT.nebula}2e 0%, transparent 50%)`,
            `radial-gradient(circle at 75% 110%, ${LIGHT.accent}26 0%, transparent 45%)`,
          ].join(', '),
        }}
      >
        <Brand logoSrc={logoSrc} siteName={siteName} color={LIGHT.fgSoft} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div
            style={{
              ...clamp(2),
              fontSize: 68,
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: -1.5,
              color: LIGHT.fg,
            }}
          >
            {title}
          </div>
          {description && (
            <div
              style={{
                ...clamp(2),
                fontSize: 28,
                lineHeight: 1.5,
                color: LIGHT.fgMuted,
              }}
            >
              {description}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 48,
              height: 4,
              display: 'flex',
              borderRadius: 2,
              backgroundImage: `linear-gradient(90deg, ${LIGHT.accent}, ${LIGHT.nebula})`,
            }}
          />
          <span style={{ fontSize: 22, color: LIGHT.fgMuted }}>{host}</span>
        </div>
      </div>
    ),
  },
] as const satisfies readonly OgVariant[];

export type OgVariantId = (typeof OG_VARIANTS)[number]['id'];

// 시안 확정 시 이 값만 바꾸면 사이트 기본 OG 이미지가 교체된다.
export const SELECTED_OG_VARIANT: OgVariantId = 'gradient-type';

export const getOgVariant = (id: string) =>
  OG_VARIANTS.find((variant) => variant.id === id);
