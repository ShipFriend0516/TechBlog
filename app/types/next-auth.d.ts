// next-auth 기본 타입 확장
// GitHub 프로필 정보와 관리자 판별 플래그를 Session/JWT에 추가한다.
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    isAdmin?: boolean;
    user?: {
      id?: string;
      githubLogin?: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    githubLogin?: string;
    githubId?: number;
    githubBio?: string;
    githubCompany?: string;
    githubLocation?: string;
  }
}
