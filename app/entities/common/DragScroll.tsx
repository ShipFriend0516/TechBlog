'use client';

import { ReactNode, useEffect, useRef } from 'react';

const CLICK_SUPPRESS_DISTANCE = 5;
const FRICTION = 0.92;
const MIN_VELOCITY = 0.05;

interface DragScrollProps {
  className?: string;
  children: ReactNode;
}

// 가로 스크롤 목록을 데스크톱 마우스로 끌어서 넘길 수 있게 함
// 터치·펜은 브라우저 기본 스와이프를 그대로 사용
const DragScroll = ({ className = '', children }: DragScrollProps) => {
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let startX = 0;
    let startScroll = 0;
    let moved = 0;
    let lastX = 0;
    let lastTime = 0;
    let velocity = 0; // px/ms
    let frame = 0;

    const restoreSnap = () => {
      el.style.scrollSnapType = '';
    };

    // 놓은 뒤 관성으로 조금 더 미끄러지다 스냅 복원
    const glide = () => {
      let prev = performance.now();
      const step = (now: number) => {
        const dt = now - prev;
        prev = now;
        el.scrollLeft -= velocity * dt;
        velocity *= Math.pow(FRICTION, dt / 16);
        if (Math.abs(velocity) > MIN_VELOCITY) {
          frame = requestAnimationFrame(step);
        } else {
          restoreSnap();
        }
      };
      frame = requestAnimationFrame(step);
    };

    const onPointerMove = (e: PointerEvent) => {
      const dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      el.scrollLeft = startScroll - dx;

      const now = performance.now();
      const dt = now - lastTime;
      if (dt > 0) velocity = (e.clientX - lastX) / dt;
      lastX = e.clientX;
      lastTime = now;
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      el.style.cursor = '';
      el.style.userSelect = '';
      // 마지막 움직임 후 오래 멈춰 있었다면 관성 없이 멈춤
      if (performance.now() - lastTime > 80) velocity = 0;
      glide();
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      if (el.scrollWidth <= el.clientWidth) return;
      cancelAnimationFrame(frame);
      startX = lastX = e.clientX;
      startScroll = el.scrollLeft;
      lastTime = performance.now();
      moved = 0;
      velocity = 0;
      // 끄는 동안 스냅이 위치를 당기지 않도록 해제
      el.style.scrollSnapType = 'none';
      el.style.cursor = 'grabbing';
      el.style.userSelect = 'none';
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
    };

    // 끌기가 끝난 직후의 클릭은 카드 링크 이동으로 이어지지 않게 차단
    const onClickCapture = (e: MouseEvent) => {
      if (moved > CLICK_SUPPRESS_DISTANCE) {
        e.preventDefault();
        e.stopPropagation();
        moved = 0;
      }
    };

    // 링크·이미지의 브라우저 기본 끌어놓기 방지
    const onDragStart = (e: DragEvent) => e.preventDefault();

    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('click', onClickCapture, true);
    el.addEventListener('dragstart', onDragStart);

    return () => {
      cancelAnimationFrame(frame);
      onPointerUp();
      cancelAnimationFrame(frame);
      restoreSnap();
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('click', onClickCapture, true);
      el.removeEventListener('dragstart', onDragStart);
    };
  }, []);

  return (
    <ul ref={ref} className={`[@media(pointer:fine)]:cursor-grab ${className}`}>
      {children}
    </ul>
  );
};

export default DragScroll;
