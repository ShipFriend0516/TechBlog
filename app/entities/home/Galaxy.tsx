'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { formatDate } from '@/app/lib/utils/format';
import { StarPost } from '@/app/types/Home';

// 비스듬히 본 원반 — 원 좌표를 세로로 눌러 타원으로 투영
const WIDTH = 640;
const HEIGHT = 400;
const CX = WIDTH / 2;
const CY = HEIGHT / 2;
const TILT = 0.58;
const R_MIN = 16;
const R_MAX = 296;
const TURNS = 1.6;
const THETA_MAX = TURNS * Math.PI * 2;
const START_ANGLE = -Math.PI / 2;
const BRIGHT_COUNT = 5;
const DUST_COUNT = 420;

// 시드 기반 난수 — SSR 과 클라이언트가 같은 은하를 그리도록 고정
const mulberry32 = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const hash = (value: string) => {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
};

// 아르키메데스 나선: 반지름이 각도에 비례. t(0~1) 는 시간 진행도
// θ ∝ √t 로 두어 바깥 팔에서도 별 간격이 너무 벌어지지 않게 함
const thetaOf = (t: number) => THETA_MAX * Math.sqrt(Math.min(Math.max(t, 0), 1));
const radiusOf = (theta: number) => R_MIN + (R_MAX - R_MIN) * (theta / THETA_MAX);
const project = (theta: number, radius: number, armOffset = 0) => {
  const angle = theta + START_ANGLE + armOffset;
  return { x: CX + radius * Math.cos(angle), y: CY + radius * Math.sin(angle) * TILT };
};

interface PlacedStar extends StarPost {
  x: number;
  y: number;
  r: number;
  bright: boolean;
  twinkleDelay: number;
}

interface GalaxyProps {
  stars: StarPost[];
  now: number;
}

