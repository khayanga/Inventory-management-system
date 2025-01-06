import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./db";
import { compare } from "bcrypt";
export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    session: {
        strategy: "jwt",
    },
    pages: {
        // signIn: "/signin",
        // signOut: "/auth/signout",
        // error: "/auth/error",
        // verifyRequest: "/auth/verify-request",
        // newUser: null,
    },

  providers: [
    CredentialsProvider({
        name: "Credentials",
        credentials: {
           email: { label: "Email", type: "text" },
            password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
            if (!credentials || !credentials.email || !credentials.password) {
                return null;
            }
            const existingUser = await db.user.findUnique({
                where: { email: credentials.email },
            });

            if (!existingUser) {
                return null;
            };

            const passwordMatch = await compare(credentials.password, existingUser.password);

            if (!passwordMatch) {
                return null;
            };

            return {
               id:`${existingUser.id}`,
               email:existingUser.email,
               password:existingUser.password,
            };
        }
    })
  ]
}
