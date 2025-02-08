import { z } from 'zod'
 
export const SignupFormSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters').refine(
    (pwd) => /[A-Z]/.test(pwd) && /[0-9]/.test(pwd),
    'Password must contain at least one uppercase letter and one number'
  ),
})

export const SigInFormSchema = z.object({
   
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters').refine(
    (pwd) => /[A-Z]/.test(pwd) && /[0-9]/.test(pwd),
    'Password must contain at least one uppercase letter and one number'
  ),
  })
 
export type FormState =
  | {
      errors?: {
        name?: string[]
        email?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined


  