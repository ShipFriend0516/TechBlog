'use client';
import { useEffect } from 'react';
import useFingerprintStore from '@/app/stores/useFingerprintStore';

const useFingerprint = () => {
  const { fingerprint, initialize, isLoading, error } = useFingerprintStore();

  useEffect(() => {
    // 핑거프린트 생성
    initialize();
  }, [initialize]);

  return { fingerprint, isLoading, error };
};

export default useFingerprint;
