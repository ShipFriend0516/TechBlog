'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef } from 'react';
import { TagData } from '@/app/types/Tag';

interface TagCloudProps {
  tags: TagData[];
}

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;
const PARTICLE_COUNT = 80;
const AUTO_SPEED = 0.0004; // rad/ms
const DRAG_SENSITIVITY = 0.006;
const CLICK_SUPPRESS_DISTANCE = 5;
const MAX_TILT = Math.PI / 3;

// 시드 기반 난수 — SSR과 클라이언트 값이 달라지지 않도록 고정
const mulberry32 = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// Fibonacci Sphere — 단위 구 위에 점을 고르게 분포
const fibonacciPoint = (index: number, total: number): Vec3 => {
  const phi = Math.acos(1 - (2 * (index + 0.5)) / total);
  const theta = 2 * Math.PI * index * GOLDEN_RATIO;
  return {
    x: Math.sin(phi) * Math.cos(theta),
    y: Math.sin(phi) * Math.sin(theta),
    z: Math.cos(phi),
  };
};

const rotate = (v: Vec3, rotX: number, rotY: number): Vec3 => {
  const cosY = Math.cos(rotY);
  const sinY = Math.sin(rotY);
  const x1 = v.x * cosY + v.z * sinY;
  const z1 = -v.x * sinY + v.z * cosY;

  const cosX = Math.cos(rotX);
  const sinX = Math.sin(rotX);
  return {
    x: x1,
    y: v.y * cosX - z1 * sinX,
    z: v.y * sinX + z1 * cosX,
  };
};

