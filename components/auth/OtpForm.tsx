"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useLoadingState } from "@/components/LoadingContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const otpSchema = z.object({
  otp: z.string().length(6, { message: "OTP must be 6 digits" }),
});

interface OtpFormProps {
  militaryId: string;
  email: string;
  open: boolean;
  onClose: () => void;
  onVerified: () => void;
}

export function OtpForm({ militaryId, email, open, onClose, onVerified }: OtpFormProps) {
  const { toast } = useToast();
  const { isLoading, setIsLoading } = useLoadingState();

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const onSubmit = async (values: z.infer<typeof otpSchema>) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/user/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          militaryId,
          otp: values.otp,
        }),
      });

      let result: any;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        const text = await response.text();
        throw new Error(text || "Unexpected error");
      }

      if (!response.ok) {
        throw new Error(result.message || "Verification failed");
      }

      toast({
        title: "Success",
        description: "Your account has been verified successfully.",
      });

      onVerified();
      onClose(); // Close after success
    } catch (error: any) {
      form.setError("otp", {
        type: "manual",
        message: error.message || "Invalid OTP",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Verify Your Account</DialogTitle>
          <DialogDescription>
            Enter the 6-digit code sent to your email ({email})
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OTP Code</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="123456"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify OTP"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
