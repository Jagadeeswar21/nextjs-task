
import NextAuth, { SessionStrategy } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import User from '../../../../../models/schema';
import bcrypt from 'bcryptjs';
import { connectMongoDB } from '../../../../../lib/mongodb';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
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
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,

    })
  ],
  callbacks: {
    async signIn({user, account, profile }:any) {
      if ((account?.provider === 'google' || account?.provider === 'github') ) {
        try {
          await connectMongoDB();
          let dbUser = await User.findOne({ email: profile.email });
          if (!dbUser) {
            console.log("Creating new user", profile.email);
            dbUser = await User.create({
              name: profile.name || 'user',
              email: profile.email,
              password: null,
              status: 'active',
              roles: ['user'],
              isDeleted: false,
              provider:account.provider,
              providerId: profile.sub || profile.id,
            });
          }
          else {
            dbUser.providerId = profile.sub || profile.id;
            await dbUser.save();
          }
          user._id = dbUser._id;
        } catch (error) {
          console.error(`Error during ${account.provider} Sign-In:`, error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }: any) {
      if (user) {
        token.sub = user._id?  user._id.toString() :user.id;
        token.roles = user.roles;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async redirect({ url, baseUrl }: any) {
      return url.startsWith(baseUrl) ? `${baseUrl}/dashboard` : baseUrl;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.sub;
        session.user.roles = token.roles;
        session.user.name = token.name;
        session.user.email = token.email;
      }
      return session;
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