const TagCloud = ({ tags }: TagCloudProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tagRefs = useRef<(HTMLDivElement | null)[]>([]);
  const particleRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 태그 개수 기준 폰트 크기 (로그 스케일) — 배치와 무관하므로 한 번만 계산
  const tagBases = useMemo(() => {
    const total = tags.length;
    const maxCount = tags[0]?.count ?? 1;
    return tags.map((tag, index) => ({
      ...tag,
      point: fibonacciPoint(index, total),
      sizeFactor: Math.log(tag.count + 1) / Math.log(maxCount + 1),
    }));
  }, [tags]);

  const particles = useMemo(() => {
    const random = mulberry32(20260101);
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const jitter = 0.8 + random() * 0.4;
      const p = fibonacciPoint(i, PARTICLE_COUNT);
      return {
        point: { x: p.x * jitter, y: p.y * jitter, z: p.z * jitter },
        size: 2 + random() * 2,
      };
    });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    let radiusX = 240;
    let radiusY = 200;
    let rotX = 0.25;
    let rotY = 0;
    let velocityY = reducedMotion ? 0 : AUTO_SPEED;
    let paused = false; // 태그 hover/focus 중 회전 정지
    let dragging = false;
    let dragMoved = 0;
    let visible = true;
    let lastTime = performance.now();
    let frame = 0;

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      // 라벨이 가로로 길어서 가로 반지름을 더 크게 쓰는 타원체 (태그 폭 여유 확보)
      radiusX = Math.max(110, Math.min(width * 0.36, 440));
      radiusY = Math.max(110, Math.min(height * 0.42, 270));
    };

    const draw = () => {
      tagBases.forEach((base, i) => {
        const el = tagRefs.current[i];
        if (!el) return;
        const { x, y, z } = rotate(base.point, rotX, rotY);
        const depth = (z + 1) / 2; // 0(뒤) ~ 1(앞)
        const focused = el.dataset.active === 'true';

        const scale = (0.7 + depth * 0.55) * (focused ? 1.25 : 1);
        el.style.transform = `translate(-50%, -50%) translate3d(${x * radiusX}px, ${y * radiusY}px, 0) scale(${scale})`;
        el.style.opacity = String(focused ? 1 : 0.35 + depth * 0.65);
        el.style.zIndex = String(focused ? 200 : Math.round(depth * 100));
        // 뒤쪽 태그는 앞 태그 클릭을 가로채지 않도록 포인터 이벤트 제외
        el.style.pointerEvents = depth < 0.3 && !focused ? 'none' : 'auto';
      });

      particles.forEach((particle, i) => {
        const el = particleRefs.current[i];
        if (!el) return;
        const { x, y, z } = rotate(particle.point, rotX, rotY);
        const depth = (z + 1) / 2;
        el.style.transform = `translate(-50%, -50%) translate3d(${x * radiusX}px, ${y * radiusY}px, 0) scale(${0.4 + depth * 0.6})`;
        el.style.opacity = String(0.15 + depth * 0.3);
      });
    };

    const tick = (now: number) => {
      const dt = Math.min(now - lastTime, 64);
      lastTime = now;

      if (visible) {
        if (!dragging) {
          // 드래그 관성은 자동 회전 속도로 서서히 수렴
          const target = paused || reducedMotion ? 0 : AUTO_SPEED;
          velocityY += (target - velocityY) * Math.min(1, dt * 0.004);
          rotY += velocityY * dt;
        }
        draw();
      }
      frame = requestAnimationFrame(tick);
    };

    // 드래그 회전 — 페이지 세로 스크롤은 touch-action: pan-y로 유지
    let lastX = 0;
    let lastY = 0;
    const onPointerMove = (e: PointerEvent) => {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      dragMoved += Math.abs(dx) + Math.abs(dy);
      rotY += dx * DRAG_SENSITIVITY;
      velocityY = dx * DRAG_SENSITIVITY * 0.06;
      rotX = Math.max(-MAX_TILT, Math.min(MAX_TILT, rotX - dy * DRAG_SENSITIVITY));
    };
    const onPointerUp = () => {
      dragging = false;
      container.style.cursor = 'grab';
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      dragging = true;
      dragMoved = 0;
      lastX = e.clientX;
      lastY = e.clientY;
      container.style.cursor = 'grabbing';
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', onPointerUp);
    };

    // 드래그 직후 발생하는 클릭은 링크 이동으로 이어지지 않게 차단
    const onClickCapture = (e: MouseEvent) => {
      if (dragMoved > CLICK_SUPPRESS_DISTANCE) {
        e.preventDefault();
        e.stopPropagation();
        dragMoved = 0;
      }
    };

    // 태그 hover/focus 시 회전 정지 + 강조
    const setActive = (target: EventTarget | null, active: boolean) => {
      const el = (target as HTMLElement | null)?.closest<HTMLElement>(
        '[data-tag]'
      );
      if (!el) return;
      el.dataset.active = String(active);
      paused = active;
    };
    const onOver = (e: PointerEvent) => setActive(e.target, true);
    const onOut = (e: PointerEvent) => setActive(e.target, false);
    const onFocusIn = (e: FocusEvent) => setActive(e.target, true);
    const onFocusOut = (e: FocusEvent) => setActive(e.target, false);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      lastTime = performance.now();
    });
    intersectionObserver.observe(container);

    resize();
    draw();
    frame = requestAnimationFrame(tick);

    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('click', onClickCapture, true);
    container.addEventListener('pointerover', onOver);
    container.addEventListener('pointerout', onOut);
    container.addEventListener('focusin', onFocusIn);
    container.addEventListener('focusout', onFocusOut);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      onPointerUp();
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('click', onClickCapture, true);
      container.removeEventListener('pointerover', onOver);
      container.removeEventListener('pointerout', onOut);
      container.removeEventListener('focusin', onFocusIn);
      container.removeEventListener('focusout', onFocusOut);
    };
  }, [tagBases, particles]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[420px] md:h-[600px] overflow-hidden cursor-grab select-none touch-pan-y"
    >
      {/* 그라데이션 배경 */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-radial from-primary-caribbean/5 via-transparent to-transparent dark:from-primary-mountain/10 dark:via-transparent dark:to-transparent" />

      {/* 입자들 — 중앙(left/top 50%) 기준으로 translate */}
      {particles.map((particle, i) => (
        <div
          key={`particle-${i}`}
          ref={(el) => {
            particleRefs.current[i] = el;
          }}
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 rounded-full pointer-events-none bg-slate-500 dark:bg-primary-mountain"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: 0,
          }}
        />
      ))}

      {/* 태그들 */}
      {tagBases.map((base, i) => (
        <div
          key={base.tag}
          ref={(el) => {
            tagRefs.current[i] = el;
          }}
          data-tag={base.tag}
          className="absolute left-1/2 top-1/2 will-change-transform"
          style={{
            opacity: 0,
            fontSize: `${12 + base.sizeFactor * 8}px`,
          }}
        >
          <Link
            href={`/posts?page=1&tag=${encodeURIComponent(base.tag)}`}
            draggable={false}
            className="group flex items-baseline gap-1 font-bold whitespace-nowrap
                      text-primary-bangladesh hover:text-primary-mountain focus-visible:text-primary-mountain
                      dark:text-primary-caribbean dark:hover:text-primary-mountain
                      transition-colors duration-300 rounded outline-offset-4"
            aria-label={`${base.tag} 태그 (${base.count}개 글)`}
          >
            #{base.tag}
            <span
              aria-hidden="true"
              className="text-[0.55em] font-medium opacity-0 group-hover:opacity-80 group-focus-visible:opacity-80 transition-opacity duration-200"
            >
              {base.count}
            </span>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default TagCloud;
