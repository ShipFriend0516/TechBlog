'use client';
import { SessionProvider } from 'next-auth/react';
import { useEffect } from 'react';

interface AtelierClientLayoutProps {
  children: React.ReactNode;
}

const AtelierClientLayout = ({ children }: AtelierClientLayoutProps) => {
  useEffect(() => {
    document.body.classList.add('atelier-page');
    return () => {
      document.body.classList.remove('atelier-page');
    };
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
};

export default AtelierClientLayout;
