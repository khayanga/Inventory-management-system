"use client";

import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";

const Page = () => {
  const [showOtpModal, setShowOtpModal] = React.useState(false); // Show OTP modal only for unverified users
  const [isOtpVerified, setIsOtpVerified] = React.useState(false); // OTP verification status
  const [email, setEmail] = React.useState(""); // Email state for OTP submission
  const [isVerified, setIsVerified] = React.useState(false); // User verification status
  const router = useRouter();

  const otpSchema = z.object({
    otp: z.string().length(6, { message: "Invalid OTP" }), // OTP must be 6 characters long
  });

  type OtpFormData = z.infer<typeof otpSchema>;

  const otpForm = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  // Handle OTP verification
  const onOtpSubmit = async (data: { otp: string }) => {
    try {
      const response = await fetch("/api/user/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp: data.otp }),
      });

      const result = await response.json();

      if (result.success) {
        setIsOtpVerified(true); // Mark OTP as verified
        setShowOtpModal(false); // Close the dialog
        // Now attempt to log the user in
        const signInResult = await signIn("credentials", {
          redirect: false,
          email,
          password: form.getValues().password, // Assuming password is available in form state
        });

        if (signInResult?.error) {
          form.setError("email", { type: "manual", message: signInResult.error });
          return;
        }

        router.push("/admin"); 
        form.reset();
      } else {
        otpForm.setError("otp", { type: "manual", message: result.message });
      }
    } catch (error) {
      console.error("OTP verification error:", error);
    }
  };

  // User login schema
  const userSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
  });

  type FormData = z.infer<typeof userSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle user login and verification
  const onSubmit = async (data: { email: string; password: string }) => {
    setEmail(data.email); // Set email for OTP submission
    try {
      // Check if the user exists and their verification status
      const response = await fetch("/api/user/check-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email }),
      });

      const result = await response.json();

      if (result.success) {
        if (result.data.verified) {
          setIsVerified(true);
          const signInResult = await signIn("credentials", {
            redirect: false,
            email: data.email,
            password: data.password,
          });

          if (signInResult?.error) {
            form.setError("email", { type: "manual", message: signInResult.error });
            return;
          }

          router.push("/admin");
          form.reset();
        } else {
          setShowOtpModal(true); // Show OTP modal if user is unverified
        }
      } else {
        form.setError("email", { type: "manual", message: result.message });
      }
    } catch (error) {
      console.error("Error checking verification:", error);
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-8">
      {/* OTP Modal */}
      <Dialog open={showOtpModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify your  email </DialogTitle>
            <DialogDescription>
            Enter the 6-digit code sent to your email.
          </DialogDescription>
          </DialogHeader>
          <Form {...otpForm}>
            <form onSubmit={otpForm.handleSubmit(onOtpSubmit)}>
              <FormField
                control={otpForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OTP</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter OTP" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full mt-4">
                Submit
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Login Form */}
      {!isOtpVerified && (
        <div className="w-full max-w-sm p-4">
          <Card className="p-4">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Welcome back!!</CardTitle>
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
                <Button className="w-full my-4" type="submit">
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
        </div>
      )}
    </div>
  );
};

export default Page;





