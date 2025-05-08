"use server";
import { FormState, SignupFormSchema } from "@/app/lib/definition";
import { db } from "@/app/lib/db";
import { hash } from "bcryptjs";
import { generateOtp } from "../lib/otp";
import { sendOtp } from "../lib/nodemailer";
import { MilitaryRank, Role } from "@prisma/client";

export async function signup(state: FormState, formData: FormData): Promise<FormState> {
  // 1. Validate Input
  const validatedFields = SignupFormSchema.safeParse({
    militaryId: formData.get("militaryId"),
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    rank: formData.get("rank"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      fieldValues: {
        militaryId: formData.get("militaryId")?.toString(),
        username: formData.get("username")?.toString(),
        email: formData.get("email")?.toString(),
        rank: formData.get("rank")?.toString(),
      }
    };
  }

  const { militaryId, username, email, password, rank } = validatedFields.data;

  try {
    // 2. Check for existing user in transaction
    const existingUser = await db.$transaction(async (tx) => {
      return await tx.user.findFirst({
        where: {
          OR: [{ email }, { militaryId }]
        }
      });
    });

    if (existingUser) {
      const errors: Partial<Record<keyof typeof validatedFields.data, string[]>> = {};
      if (existingUser.email === email) errors.email = ["Email already exists"];
      if (existingUser.militaryId === militaryId) errors.militaryId = ["Military ID already registered"];
      return { 
        errors,
        fieldValues: { militaryId, username, email, rank }
      };
    }

    // 3. Create user and OTP in single transaction
    const result = await db.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          militaryId,
          username,
          email: email.toLowerCase(), // Normalize email
          password: await hash(password, 12), // Stronger hashing
          rank: rank as MilitaryRank,
          role: "DUTY_OFFICER" as Role,
          verified: false,
        },
        select: { id: true, email: true }
      });

      // Generate and store OTP
      const otp = generateOtp();
      await tx.otp.create({
        data: {
          otp,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
          userId: user.id,
        }
      });

      return { user, otp };
    });

    // 4. Send OTP (outside transaction)
    await sendOtp(result.user.email, result.otp);

    return {
      success: true,
      militaryId,  
      email,  
      message: "Account created. Please check your email for verification OTP.",
    };

  } catch (error) {
    console.error("Signup error:", error);
    return {
      errors: { 
        general: ["An unexpected error occurred. Please try again later."] 
      },
      fieldValues: { militaryId, username, email, rank }
    };
  }
}



