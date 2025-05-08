"use client";
import { signup } from "@/app/actions/auth";
import { useActionState, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { toast, useToast } from "@/hooks/use-toast";
import { MilitaryRank } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { IdCard, Lock, Mail, Shield, User } from "lucide-react";
import { RestrictedAccessBanner } from "../Banner";
import { AuthHeader } from "../AuthHeader";
import { OtpForm } from "./OtpForm";

export function Signup() {
  const router = useRouter();
 
  const [state, action, pending] = useActionState(signup, {
    errors: {},
    success: undefined,
    militaryId: "",
    email: "",
  });
   const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpData, setOtpData] = useState({ militaryId: "", email: "" });

  useEffect(() => {
    if (state?.success && state.militaryId && state.email) {
      setOtpData({
        militaryId: state.militaryId,
        email: state.email
      });
      setShowOtpModal(true);
    }
  }, [state]);

 

  return (
    <div className=" military-card flex min-h-screen flex-col bg-tactical-grid-bg">
      <div className="flex flex-col justify-center items-center flex-1 px-6 py-12">
        <div className="mb-8 flex flex-col items-center text-center">
          <Shield className="h-12 w-12 text-cyan-500 mb-4" />
          <h1 className="text-3xl font-bold tracking-tighter text-foreground">
            SENTINEL
          </h1>
          <p className="text-sm text-muted-foreground uppercase tracking-widest mt-1">
            Weapon Command Center
          </p>
        </div>
        <RestrictedAccessBanner className="mb-6 max-w-md" />
        <Card className="military-card w-full max-w-md shadow-lg backdrop-blur-sm">
          <CardHeader className="pb-0">
            <AuthHeader
              title="Create Account"
              subtitle="Enter your details to register"
            />
          </CardHeader>
          <CardContent className="pt-6">
            <form action={action} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="militaryId">Military ID</Label>
                <div className="relative">
                  <IdCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="militaryId"
                    name="militaryId"
                    type="text"
                    placeholder="e.g., ARMY-1234"
                    required
                    className="pl-10"
                  />
                  {state?.errors?.militaryId && (
                    <p className="text-red-500 text-sm">
                      {state.errors.militaryId.join(", ")}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    name="username"
                    placeholder="Choose a username"
                    type="text"
                    className="pl-10"
                    required
                  />
                  {state?.errors?.username && (
                    <p className="text-red-500 text-sm">
                      {state.errors.username.join(", ")}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    
                    className="pl-10"
                    required
                  />
                  {state?.errors?.password && (
                    <p className="text-red-500 text-sm">
                      {state.errors.password.join(", ")}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                  <Label htmlFor="rank">Rank*</Label>
                  <Select name="rank" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your rank" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(MilitaryRank).map((rank) => (
                        <SelectItem key={rank} value={rank}>
                          {rank}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {state?.errors?.rank && (
                    <p className="text-red-500 text-sm">
                      {state.errors.rank.join(", ")}
                    </p>
                  )}
                </div>


              <Button className="w-full mt-6" type="submit" disabled={pending}>
                {pending ? "Creating account..." : "Create Account"}
              </Button>

              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <a href="/" className="underline hover:text-primary">
                  Sign in
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <OtpForm
        militaryId={otpData.militaryId}
        email={otpData.email}
        open={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onVerified={() => {
          setShowOtpModal(false);
          router.push("/");
          toast({
            title: "Verification Successful",
            description: "You can now sign in",
          });
        
        }}
      />
      <footer className="py-4 px-6 text-center text-xs text-muted-foreground border-t border-border/10">
        <p>SENTINEL Weapon Command Center • Restricted Access • All activities are logged and monitored</p>
      </footer>
      
    </div>
  );
}
