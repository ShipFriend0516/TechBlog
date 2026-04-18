'use client';
import { useEffect, useRef, useState } from 'react';
import Toast from '@/app/entities/common/Toast/Toast';
import useToastStore from '@/app/stores/useToastStore';

const MAX_VISIBLE = 3;
const PEEK_OFFSET = 14;
const SCALE_STEP = 0.06;

const ToastProvider = () => {
  const { toasts, removeToast } = useToastStore();
  const [frontHeight, setFrontHeight] = useState(64);
  const frontRef = useRef<HTMLDivElement>(null);

  const visibleToasts = toasts.slice(0, MAX_VISIBLE);

  useEffect(() => {
    const el = frontRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setFrontHeight(el.offsetHeight));
    ro.observe(el);
    setFrontHeight(el.offsetHeight);
    return () => ro.disconnect();
  }, [visibleToasts[0]?.id]);

  if (visibleToasts.length === 0) return null;

  const containerHeight = frontHeight + (visibleToasts.length - 1) * PEEK_OFFSET;

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md"
      style={{ height: containerHeight }}
    >
      {visibleToasts.map((toast, index) => (
        <div
          key={toast.id}
          ref={index === 0 ? frontRef : undefined}
          className="absolute bottom-0 left-0 right-0 transition-all duration-300 origin-bottom"
          style={{
            transform: `translateY(${-index * PEEK_OFFSET}px) scale(${1 - index * SCALE_STEP})`,
            opacity: 1 - index * 0.12,
            zIndex: MAX_VISIBLE - index,
          }}
        >
          <Toast
            removeToast={() => removeToast(toast.id)}
            message={toast.message}
            title={toast.title}
            type={toast.type}
          />
        </div>
      ))}
    </div>
  );
};

export default ToastProvider;
