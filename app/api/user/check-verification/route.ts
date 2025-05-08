

import { db } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { militaryId } = await req.json();

    if (!militaryId) {
      return NextResponse.json(
        { success: false, message: "Military ID is required" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { militaryId },
      select: { verified: true }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Military ID not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      verified: user.verified
    });

  } catch (error) {
    console.error("Verification check error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}