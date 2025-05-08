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

const loginSchema = z.object({
  militaryId: z.string(),
  password: z.string(),
});

type FormData = z.infer<typeof loginSchema>;

const Signin = ({ onOtpRequired }: { onOtpRequired: (militaryId: string) => void }) => {
  const { isLoading, setIsLoading } = useLoadingState();
  const { toast } = useToast();
  const router = useRouter();
  const [militaryId, setMilitaryId] = useState("");

  const form = useForm<FormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { militaryId: "", password: "" },
  });

  const onSubmit = async (data: FormData) => {
    setMilitaryId(data.militaryId);
    setIsLoading(true);

    try {
      // 1. First try direct sign-in
      const signInResult = await signIn("credentials", {
        redirect: false,
        militaryId: data.militaryId,
        password: data.password,
        callbackUrl: "/client",
      });

      if (signInResult?.error) {
        // 2. If error, check if it's because user needs OTP
        const verificationResponse = await fetch("/api/user/check-verification", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            militaryId: data.militaryId 
          }),
        });

        if (!verificationResponse.ok) {
          const errorData = await verificationResponse.json();
          throw new Error(errorData.message || "Login failed");
        }

        const verificationResult = await verificationResponse.json();

        if (!verificationResult.verified) {
          // User needs OTP verification
          onOtpRequired(data.militaryId);
          return;
        }

        // If verified but still error, throw original error
        throw new Error(signInResult.error);
      }

      // 3. If no error, redirect to dashboard
      if (signInResult?.url) {
        router.push(signInResult.url);
      }

    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid Military ID or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-4 w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Military Login</CardTitle>
        <CardDescription>Enter your Military ID and password</CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="militaryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Military ID</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your Military ID" 
                    {...field} 
                    autoComplete="username"
                  />
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
                  <Input 
                    type="password" 
                    placeholder="Enter your password" 
                    {...field} 
                    autoComplete="current-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>

          <div className="text-center text-sm mt-4">
            <Link 
              href="/forgot-password" 
              className="text-blue-500 hover:underline"
            >
              Forgot password?
            </Link>
            <span className="mx-2">•</span>
            <Link 
              href="/signup" 
              className="text-blue-500 hover:underline"
            >
              Create account
            </Link>
          </div>
        </form>
      </Form>
    </Card>
  );
};

export default Signin;
