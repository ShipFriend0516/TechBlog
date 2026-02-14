'use client';

import { useEffect, useRef } from 'react';
import useToast from '@/app/hooks/useToast';

const STORAGE_KEY = 'subscribe-toast-shown';

const SubscribeToast = () => {
  const toast = useToast();
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          sessionStorage.setItem(STORAGE_KEY, 'true');
          toast.info(
            '하단에서 이메일 구독을 신청하면 새 글이 올라올 때 알림을 받을 수 있어요.',
            {
              title: '글을 읽어주셔서 감사합니다!',
              duration: 10000,
            }
          );
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [toast]);

  return <div ref={sentinelRef} />;
};

export default SubscribeToast;
