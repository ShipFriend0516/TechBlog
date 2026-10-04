'use client';
import { useEffect } from 'react';
import useToast from '@/app/hooks/useToast';
import useFingerprintStore from '@/app/stores/useFingerprintStore';

const WelcomeClient = () => {
  // 필요한 값만 구독 — isLoading/error 변화로는 리렌더링되지 않음
  const fingerprint = useFingerprintStore((state) => state.fingerprint);
  const initialize = useFingerprintStore((state) => state.initialize);
  const toast = useToast();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (fingerprint) {
      toast.success('다시 오신 것을 환영합니다!');
    }
  }, [fingerprint]);

  return null;
};

export default WelcomeClient;
