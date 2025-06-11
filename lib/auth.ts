import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./db";
import { compare } from "bcryptjs";


export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 60 * 30,
  },
  jwt: {
    maxAge: 60 * 30,
  },
  pages: {
    signIn: "/",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        militaryId: { label: "MilitaryId", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.militaryId|| !credentials?.password) {
          throw new Error("Please enter your email and password.");
        }

        const existingUser = await db.user.findUnique({
          where: { militaryId: credentials.militaryId },
        });

        if (!existingUser) {
          throw new Error("No user found .");
        }

        const passwordMatch = await compare(credentials.password, existingUser.password);

        if (!passwordMatch) {
          throw new Error("Invalid password.");
        }

        return {
          id: `${existingUser.id}`,
          email: existingUser.email,
          username: existingUser.username,
          role: existingUser.role,
          militaryId: existingUser.militaryId,
          verified: existingUser.verified,
          rank: existingUser.rank, 
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return { 
          ...token,
          id: user.id,
          username: user.username, 
          role: user.role, 
          militaryId: user.militaryId,  // Added
          rank: user.rank,  
          exp: Math.floor(Date.now() / 1000) + 60 * 30,
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          username: token.username,
          role: token.role, 
          militaryId: token.militaryId, // Added
          rank: token.rank,
        },

        expires: new Date((token as any).exp * 1000).toISOString(),
      };
    },
  },
};

