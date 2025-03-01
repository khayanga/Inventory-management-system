"use server"
import { FormState, SignupFormSchema } from "@/app/lib/definition"
import { db } from "@/app/lib/db"
import { hash } from "bcryptjs";

import { redirect } from "next/navigation";
import { generateOtp } from "../lib/otp";
import { sendOtp } from "../lib/nodemailer";



export async function signup(state: FormState, formData: FormData) {
  const validatedFields = SignupFormSchema.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { username, email, password } = validatedFields.data;
  const hashedPassword = await hash(password, 10);

  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return {
      errors: { email: ["User with this email already exists"] },
    };
  }

  const user = await db.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
    select: { id: true, email: true },
  });

  if (!user) {
    return {
      message: "An error occurred while creating your account.",
    };
  }

  // Generate OTP
  const otp = generateOtp();
  await db.otp.create({
    data: {
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min expiry
      userId: user.id,
    },
  });

  
  await sendOtp(email, otp);

 
  return {
    success: true,
    message: "User created successfully."
  };
}


// export async function logout() {
//   deleteSession()
//   redirect('/signin')
// }

