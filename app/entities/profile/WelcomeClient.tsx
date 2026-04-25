'use client';
import { useEffect } from 'react';
import useFingerprint from '@/app/hooks/useFingerprint';
import useToast from '@/app/hooks/useToast';

const WelcomeClient = () => {
  const { fingerprint } = useFingerprint();
  const toast = useToast();

  useEffect(() => {
    if (fingerprint) {
      toast.success('다시 오신 것을 환영합니다!');
    }
  }, [fingerprint]);

  return null;
};

export default WelcomeClient;
