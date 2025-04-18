'use client';
import useFingerprintStore from '@/app/stores/useFingerprintStore';
import { useEffect } from 'react';

const useFingerprint = () => {
  const { fingerprint, initialize, isLoading, error } = useFingerprintStore();

  useEffect(() => {
    // 핑거프린트 생성
    initialize();
  }, [initialize]);

  return { fingerprint, isLoading, error };
};

export default useFingerprint;
