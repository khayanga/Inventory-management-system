import { db } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid request body" },
        { status: 400 }
      );
    }

    const { militaryId, otp } = body;

    if (!militaryId || !otp) {
      return NextResponse.json(
        { success: false, message: "Military ID and OTP are required" },
        { status: 400 }
      );
    }

    // Find user with matching OTP
    const user = await db.user.findUnique({
      where: { militaryId },
      include: {
        otps: {
          where: { otp },
          take: 1,
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (user.otps.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid OTP" },
        { status: 400 }
      );
    }

    const otpRecord = user.otps[0];

    if (!otpRecord.expiresAt || new Date(otpRecord.expiresAt) < new Date()) {
      return NextResponse.json(
        { success: false, message: "OTP has expired" },
        { status: 400 }
      );
    }

    // Transaction: verify user + clear OTPs
    await db.$transaction([
      db.user.update({
        where: { id: user.id },
        data: { verified: true },
      }),
      db.otp.deleteMany({
        where: { userId: user.id },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Account verified successfully",
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
