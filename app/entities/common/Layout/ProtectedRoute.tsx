'use client';
import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const session = useSession();

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      alert('로그인이 필요합니다.');
      signIn();
    }
  }, [session]);

  return <>{children}</>;
};

export default ProtectedRoute;
