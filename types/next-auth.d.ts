// types/next-auth.d.ts
import { MilitaryRank, Role } from "@prisma/client";
import { DefaultUser, DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    militaryId: string;
    email: string;
    username: string;
    role: Role;
    rank: MilitaryRank;
    verified: boolean;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      militaryId: string;
      email: string;
      username: string;
      role: Role;
      rank: MilitaryRank;
      verified: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    militaryId: string;
    email: string;
    username: string;
    role: Role;
    rank: MilitaryRank;
    verified: boolean;
  }
}
