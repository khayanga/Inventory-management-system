import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import * as z from "zod";

// Define schema for form validation using zod
const userSchema = z.object({
    email: z.string().email(),
    username: z.string().min(3),
    password: z.string().min(6),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, username, password } = userSchema.parse(body);

        if (!email || !username || !password) {
            return NextResponse.json(
                { success: false, message: "All fields are required" },
                { status: 400 }
            );
        }

        // Check if the email exists
        const existingUserByEmail = await db.user.findUnique({
            where: { email },
        });

        if (existingUserByEmail) {
            return NextResponse.json(
                { field: "email", message: "User with this email already exists" },
                { status: 409 }
            );
        }

        // Check if the username exists
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

        // Insert new user into the database
        const newUser = await db.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
                createdAt: new Date(),
                updateAt: new Date(),
            },
        });

        const { password: newUserPassword, ...rest } = newUser;

        // Return success response with user details and timestamps
        return NextResponse.json(
            { user: rest, message: "User created successfully" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error occurred in POST handler:", error);
        return NextResponse.json(
            { success: false, message: "Something went wrong" },
            { status: 500 }
        );
    }
}
