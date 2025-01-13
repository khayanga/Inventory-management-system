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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Card,
 
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link";
import { useLoadingState } from "./LoadingContext";
import Spinner from "./Spinner";



const Signup = () => {
  const router = useRouter();

  const {isLoading, setIsLoading} = useLoadingState();


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
    setIsLoading(true);
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
    finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }
  return (
    <Card  className="p-4 ">
      <CardHeader className="text-center">
          <CardTitle className="text-xl">Get started.</CardTitle>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}{...field}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role " />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Client">Client</SelectItem>
                    </SelectContent>
                  </Select>
                 
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full my-4 text-white" type="submit">Submit</Button>

          <div className="mt-2 text-center text-sm">
              {/* Don&apos;t have an account?{" "} */}
              Alreday have an account ? 
              <Link href="/signin" className="underline underline-offset-4 text-blue-500">
                Sign In
              </Link>
            </div>
        </form>
      </Form>

    </Card>
  )
};

export default Signup;



