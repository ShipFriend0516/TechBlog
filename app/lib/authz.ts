// 관리자 세션 판별 공용 헬퍼
// NextAuth signIn 콜백이 모든 GitHub 사용자를 허용하도록 완화되었으므로,
// 각 API 라우트에서 관리자 권한이 필요한 경우 반드시 이 헬퍼로 재검증해야 한다.
// 관리자 여부는 GitHub id(ADMIN_GITHUB_ID) 기준으로 판정하며,
// 실제 판정 로직은 app/lib/auth.ts의 session 콜백에서 session.isAdmin 에 계산해 둔다.
import { getServerSession, Session } from 'next-auth';
import { authOptions } from '@/app/lib/auth';

// 현재 요청의 세션 조회 (authOptions 포함 — isAdmin/githubLogin 등 커스텀 필드 포함)
export const getSession = (): Promise<Session | null> =>
  getServerSession(authOptions);

export const isAdminSession = (session: Session | null): boolean =>
  session?.isAdmin === true;

// 관리자 전용 라우트에서: 관리자면 세션을, 아니면 null을 반환한다.
export const getAdminSession = async (): Promise<Session | null> => {
  const session = await getSession();
  return isAdminSession(session) ? session : null;
};
