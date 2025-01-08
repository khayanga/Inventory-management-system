import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import * as z from "zod";
import { generateOtp } from "@/lib/otp";
import { sendOtp } from "@/lib/nodemailer";

// Define schema for form validation using zod
const userSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(6),
  role: z.enum(["Admin", "Client"]).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Ensure that the body is a valid object
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, message: "Invalid or empty request body" },
        { status: 400 }
      );
    }

    const { email, username, password, role } = userSchema.parse(body);

    if (!email || !username || !password || !role) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const existingUserByEmail = await db.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        { field: "email", message: "User with this email already exists" },
        { status: 409 }
      );
    }

    const existingUserByName = await db.user.findUnique({
      where: { username },
    });

    if (existingUserByName) {
      return NextResponse.json(
        { field: "username", message: "User with this name already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await db.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        role,
        verified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Generate OTP
    const otp = generateOtp();

    // Store OTP in the database
    await db.otp.create({
      data: {
        otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // Expires in 10 minutes
        userId: newUser.id,
      },
    });

    // Send OTP via email
    try {
      await sendOtp(email, otp);
    } catch (error) {
      console.error("Error sending OTP:", error);
      return NextResponse.json(
        { success: false, message: "Failed to send OTP. Please try again." },
        { status: 500 }
      );
    }

    // Fetch the user's OTP from the database
    const userOtp = await db.otp.findFirst({
      where: { userId: newUser.id },
      select: { otp: true, expiresAt: true },
    });

    if (!userOtp) {
      console.error("OTP not found for user:", newUser.id);
      return NextResponse.json(
        { success: false, message: "Failed to retrieve OTP" },
        { status: 500 }
      );
    }

    const { password: newUserPassword, ...rest } = newUser;

    return NextResponse.json(
      {
        user: {
          ...rest,
          otp: userOtp.otp,
          otpExpiresAt: userOtp.expiresAt,
        },
        message: "User created successfully. Check your email for the OTP.",
      },
      { status: 201 }
    );
  } catch (error) {
    // Check if the error is an instance of Error
    if (error instanceof Error) {
      console.error("User could not be registered:", error.message);
    } else {
      console.error("An unexpected error occurred:", error);
    }

    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}







