// NextAuth 설정 — API 라우트(app/api/auth/[...nextauth])와
// 서버 컴포넌트/라우트 핸들러(getServerSession(authOptions))에서 공유한다.
import { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

interface GitHubProfile {
  login: string;
  id: number;
  name?: string;
  email?: string;
  bio?: string;
  company?: string;
  location?: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      // GitHub이 2026-04부터 OAuth 콜백에 RFC 9207 iss 파라미터를 포함시키기 시작했다.
      // next-auth(openid-client)는 iss가 오면 issuer 설정값과 대조하는데, 이게 없으면
      // "issuer must be configured on the issuer" 에러로 로그인 콜백이 실패한다.
      issuer: 'https://github.com/login/oauth',
    }),
  ],
  callbacks: {
    async signIn() {
      return true;
    },
    async jwt({ token, profile }) {
      // next-auth의 GitHub OAuth 플로우는 원본 프로필을 account가 아니라
      // 이 콜백의 별도 인자(profile)로 전달한다 (로그인 시점에만 존재).
      if (profile) {
        const githubProfile = profile as unknown as GitHubProfile;
        token.githubLogin = githubProfile.login;
        token.githubId = githubProfile.id;
        token.githubBio = githubProfile.bio;
        token.githubCompany = githubProfile.company;
        token.githubLocation = githubProfile.location;
      }
      return token;
    },
    async session({ session, token }) {
      const adminGithubId = process.env.ADMIN_GITHUB_ID;
      session.isAdmin =
        !!adminGithubId &&
        !!token.githubId &&
        String(token.githubId) === adminGithubId;

      if (session.user) {
        if (token.githubId) {
          session.user.id = String(token.githubId);
        }
        if (token.githubLogin) {
          session.user.githubLogin = token.githubLogin;
        }
      }

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
