import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function getCurrentUser(req: Request) {
  const token = await getToken({
    req: req as any, 
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) return null;

  return {
    id: token.id,
    username: token.username,
    role: token.role,
    militaryId: token.militaryId,
    rank: token.rank,
  };
}
