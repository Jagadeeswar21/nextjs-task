
import NextAuth, { SessionStrategy } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import User from '../../../../../models/schema';
import bcrypt from 'bcryptjs';
import { connectMongoDB } from '../../../../../lib/mongodb';

const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }
        const { email, password } = credentials;

        try {
          await connectMongoDB();
          const user = await User.findOne({ email });
          if (!user) {
            return null;
          }
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (!passwordMatch) {
            return null;
          }
          return user;
        } catch (error) {
          console.error(error);
          return null;
        }
      }
    }),
  ],
  callbacks: {
    async session({ session, token }:{session:any, token:any}) {
      session.user.role = token.role
      return session;
    },
    async jwt({ token, user }:{ token: any; user?: any }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
  },
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
};

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
