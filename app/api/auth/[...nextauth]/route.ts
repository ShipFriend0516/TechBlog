import NextAuth, { Session } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

interface AtelierSession extends Session {
  isAdmin?: boolean;
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
    async session({ session }) {
      (session as AtelierSession).isAdmin =
        session.user?.email === process.env.ADMIN_EMAIL;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
