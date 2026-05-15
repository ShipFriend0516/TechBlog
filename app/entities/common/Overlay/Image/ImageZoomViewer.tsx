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

const ImageZoomViewer = ({ image, onClose }: ImageZoomViewerProps) => {
  const [visible, setVisible] = useState(false);
  const [prevSrc, setPrevSrc] = useState<string | null>(null);

  const currentSrc = image?.src ?? null;
  if (prevSrc !== currentSrc && currentSrc !== null) {
    setPrevSrc(currentSrc);
    setVisible(true);
  }

  const containerRef = useRef<HTMLDivElement>(null);
  const dimsRef = useRef<{ startX: number; startY: number; startScale: number } | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const backdropOpacity = useMotionValue(0);

  useEffect(() => {
    if (!image) return;

    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;
    const maxW = vw * 0.9;
    const maxH = vh * 0.9;

    const ar = image.rect.width / image.rect.height;
    let tw = maxW;
    let th = maxW / ar;
    if (th > maxH) { tw = maxH * ar; th = maxH; }

    const startX = image.rect.left + image.rect.width / 2 - vw / 2;
    const startY = image.rect.top + image.rect.height / 2 - vh / 2;
    const startScale = image.rect.width / tw;

    dimsRef.current = { startX, startY, startScale };

    x.set(startX);
    y.set(startY);
    scale.set(startScale);
    backdropOpacity.set(0);

    animate(x, 0, SPRING);
    animate(y, 0, SPRING);
    animate(scale, 1, SPRING);
    animate(backdropOpacity, 0.75, { duration: 0.2 });
  }, [image?.src]);

  const handleClose = useCallback(() => {
    const dims = dimsRef.current;
    if (!dims) { onClose(); return; }

    animate(backdropOpacity, 0, { duration: 0.15 });
    animate(x, dims.startX, SPRING);
    animate(y, dims.startY, SPRING);
    animate(scale, dims.startScale, SPRING).then(() => {
      setVisible(false);
      setPrevSrc(null);
      onClose();
    });
  }, [onClose, x, y, scale, backdropOpacity]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [handleClose]);

  if (!visible || !image) return null;

  return (
    <div className="fixed inset-0 z-50">
      <motion.div
        className="absolute inset-0 bg-black cursor-zoom-out"
        style={{ opacity: backdropOpacity }}
        onClick={handleClose}
      />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          ref={containerRef}
          className="relative pointer-events-auto"
          style={{ x, y, scale }}
        >
          <button
            className="absolute -top-3 -right-3 z-10 flex items-center justify-center w-7 h-7 rounded-full bg-white/90 text-gray-800 shadow-md hover:bg-white transition-colors cursor-pointer"
            onClick={handleClose}
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
