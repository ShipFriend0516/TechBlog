'use client';
import { SessionProvider } from 'next-auth/react';
import { useEffect } from 'react';

interface AtelierLayoutProps {
  children: React.ReactNode;
}

// Atelier 는 퍼블릭 페이지이므로 ProtectedRoute 없이 SessionProvider 만 감싼다
const AtelierLayout = ({ children }: AtelierLayoutProps) => {
  useEffect(() => {
    document.body.classList.add('atelier-page');
    return () => {
      document.body.classList.remove('atelier-page');
    };
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
};

export default AtelierLayout;
