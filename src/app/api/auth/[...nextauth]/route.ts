
import NextAuth, { SessionStrategy } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import User from '../../../../../models/schema';
import bcrypt from 'bcryptjs';
import { connectMongoDB } from '../../../../../lib/mongodb';
import GoogleProvider from 'next-auth/providers/google';
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
  ],
  callbacks: {
    async signIn({ account, profile }:any) {
      if (account.provider === 'google' && profile?.email) {
        try {
          await connectMongoDB();
          let user = await User.findOne({ email: profile.email });
          if (!user) {
            console.log("Creating new user", profile.email);
            user = await User.create({
              name: profile.name || 'Google User',
              email: profile.email,
              password: null,
              status: 'active',
              role: 'user',
              isDeleted: false,
              provider:'google',
            });
          } 
          else {
            // Update existing user with name from Google
            user.name = profile.name;
            await user.save();
          }
          return true;
        } catch (error) {
          console.error('Error during Google Sign-In:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }:any) {
      if (user) {
        token.sub= user._id;
        token.role = user.role;
        token.name = user.name; 
        token.email = user.email;
      }
      return token;
    },
    async redirect({ url, baseUrl }:any) {
      return url.startsWith(baseUrl) ? `${baseUrl}/dashboard` : baseUrl;
    },
    async session({ session, token }:any) {
      if (token) {
        session.user.id = token.sub;
        session.user.role = token.role;
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
