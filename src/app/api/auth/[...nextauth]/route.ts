import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "../../../../../models/schema";
import bcrypt from "bcryptjs";
import { connectMongoDB } from "../../../../../lib/mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

interface Credentials {
  email: string;
  password: string;
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials) {
        console.log(credentials);
        if (!credentials) {
          return null;
        }
        const { email, password } = credentials as Credentials;
        console.log(email, password);
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
          console.log(error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      console.log(baseUrl);
      return baseUrl;
    },
  },
};

const handler = (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, authOptions);

export { handler as GET, handler as POST };
