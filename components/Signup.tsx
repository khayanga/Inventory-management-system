"use client";

import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm, FieldError } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"



const Signup = () => {
  const router = useRouter();


  // Define the schema for form validation
  const userSchema = z.object({
    email: z.string().email("Invalid email address"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z
      .string()
      .optional()
      .refine((role) => role === undefined || ["Admin", "Client"].includes(role), {
        message: "Invalid role",
      }),
  });

  // Define the form data type
  type FormData = z.infer<typeof userSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      role: "Client",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await axios.post("/api/user", data);
      console.log(response.data, "User created successfully");
      router.push("/signin"); // Redirect to sign-in page
      form.reset(); // Reset the form
    } catch (error: any) {
      if (error.response?.data?.field) {
        form.setError(error.response.data.field as keyof FormData, {
          type: "server",
          message: error.response.data.message,
        });
      }
    }
  };
  return (
    <Card className="p-4 max-w-sm mx-auto">
      <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Sign up to create your account.
          </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <select className="text-black" {...field}>
                    <option value="Admin">Admin</option>
                    <option value="Client">Client</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>

    </Card>
  )
};

export default Signup;



