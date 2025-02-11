"use client";
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLoadingState } from "@/components/LoadingContext";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const OtpForm = ({ email, open, onClose, onVerified }: 
  { email: string; open: boolean; onClose: () => void; onVerified: () => void }) => {

const otpSchema = z.object({
  otp: z.string().length(6, { message: "Invalid OTP" }),
});

type OtpFormData = z.infer<typeof otpSchema>;

    const { isLoading, setIsLoading } = useLoadingState();
  const { toast } = useToast();

  const otpForm = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const onOtpSubmit = async (data: { otp: string }) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/user/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: data.otp }),
      });

      const result = await response.json();

      if (result.success) {
        toast({ title: "Verification", description: "Email has been verified successfully" });
        onVerified();
        onClose();
      } else {
        otpForm.setError("otp", { type: "manual", message: result.message });
      }
    } catch (error) {
      console.error("OTP verification error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Verify your email</DialogTitle>
        <DialogDescription>Enter the 6-digit code sent to your email.</DialogDescription>
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
  )
}

export default OtpForm