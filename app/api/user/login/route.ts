import { db } from "@/app/lib/db";
import { NextResponse } from "next/server";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import * as z from "zod";
import { serialize } from "cookie";

const secret = process.env.JWT_SECRET || "your-secret-key";


// Define schema for form validation using zod
const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = userSchema.parse(body);

    // Ensure email and password are provided
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if the user exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      return NextResponse.json(
        { field: "email", message: "User with this email does not exist" },
        { status: 404 }
      );
    }

    // Check if the password matches
    const passwordMatch = await compare(password, existingUser.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { field: "password", message: "Invalid password" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = sign({ userId: existingUser.id }, secret, {
      expiresIn: "7d", // Token expiry time
    });

    // Serialize the token into a cookie
    const cookie = serialize("token", token, {
      httpOnly: true, // Prevents access from JavaScript
      secure: process.env.NODE_ENV === "production", // Only secure cookies in production
      sameSite: "strict", // CSRF protection
      path: "/", // The cookie will be accessible on all pages
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    });

    // Set the cookie in the response headers
    const response = NextResponse.json(
      { user: existingUser, token, message: "Login successful" },
      { status: 200 }
    );
    response.headers.set("Set-Cookie", cookie);

    return response;
  } catch (error) {
    console.error("Error occurred during login:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
};
