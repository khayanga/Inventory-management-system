import { z } from 'zod'
export const SignupFormSchema = z.object({
  militaryId: z.string(),
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
  rank: z.string(),
});
 

export const SigInFormSchema = z.object({ 
 militaryId: z.string(),
 password: z.string(),
  })
 
  export type FormState = {
    errors?: {
      militaryId?: string[];
      username?: string[];
      email?: string[];
      password?: string[];
      rank?: string[];
      general?: string[];
    };
    fieldValues?: {
      militaryId?: string;
      username?: string;
      email?: string;
      rank?: string;
    };
    success?: boolean;
    message?: string;
    militaryId?: string;
    email?: string; 
  };

  