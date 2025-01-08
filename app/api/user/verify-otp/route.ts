import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    // Find the user by email
    const user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
        verified: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "No user found with this email" },
        { status: 404 }
      );
    }

    // User already verified
    if (user.verified) {
      return NextResponse.json(
        { success: false, message: "User already verified" },
        { status: 400 }
      );
    }

    // Fetch the OTP associated with the user
    const userOtp = await db.otp.findFirst({
      where: { userId: user.id },
      select: { otp: true, expiresAt: true },
    });

    if (!userOtp) {
      return NextResponse.json(
        { success: false, message: "No OTP found for this user" },
        { status: 404 }
      );
    }

    // Check if the provided OTP matches
    if (userOtp.otp !== otp) {
      return NextResponse.json(
        { success: false, message: "Invalid OTP" },
        { status: 400 }
      );
    }

    // Check if OTP has expired
    if (new Date(userOtp.expiresAt) < new Date()) {
      return NextResponse.json(
        { success: false, message: "OTP has expired" },
        { status: 400 }
      );
    }

    // Update the user as verified and remove the OTP
    await db.user.update({
      where: { email },
      data: { verified: true },
    });

    // Delete the OTP record after successful verification
    await db.otp.deleteMany({
      where: { userId: user.id },
    });

    return NextResponse.json(
      { success: true, message: "User verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying user:", error);
    return NextResponse.json(
      { success: false, message: "Error verifying user" },
      { status: 500 }
    );
  }
}

