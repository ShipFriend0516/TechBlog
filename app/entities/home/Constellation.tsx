'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { formatDate } from '@/app/lib/utils/format';
import { StarPost } from '@/app/types/Home';

const WIDTH = 1000;
const HEIGHT = 280;
const PAD_X = 32;
const TOP = 36;
const BOTTOM = 228;
const BRIGHT_COUNT = 5;

// slug 기반 고정 난수 — 새로고침해도 별 위치가 같도록
const hash = (value: string) => {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
};

interface PlacedStar extends StarPost {
  x: number;
  y: number;
  r: number;
  bright: boolean;
  twinkleDelay: number;
}

interface ConstellationProps {
  stars: StarPost[];
  now: number;
}

const Constellation = ({ stars, now }: ConstellationProps) => {
  // 툴팁에 필요한 slug 만 상태로 — 별 레이어는 호버와 무관하게 메모된 채로 유지
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const { placed, years, seriesLines } = useMemo(() => {
    if (stars.length === 0) return { placed: [], years: [], seriesLines: [] };

    const firstYear = new Date(stars[0].date).getFullYear();
    const start = new Date(firstYear, 0, 1).getTime();
    const span = Math.max(now - start, 1);
    const toX = (date: number) =>
      PAD_X + ((date - start) / span) * (WIDTH - PAD_X * 2);

    const maxView = Math.max(...stars.map((s) => s.view), 1);
    const brightSlugs = new Set(
      [...stars]
        .sort((a, b) => b.view - a.view)
        .slice(0, BRIGHT_COUNT)
        .filter((s) => s.view > 0)
        .map((s) => s.slug)
    );

    const placed: PlacedStar[] = stars.map((star) => ({
      ...star,
      x: toX(star.date),
      y: TOP + hash(star.slug) * (BOTTOM - TOP),
      r: 1.6 + 3.4 * Math.sqrt(star.view / maxView),
      bright: brightSlugs.has(star.slug),
      twinkleDelay: hash(star.slug + 'd') * 4,
    }));

    const years: { year: number; x: number }[] = [];
    for (let y = firstYear; y <= new Date(now).getFullYear(); y++) {
      years.push({ year: y, x: toX(new Date(y, 0, 1).getTime()) });
    }

    // 같은 시리즈의 글은 선으로 이어 하나의 별자리로
    const groups = new Map<string, PlacedStar[]>();
    placed.forEach((star) => {
      if (!star.seriesId) return;
      groups.set(star.seriesId, [...(groups.get(star.seriesId) ?? []), star]);
    });
    const seriesLines = [...groups.values()]
      .filter((group) => group.length > 1)
      .map((group) => group.map((s) => `${s.x},${s.y}`).join(' '));

    return { placed, years, seriesLines };
  }, [stars, now]);

  const starMap = useMemo(
    () => new Map(placed.map((star) => [star.slug, star])),
    [placed]
  );
  const hovered = hoveredSlug ? starMap.get(hoveredSlug) ?? null : null;

  // SVG 전체를 메모 — 호버로 바뀌는 건 아래 툴팁뿐
  const chart = useMemo(() => {
    const updateFromTarget = (target: EventTarget) =>
      setHoveredSlug(
        (target as Element).closest('[data-slug]')?.getAttribute('data-slug') ?? null
      );
    const clearHover = () => setHoveredSlug(null);

    return (
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full h-auto"
        role="img"
        aria-label={`지금까지 쓴 글 ${placed.length}개를 시간순으로 배치한 별자리`}
      >
        <defs>
          <radialGradient id="star-glow">
            <stop offset="0%" stopColor="rgb(var(--accent))" stopOpacity="0.6" />
            <stop offset="100%" stopColor="rgb(var(--accent))" stopOpacity="0" />
          </radialGradient>
        </defs>

        {years.map(({ year, x }) => (
          <g key={year}>
            <line
              x1={x}
              x2={x}
              y1={TOP - 16}
              y2={BOTTOM + 16}
              stroke="rgb(var(--fg) / var(--hairline-alpha))"
              strokeDasharray="2 6"
            />
            <text x={x + 6} y={HEIGHT - 12} fontSize="12" fill="rgb(var(--fg-muted))">
              {year}
            </text>
          </g>
        ))}

        {seriesLines.map((points, i) => (
          <polyline
            key={i}
            points={points}
            fill="none"
            stroke="rgb(var(--nebula) / 0.35)"
            strokeWidth="1"
          />
        ))}

        {/* 이벤트는 부모 g 에서 위임 처리 — 별마다 핸들러를 만들지 않음 */}
        <g
          onPointerOver={(e) => updateFromTarget(e.target)}
          onPointerLeave={clearHover}
          onFocus={(e) => updateFromTarget(e.target)}
          onBlur={clearHover}
        >
          {placed.map((star) => (
            <a
              key={star.slug}
              href={`/posts/${star.slug}`}
              data-slug={star.slug}
              aria-label={`${star.title}, ${formatDate(star.date)}`}
              className="group outline-none"
            >
              {/* 작은 별도 쉽게 가리킬 수 있도록 투명한 히트 영역 */}
              <circle cx={star.x} cy={star.y} r={10} fill="transparent" />
              {star.bright && (
                <circle cx={star.x} cy={star.y} r={star.r * 4} fill="url(#star-glow)" />
              )}
              {/* 호버 강조는 CSS(group-hover)로 처리 */}
              <circle
                cx={star.x}
                cy={star.y}
                r={star.r}
                fill={star.bright ? 'rgb(var(--accent-strong))' : 'rgb(var(--fg-soft))'}
                className={`[transform-box:fill-box] origin-center transition-transform duration-150 group-hover:scale-150 group-focus-visible:scale-150 ${
                  star.bright ? '' : 'motion-safe:animate-twinkle'
                }`}
                style={{ animationDelay: `${star.twinkleDelay}s` }}
              />
            </a>
          ))}
        </g>
      </svg>
    );
  }, [placed, years, seriesLines]);

  // 좁은 화면에서 가로 스크롤이 생기면 최근 글(오른쪽 끝)부터 보이도록
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (scroller) scroller.scrollLeft = scroller.scrollWidth;
  }, [placed.length]);

  if (placed.length === 0) return null;

  return (
    <div ref={scrollerRef} className="overflow-x-auto -mx-4 px-4 scrollbar-custom">
      <div className="relative min-w-[560px] md:min-w-[640px]">
        {chart}

        {hovered && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-xl bg-overlay px-3 py-2 shadow-glow-sm text-xs whitespace-nowrap"
            style={{
              left: `${(hovered.x / WIDTH) * 100}%`,
              top: `calc(${(hovered.y / HEIGHT) * 100}% - 12px)`,
            }}
          >
            <p className="font-semibold text-fg max-w-[240px] truncate">{hovered.title}</p>
            <p className="mt-0.5 text-fg-muted tabular-nums">
              {formatDate(hovered.date)} · 조회 {hovered.view.toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Constellation;
