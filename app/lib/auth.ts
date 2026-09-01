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
    async jwt({ token, account }) {
      if (account?.profile) {
        const profile = account.profile as GitHubProfile;
        token.githubLogin = profile.login;
        token.githubId = profile.id;
        token.githubBio = profile.bio;
        token.githubCompany = profile.company;
        token.githubLocation = profile.location;
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
