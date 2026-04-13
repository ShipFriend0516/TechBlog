'use client';
import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// 관리자 이메일과 일치하는 세션만 자식 콘텐츠 렌더링
// NextAuth signIn 콜백이 모든 GitHub 사용자를 허용하도록 변경되었기 때문에,
// 세션 존재 여부만 체크하면 비관리자도 통과할 수 있다. 반드시 email 까지 검사.
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const session = useSession();
  // NEXT_PUBLIC_ADMIN_EMAIL 가 없는 경우 대비해 NextAuth 의 서버 환경변수를 노출하지 않고 비교
  // 클라이언트 측에서는 NEXT_PUBLIC_ADMIN_EMAIL 을 사용해야 한다.
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const userEmail = session.data?.user?.email ?? null;
  const isAdmin = !!adminEmail && userEmail === adminEmail;

  useEffect(() => {
    if (session.status === 'loading') return;

    if (session.status === 'unauthenticated') {
      alert('로그인이 필요합니다.');
      signIn();
      return;
    }

    // 세션은 있지만 관리자 이메일과 일치하지 않는 경우
    if (session.status === 'authenticated' && !isAdmin) {
      alert('관리자만 접근할 수 있습니다.');
      // 루트로 이동 (히스토리 대체)
      if (typeof window !== 'undefined') {
        window.location.replace('/');
      }
    }
  }, [session.status, isAdmin]);

  // 관리자 확인 전까지는 콘텐츠 비노출
  if (session.status !== 'authenticated' || !isAdmin) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
