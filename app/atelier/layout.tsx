'use client';
import { SessionProvider } from 'next-auth/react';

interface AtelierLayoutProps {
  children: React.ReactNode;
}

// Atelier 는 퍼블릭 페이지이므로 ProtectedRoute 없이 SessionProvider 만 감싼다
const AtelierLayout = ({ children }: AtelierLayoutProps) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default AtelierLayout;
