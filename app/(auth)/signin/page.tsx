"use client";

import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const Page = () => {
  const userSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
  });

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<{ email: string; password: string }>({
    resolver: zodResolver(userSchema),
  });

  const router = useRouter();

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });
      

      if (result?.error) {
        setError("email", { type: "manual", message: result.error });
        return;
      }

      router.push("/admin"); // Redirect to home on success
      console.log(result)
      reset();
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-slate-400 flex flex-col gap-4 p-8 rounded-lg max-w-sm mx-auto mt-16"
    >
      {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      {errors.password && <p className="text-red-500">{errors.password.message}</p>}
      <input
        type="email"
        className="text-black p-2 rounded-md"
        {...register("email")}
        placeholder="Email"
      />
      <input
        type="password"
        className="text-black p-2 rounded-md"
        {...register("password")}
        placeholder="Password"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
        Sign In
      </button>
    </form>
  );
};

export default Page;
