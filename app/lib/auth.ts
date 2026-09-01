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
