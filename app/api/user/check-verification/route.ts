import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const user = await db.user.findUnique({
      where: { email },
      select: {
        verified: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "No user found with this email" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: { verified: user.verified } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking user verification:", error);
    return NextResponse.json(
      { success: false, message: "Error checking user verification" },
      { status: 500 }
    );
  }
}
