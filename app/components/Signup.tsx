"use client";

import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm, FieldError } from "react-hook-form";

const Signup = () => {
  // Specify the form data type
  interface FormData {
    email: string;
    username: string;
    password: string;
  }

  // Validate the form data
  const userSchema = z.object({
    email: z.string().email(),
    username: z.string().min(3),
    password: z.string().min(6),
  });

  const { register, handleSubmit, reset, setError, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = async (data: FormData): Promise<void> => {
    try {
      const response = await axios.post("/api/user", data);
      console.log(response.data, "User created successfully");
      // Clear the form
      reset();
    } catch (error: any) {
      if (error.response?.data?.field) {
        // Set the error on the corresponding field
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-slate-400 flex flex-col gap-4 p-8 rounded-lg max-w-sm mx-auto"
    >
      {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      {errors.username && <p className="text-red-500">{errors.username.message}</p>}
      {errors.password && <p className="text-red-500">{errors.password.message}</p>}

      <input
        className="text-black"
        {...register("email")}
        placeholder="Email"
      />
      <input
        className="text-black"
        {...register("username")}
        placeholder="Username"
      />
      <input
        className="text-black"
        {...register("password")}
        placeholder="Password"
        type="password"
      />
      <button className="bg-blue-800 text-white p-2 rounded-full" type="submit">
        Submit
      </button>
    </form>
  );
};

export default Signup;



