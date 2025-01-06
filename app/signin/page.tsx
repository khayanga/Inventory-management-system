"use client";
import React from 'react'
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm, FieldError } from "react-hook-form";
import { useRouter } from 'next/navigation';


const page = () => {
    interface FormData {
        email: string;
        password: string;
    }

    const userSchema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
    });

    const { register, handleSubmit, reset, setError, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(userSchema),
    });
     
    const router = useRouter();
    
    const onSubmit = async (data: FormData): Promise<void> => {
        try {
            const response = await axios.post("/api/user/login", data);
            console.log(response.data, "User logged in successfully");

            router.push("/");
           
            reset();
        } catch (error: any) {
            if (error.response?.data?.field) {
                setError(error.response.data.field as keyof FormData, {
                    type: "server",
                    message: error.response.data.message,
                });
            } else {
                console.error(error);
            }
        }
    };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className='bg-slate-400 flex flex-col gap-4 p-8 rounded-lg max-w-sm mx-auto mt-16'>
        {errors.email && <p className='text-red-500'>{errors.email.message}</p>}
        {errors.password && <p className='text-red-500'>{errors.password.message}</p>}
        <input className='text-black' {...register('email')} placeholder='Email'/>
        <input className='text-black' {...register('password')} placeholder='Password'/>
        <button type='submit' className='bg-blue-500 text-white p-2 rounded-md'>Sign In</button>    
    </form>
  )
}

export default page