const Galaxy = ({ stars, now }: GalaxyProps) => {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  const { placed, armPath, dust, years, newest } = useMemo(() => {
    if (stars.length === 0) {
      return { placed: [], armPath: '', dust: [], years: [], newest: null };
    }

    const start = stars[0].date;
    const span = Math.max(now - start, 1);
    const tOf = (date: number) => (date - start) / span;

    const maxView = Math.max(...stars.map((s) => s.view), 1);
    const brightSlugs = new Set(
      [...stars]
        .sort((a, b) => b.view - a.view)
        .slice(0, BRIGHT_COUNT)
        .filter((s) => s.view > 0)
        .map((s) => s.slug)
    );

    const placed: PlacedStar[] = stars.map((star) => {
      const theta = thetaOf(tOf(star.date));
      // 팔 위에서 살짝 흩어지게 — 같은 날 쓴 글이 겹치지 않도록
      const jitter = (hash(star.slug) - 0.5) * 16;
      return {
        ...star,
        ...project(theta, radiusOf(theta) + jitter),
        r: 1.8 + 3.6 * Math.sqrt(star.view / maxView),
        bright: brightSlugs.has(star.slug),
        twinkleDelay: hash(star.slug + 'd') * 4,
      };
    });

    const armPoints: string[] = [];
    for (let i = 0; i <= 160; i++) {
      const theta = (THETA_MAX * i) / 160;
      const { x, y } = project(theta, radiusOf(theta));
      armPoints.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }

    // 먼지 — 별이 없는 반대편 팔까지 채워 은하 모양을 만듦 (원 좌표, 회전 레이어에서 눌러 그림)
    const random = mulberry32(20241105);
    const dust = Array.from({ length: DUST_COUNT }, () => {
      const theta = THETA_MAX * Math.sqrt(random());
      const arm = random() < 0.5 ? 0 : Math.PI;
      // 팔 중심에 몰리도록 두 난수의 평균(삼각 분포)으로 흩뿌림
      const spread = (random() + random() - 1) * 26;
      const radius = radiusOf(theta) + spread;
      const angle = theta + START_ANGLE + arm;
      return {
        x: radius * Math.cos(angle),
        y: radius * Math.sin(angle),
        size: 0.5 + random() * 1.1,
        opacity: 0.12 + random() * 0.3,
      };
    });

    const years: { year: number; x: number; y: number }[] = [];
    const firstYear = new Date(start).getFullYear();
    const lastYear = new Date(now).getFullYear();
    for (let y = firstYear + 1; y <= lastYear; y++) {
      const theta = thetaOf(tOf(new Date(y, 0, 1).getTime()));
      years.push({ year: y, ...project(theta, radiusOf(theta) + 26) });
    }

    return { placed, armPath: armPoints.join(' '), dust, years, newest: placed[placed.length - 1] };
  }, [stars, now]);

  const starMap = useMemo(() => new Map(placed.map((s) => [s.slug, s])), [placed]);
  const hovered = hoveredSlug ? starMap.get(hoveredSlug) ?? null : null;
  const focus = hovered ?? newest;

  // 호버한 별의 시리즈만 선으로 연결
  const seriesStars = useMemo(
    () => (hovered?.seriesId ? placed.filter((s) => s.seriesId === hovered.seriesId) : []),
    [hovered, placed]
  );

  // 별·먼지·팔은 호버와 무관하게 메모 — 강조/흐림은 아래 <style> 한 줄로 처리
  const chart = useMemo(() => {
    const updateFromTarget = (target: EventTarget) =>
      setHoveredSlug(
        (target as Element).closest('[data-slug]')?.getAttribute('data-slug') ?? null
      );

    return (
      <>
        <defs>
          <radialGradient id="galaxy-core">
            <stop offset="0%" stopColor="rgb(var(--nebula-soft))" stopOpacity="0.55" />
            <stop offset="35%" stopColor="rgb(var(--nebula))" stopOpacity="0.18" />
            <stop offset="100%" stopColor="rgb(var(--nebula))" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="galaxy-star-glow">
            <stop offset="0%" stopColor="rgb(var(--accent))" stopOpacity="0.6" />
            <stop offset="100%" stopColor="rgb(var(--accent))" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse cx={CX} cy={CY} rx={150} ry={150 * TILT} fill="url(#galaxy-core)" />

        <g transform={`translate(${CX} ${CY}) scale(1 ${TILT})`}>
          <g
            className="motion-safe:animate-[spin_240s_linear_infinite]"
            style={{ transformOrigin: '0px 0px' }}
          >
            {dust.map((d, i) => (
              <circle
                key={i}
                cx={d.x}
                cy={d.y}
                r={d.size}
                fill="rgb(var(--fg-soft))"
                opacity={d.opacity}
              />
            ))}
          </g>
        </g>

        <polyline
          points={armPath}
          fill="none"
          stroke="rgb(var(--nebula-soft) / 0.3)"
          strokeWidth="1"
          strokeDasharray="1 4"
        />

        {years.map(({ year, x, y }) => (
          <text
            key={year}
            x={x}
            y={y}
            textAnchor="middle"
            className="text-[11px] max-md:text-[22px]"
            fill="rgb(var(--fg-muted))"
          >
            {year}
          </text>
        ))}

        <g
          className="galaxy-stars"
          onPointerOver={(e) => updateFromTarget(e.target)}
          onPointerLeave={() => setHoveredSlug(null)}
          onFocus={(e) => updateFromTarget(e.target)}
          onBlur={() => setHoveredSlug(null)}
        >
          {placed.map((star) => (
            <a
              key={star.slug}
              href={`/posts/${star.slug}`}
              data-slug={star.slug}
              data-series={star.seriesId ?? ''}
              aria-label={`${star.title}, ${formatDate(star.date)}`}
              className="galaxy-star group outline-none transition-opacity duration-200"
            >
              {/* 작은 별도 쉽게 가리키거나 탭할 수 있도록 넓은 투명 히트 영역 */}
              <circle cx={star.x} cy={star.y} r={14} fill="transparent" />
              {star.bright && (
                <circle cx={star.x} cy={star.y} r={star.r * 4} fill="url(#galaxy-star-glow)" />
              )}
              <circle
                cx={star.x}
                cy={star.y}
                r={star.r}
                fill={star.bright ? 'rgb(var(--accent-strong))' : 'rgb(var(--fg-soft))'}
                className={`[transform-box:fill-box] origin-center transition-transform duration-150 max-md:scale-[1.7] group-hover:scale-150 max-md:group-hover:scale-[2.2] group-focus-visible:scale-150 ${
                  star.bright ? '' : 'motion-safe:animate-twinkle'
                }`}
                style={{ animationDelay: `${star.twinkleDelay}s` }}
              />
            </a>
          ))}
        </g>
      </>
    );
  }, [placed, armPath, dust, years]);

  if (!newest || !focus) return null;

  const highlightCss = hovered
    ? `.galaxy-star{opacity:.25}.galaxy-star[data-slug="${CSS.escape(hovered.slug)}"]${
        hovered.seriesId
          ? `,.galaxy-star[data-series="${CSS.escape(hovered.seriesId)}"]`
          : ''
      }{opacity:1}`
    : '';
  const seriesIndex = hovered?.seriesId
    ? seriesStars.findIndex((s) => s.slug === hovered.slug) + 1
    : 0;

  return (
    <div className="grid md:grid-cols-[1fr_240px] gap-6 md:gap-8 items-center">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full h-auto"
        role="img"
        aria-label={`지금까지 쓴 글 ${placed.length}개를 첫 글부터 나선으로 배치한 은하`}
      >
        {highlightCss && <style>{highlightCss}</style>}
        {chart}

        {seriesStars.length > 1 && (
          <polyline
            points={seriesStars.map((s) => `${s.x},${s.y}`).join(' ')}
            fill="none"
            stroke="rgb(var(--nebula-soft) / 0.7)"
            strokeWidth="1.2"
            pointerEvents="none"
          />
        )}

        {/* 가장 최근 글 — 맥동하는 고리 */}
        <circle
          cx={newest.x}
          cy={newest.y}
          r={newest.r + 6}
          fill="none"
          stroke="rgb(var(--accent))"
          strokeWidth="1"
          pointerEvents="none"
          className="motion-safe:animate-pulse"
        />
      </svg>

      <div className="min-h-[148px]" aria-live="polite">
        <p className="text-xs font-semibold text-nebula-soft">
          {hovered ? '선택한 별' : '가장 최근의 별'}
        </p>
        <Link
          href={`/posts/${focus.slug}`}
          className="mt-2 block text-lg font-semibold leading-snug break-keep hover:text-accent transition-colors"
        >
          {focus.title}
        </Link>
        <p className="mt-2 text-sm text-fg-muted tabular-nums">
          {formatDate(focus.date)} · 조회 {focus.view.toLocaleString()}
        </p>
        {focus.seriesTitle && (
          <p className="mt-3 inline-block rounded-full bg-nebula-subtle px-2.5 py-0.5 text-xs text-nebula-soft">
            {focus.seriesTitle}
            {seriesIndex > 0 && ` · ${seriesStars.length}편 중 ${seriesIndex}번째`}
          </p>
        )}
      </div>
    </div>
  );
};

export default Galaxy;
