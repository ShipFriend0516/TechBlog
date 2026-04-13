// 관리자 세션 판별 공용 헬퍼
// NextAuth signIn 콜백이 모든 GitHub 사용자를 허용하도록 완화되었으므로,
// 각 API 라우트에서 관리자 권한이 필요한 경우 반드시 이 헬퍼로 재검증해야 한다.
import { Session } from 'next-auth';

export const isAdminSession = (session: Session | null): boolean =>
  session?.user?.email === process.env.ADMIN_EMAIL;
