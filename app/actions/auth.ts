import { FormState, SignupFormSchema } from "@/lib/definition"
import { db } from "@/lib/db"
import { hash } from "bcrypt";
import { createSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function signup(state: FormState, formData: FormData) {
  // Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    username: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  })
 
  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }
 
  const { username, email, password } = validatedFields.data
  // e.g. Hash the user's password before storing it
  const hashedPassword = await hash(password, 10);
 
  // 3. Insert the user into the database or call an Auth Library's API
  const data = await db.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      verified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    },
    select: {
      id: true,
    },
  })
 
  const user = data
 
  if (!user) {
    return {
      message: 'An error occurred while creating your account.',
    }
  }

  await createSession(user.id.toString())
  // 5. Redirect user
  redirect('/admin')
}

export async function signin(formData:FormData){}