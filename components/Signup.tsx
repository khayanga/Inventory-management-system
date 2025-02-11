
"use client";
import { signup } from "@/app/actions/auth";
import { useActionState, useEffect } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export function Signup() {
  // Ensure default state structure
  const router = useRouter()
  const {toast} = useToast();
  const [state, action, pending] = useActionState(signup , { errors: {}, success: undefined });

  useEffect(() => {
    if (state?.success) {
      toast({
        title:'Account status',
        description:'Your account has been created successfully',
      })
      router.push("/signin"); 
    }
  }, [state, router]);

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Get started.</CardTitle>
        <CardDescription>Sign up to create your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" type="text" placeholder="name" defaultValue="" />
              {state?.errors?.username && <p className=" text-red-500 text-sm font-light">{state.errors.username}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" defaultValue="" />
              {state?.errors?.email && <p className=" text-red-500 text-sm font-light">{state.errors.email}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" placeholder="123" defaultValue="" />
              {state?.errors?.password && <p className=" text-red-500 text-sm font-light">{state.errors.password}</p>}
            </div>
          </div>

          <Button className="w-full my-4 text-white" disabled={pending} type="submit">
            Sign Up
          </Button>

          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <a href="#" className="underline underline-offset-4">
              Sign in
            </a>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}




