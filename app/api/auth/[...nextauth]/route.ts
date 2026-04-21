import NextAuth, { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import GithubProvider from 'next-auth/providers/github';

interface AtelierSession extends Session {
  isAdmin?: boolean;
}

interface AtelierJWT extends JWT {
  githubLogin?: string;
  githubId?: number;
  githubBio?: string;
  githubCompany?: string;
  githubLocation?: string;
}

interface GitHubProfile {
  login: string;
  id: number;
  name?: string;
  email?: string;
  bio?: string;
  company?: string;
  location?: string;
}

const handler = NextAuth({
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
    async jwt({ token, account }): Promise<AtelierJWT> {
      if (account?.profile) {
        const profile = account.profile as GitHubProfile;
        token.githubLogin = profile.login;
        token.githubId = profile.id;
        token.githubBio = profile.bio;
        token.githubCompany = profile.company;
        token.githubLocation = profile.location;
      }
      return token as AtelierJWT;
    },
    async session({ session, token }): Promise<AtelierSession> {
      const jwtToken = token as AtelierJWT;
      (session as AtelierSession).isAdmin =
        session.user?.email === process.env.ADMIN_EMAIL;
      if (jwtToken.githubLogin) {
        (session.user as { githubLogin?: string }).githubLogin =
          jwtToken.githubLogin;
      }
      return session as AtelierSession;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
