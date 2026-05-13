'use client';

import { animate, motion, useMotionValue } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface ZoomImageData {
  src: string;
  alt?: string;
  rect: DOMRect;
}

interface ImageZoomViewerProps {
  image: ZoomImageData | null;
  onClose: () => void;
}

const SPRING = { type: 'spring', stiffness: 350, damping: 35 } as const;
const SCALE_STEP = 1.8;
const MAX_SCALE = 6;

const ImageZoomViewer = ({ image, onClose }: ImageZoomViewerProps) => {
  const [visible, setVisible] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const dimsRef = useRef<{ startX: number; startY: number; startScale: number } | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const backdropOpacity = useMotionValue(0);

  // 이미지 열림: 원본 위치에서 중앙으로 fly-in
  useEffect(() => {
    if (!image) return;

    // CSS 좌표계와 동일한 viewport 크기 (scrollbar 제외)
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;
    const maxW = vw * 0.9;
    const maxH = vh * 0.9;

    const ar = image.rect.width / image.rect.height;
    let tw = maxW;
    let th = maxW / ar;
    if (th > maxH) { tw = maxH * ar; th = maxH; }

    // 부모(flex center)에서 x=0, y=0 이 뷰포트 중앙
    // startX = 원본 이미지 중심 - 뷰포트 중심
    const startX = image.rect.left + image.rect.width / 2 - vw / 2;
    const startY = image.rect.top + image.rect.height / 2 - vh / 2;
    const startScale = image.rect.width / tw;

    dimsRef.current = { startX, startY, startScale };

    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setVisible(true);

    // 원본 위치에 즉시 배치 후 중앙으로 spring 애니메이션
    x.set(startX);
    y.set(startY);
    scale.set(startScale);
    backdropOpacity.set(0);

    animate(x, 0, SPRING);
    animate(y, 0, SPRING);
    animate(scale, 1, SPRING);
    animate(backdropOpacity, 0.75, { duration: 0.2 });
  }, [image?.src]);

  // 닫기: 중앙에서 원본 위치로 fly-out 후 언마운트
  const handleClose = useCallback(() => {
    const dims = dimsRef.current;
    if (!dims) { onClose(); return; }

    animate(backdropOpacity, 0, { duration: 0.15 });
    animate(x, dims.startX, SPRING);
    animate(y, dims.startY, SPRING);
    animate(scale, dims.startScale, SPRING).then(() => {
      setVisible(false);
      onClose();
    });
  }, [onClose, x, y, scale, backdropOpacity]);

  // ESC 닫기
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [handleClose]);

  // 이미지 클릭: 클릭 지점 기준으로 추가 확대
  const handleImageClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const cx = e.clientX - (rect.left + rect.width / 2);
    const cy = e.clientY - (rect.top + rect.height / 2);

    setZoom((prev) => {
      if (prev >= MAX_SCALE) {
        setOffset({ x: 0, y: 0 });
        animate(x, 0, SPRING);
        animate(y, 0, SPRING);
        animate(scale, 1, SPRING);
        return 1;
      }
      const newZoom = Math.min(prev * SCALE_STEP, MAX_SCALE);
      const factor = newZoom / prev - 1;
      const newOffsetX = offset.x - cx * factor;
      const newOffsetY = offset.y - cy * factor;
      setOffset({ x: newOffsetX, y: newOffsetY });
      animate(x, newOffsetX, SPRING);
      animate(y, newOffsetY, SPRING);
      animate(scale, newZoom, SPRING);
      return newZoom;
    });
  }, [x, y, scale, offset]);

  if (!visible || !image) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Dim 배경 */}
      <motion.div
        className="absolute inset-0 bg-black cursor-zoom-out"
        style={{ opacity: backdropOpacity }}
        onClick={handleClose}
      />

      {/* 이미지: flex로 중앙 배치, x/y는 중앙 기준 오프셋 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          ref={containerRef}
          className="relative pointer-events-auto cursor-zoom-in"
          style={{ x, y, scale }}
          onClick={handleImageClick}
        >
          {/* 닫기 버튼 */}
          <button
            className="absolute -top-3 -right-3 z-10 flex items-center justify-center w-7 h-7 rounded-full bg-white/90 text-gray-800 shadow-md hover:bg-white transition-colors cursor-pointer"
            onClick={(e) => { e.stopPropagation(); handleClose(); }}
            aria-label="닫기"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <img
            src={image.src}
            alt={image.alt ?? '확대된 이미지'}
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              width: 'auto',
              height: 'auto',
              display: 'block',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
            draggable={false}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default ImageZoomViewer;
