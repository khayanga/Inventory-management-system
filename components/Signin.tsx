"use client";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLoadingState } from "@/components/LoadingContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const userSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

type FormData = z.infer<typeof userSchema>;

const Signin = ({ onOtpRequired }: { onOtpRequired: (email: string) => void }) => {
  const { isLoading, setIsLoading } = useLoadingState();
  const { toast } = useToast();
  const router = useRouter();
  const [email, setEmail] = useState("");

  const form = useForm<FormData>({
    resolver: zodResolver(userSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: FormData) => {
    setEmail(data.email);
    setIsLoading(true);

    try {
      const response = await fetch("/api/user/check-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      const result = await response.json();

      if (result.success) {
        if (result.data.verified) {
          const signInResult = await signIn("credentials", {
            redirect: true,
            email: data.email,
            password: data.password,
          });

          if (signInResult?.error) {
            form.setError("email", { type: "manual", message: signInResult.error });
          } else {
           
            form.reset();
          }
        } else {
          onOtpRequired(data.email);
        }
      } else {
        form.setError("email", { type: "manual", message: result.message });
      }
    } catch (error) {
      console.error("Error checking verification:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-4 w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Welcome back!</CardTitle>
        <CardDescription>Log in to your account.</CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
          <Button className="w-full my-4 text-white" type="submit">
            Submit
          </Button>
          <div className="mt-2 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline text-blue-500 underline-offset-4">
              Sign up
            </Link>
          </div>
        </form>
      </Form>
    </Card>
  );
};

export default Signin;
