'use client';
import { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import GithubLogin from '@/app/entities/common/Button/GithubLogin';

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
