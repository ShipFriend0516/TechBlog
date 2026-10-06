'use client';

import { useEffect, useRef } from 'react';
import { type SceneId, scenes } from './scenes';

interface SceneCanvasProps {
  scene: SceneId;
  className?: string;
}

const SceneCanvas = ({ scene, className }: SceneCanvasProps) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const instance = scenes[scene]();
    const font = getComputedStyle(canvas).fontFamily;
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    let w = 0;
    let h = 0;
    let t = 0;
    let last = performance.now();
    let visible = true;
    let raf = 0;

    const draw = (dt: number) => {
      t += dt;
      instance.frame(ctx, { w, h, t, dt, font });
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      instance.init(w, h);
      // 모션 최소화 환경에서는 몇 초 진행시킨 장면을 정지 화면으로 보여준다
      if (reduceMotion) for (let i = 0; i < 150; i++) draw(1 / 60);
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min((now - last) / 1000, 1 / 20);
      last = now;
      if (visible && w > 0) draw(dt);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    // 화면 밖의 시안은 그리지 않는다
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    intersectionObserver.observe(canvas);
    if (!reduceMotion) raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [scene]);

  return <canvas ref={ref} className={className} aria-hidden />;
};

export default SceneCanvas;
